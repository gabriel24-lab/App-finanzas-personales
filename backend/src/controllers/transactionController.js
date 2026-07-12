const mongoose = require("mongoose");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  monthRange,
  pctChange,
  sumByType,
  groupByCategory,
  escapeRegex,
} = require("../utils/reportUtils");

/**
 * POST /api/transactions
 *
 * Crea una transacción y actualiza el balance de la billetera correspondiente
 * de forma atómica: si cualquiera de los dos pasos falla, no se persiste nada.
 *
 * NOTA: las transacciones multi-documento de Mongoose/MongoDB requieren que
 * la base de datos corra como Replica Set (MongoDB Atlas ya lo es por defecto;
 * en local basta con iniciar un replica set de un solo nodo).
 *
 * Body esperado:
 * {
 *   "user_id": "664f1c...",       // en un flujo con auth, vendría de req.user.id
 *   "wallet_id": "wallet_cop",
 *   "description": "Compra de supermercado",
 *   "amount": 154.30,             // siempre positivo, el signo lo define "type"
 *   "type": "expense",            // "income" | "expense"
 *   "category": "Comida",
 *   "currency_code": "COP",
 *   "date": "2026-07-10"          // opcional, default = ahora
 * }
 */
const createTransaction = asyncHandler(async (req, res) => {
  const { user_id, wallet_id, description, amount, type, category, currency_code, date } =
    req.body;

  // --- Validación de entrada ---
  const requiredFields = { user_id, wallet_id, description, amount, type, category, currency_code };
  const missing = Object.entries(requiredFields)
    .filter(([, value]) => value === undefined || value === null || value === "")
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new ApiError(400, `Faltan campos obligatorios: ${missing.join(", ")}`);
  }

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new ApiError(400, "user_id no es un ObjectId válido.");
  }

  if (user_id !== req.userId) {
    throw new ApiError(403, "No tienes permiso para crear movimientos en otra cuenta.");
  }

  const parsedAmount = Number(amount);
  if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new ApiError(400, "El monto debe ser un número mayor que cero.");
  }

  if (!["income", "expense"].includes(type)) {
    throw new ApiError(400, "El campo 'type' debe ser 'income' o 'expense'.");
  }

  const session = await mongoose.startSession();

  try {
    let createdTransaction;
    let updatedWallet;

    await session.withTransaction(async () => {
      // 1. Buscar al usuario dentro de la sesión (bloquea la lectura a esta transacción)
      const user = await User.findById(user_id).session(session);
      if (!user) {
        throw new ApiError(404, "Usuario no encontrado.");
      }

      // 2. Ubicar la billetera indicada dentro del array embebido
      const wallet = user.findWallet(wallet_id);
      if (!wallet) {
        throw new ApiError(404, `La billetera '${wallet_id}' no existe para este usuario.`);
      }

      // 3. Regla de negocio: la moneda de la transacción debe coincidir con la de la billetera
      if (wallet.currency_code !== String(currency_code).toUpperCase()) {
        throw new ApiError(
          400,
          `La billetera '${wallet_id}' opera en ${wallet.currency_code}, no en ${currency_code}.`
        );
      }

      // 4. Calcular el impacto en el balance según el tipo de movimiento
      const delta = type === "income" ? parsedAmount : -parsedAmount;
      wallet.current_balance = Number((wallet.current_balance + delta).toFixed(2));

      // Mongoose no siempre detecta mutaciones directas sobre subdocumentos
      // dentro de un array embebido; lo marcamos explícitamente como modificado.
      user.markModified("wallets");
      await user.save({ session });

      // 5. Crear el registro de la transacción (amount siempre positivo en BD)
      const [transactionDoc] = await Transaction.create(
        [
          {
            user_id,
            wallet_id,
            description,
            amount: parsedAmount,
            type,
            category,
            currency_code: String(currency_code).toUpperCase(),
            ...(date ? { date: new Date(date) } : {}),
          },
        ],
        { session }
      );

      createdTransaction = transactionDoc;
      updatedWallet = wallet;
    });

    res.status(201).json({
      message: "Transacción registrada correctamente.",
      transaction: createdTransaction,
      wallet: updatedWallet,
    });
  } finally {
    session.endSession();
  }
});

/**
 * GET /api/transactions/:userId
 * Query params opcionales: wallet_id, currency_code, category, type, page, limit
 *
 * Soporta el filtrado en cascada que necesita el frontend: al cambiar de
 * moneda/billetera activa, basta con pasar wallet_id o currency_code.
 */
const getTransactions = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { wallet_id, currency_code, category, type, page = 1, limit = 20 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "userId no es un ObjectId válido.");
  }

  if (userId !== req.userId) {
    throw new ApiError(403, "No tienes permiso para ver estos movimientos.");
  }

  const filter = { user_id: userId };
  if (wallet_id) filter.wallet_id = wallet_id;
  if (currency_code) filter.currency_code = String(currency_code).toUpperCase();
  if (category) filter.category = category;
  if (type) filter.type = type;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ date: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Transaction.countDocuments(filter),
  ]);

  res.status(200).json({
    data: transactions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

/**
 * DELETE /api/transactions/:id
 * Elimina una transacción y revierte su efecto sobre el balance de la billetera.
 */
const deleteTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id no es un ObjectId válido.");
  }

  const session = await mongoose.startSession();

  try {
    let updatedWallet;

    await session.withTransaction(async () => {
      const transaction = await Transaction.findById(id).session(session);
      if (!transaction) {
        throw new ApiError(404, "Transacción no encontrada.");
      }

      if (transaction.user_id.toString() !== req.userId) {
        throw new ApiError(403, "No tienes permiso para eliminar esta transacción.");
      }

      const user = await User.findById(transaction.user_id).session(session);
      if (!user) {
        throw new ApiError(404, "Usuario asociado a la transacción no encontrado.");
      }

      const wallet = user.findWallet(transaction.wallet_id);
      if (!wallet) {
        throw new ApiError(404, "La billetera asociada a esta transacción ya no existe.");
      }

      // Revertir el efecto original: si era income, restamos; si era expense, sumamos.
      const reversal = transaction.type === "income" ? -transaction.amount : transaction.amount;
      wallet.current_balance = Number((wallet.current_balance + reversal).toFixed(2));

      user.markModified("wallets");
      await user.save({ session });
      await transaction.deleteOne({ session });

      updatedWallet = wallet;
    });

    res.status(200).json({
      message: "Transacción eliminada y balance revertido correctamente.",
      wallet: updatedWallet,
    });
  } finally {
    session.endSession();
  }
});

/**
 * PUT /api/transactions/:id
 *
 * Edita una transacción existente y ajusta el balance de la billetera
 * de forma atómica: revierte el efecto original y aplica el nuevo.
 * No permite cambiar user_id ni wallet_id (evita mover el movimiento
 * entre usuarios/billeteras distintas); sí permite cambiar description,
 * amount, type, category y date.
 *
 * Body esperado (todos los campos opcionales, se actualiza solo lo enviado):
 * {
 *   "description": "Compra de supermercado",
 *   "amount": 160,
 *   "type": "expense",
 *   "category": "Comida",
 *   "date": "2026-07-10"
 * }
 */
const updateTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description, amount, type, category, date } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id no es un ObjectId válido.");
  }

  let parsedAmount;
  if (amount !== undefined) {
    parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new ApiError(400, "El monto debe ser un número mayor que cero.");
    }
  }

  if (type !== undefined && !["income", "expense"].includes(type)) {
    throw new ApiError(400, "El campo 'type' debe ser 'income' o 'expense'.");
  }

  const session = await mongoose.startSession();

  try {
    let updatedTransaction;
    let updatedWallet;

    await session.withTransaction(async () => {
      const transaction = await Transaction.findById(id).session(session);
      if (!transaction) {
        throw new ApiError(404, "Transacción no encontrada.");
      }

      if (transaction.user_id.toString() !== req.userId) {
        throw new ApiError(403, "No tienes permiso para editar esta transacción.");
      }

      const user = await User.findById(transaction.user_id).session(session);
      if (!user) {
        throw new ApiError(404, "Usuario asociado a la transacción no encontrado.");
      }

      const wallet = user.findWallet(transaction.wallet_id);
      if (!wallet) {
        throw new ApiError(404, "La billetera asociada a esta transacción ya no existe.");
      }

      // 1. Revertir el efecto original sobre el balance
      const reversal = transaction.type === "income" ? -transaction.amount : transaction.amount;
      let newBalance = wallet.current_balance + reversal;

      // 2. Aplicar el nuevo efecto con los valores actualizados (o los previos si no cambiaron)
      const finalType = type ?? transaction.type;
      const finalAmount = parsedAmount ?? transaction.amount;
      const delta = finalType === "income" ? finalAmount : -finalAmount;
      newBalance = Number((newBalance + delta).toFixed(2));

      wallet.current_balance = newBalance;
      user.markModified("wallets");
      await user.save({ session });

      // 3. Actualizar los campos enviados en la transacción
      if (description !== undefined) transaction.description = description;
      if (parsedAmount !== undefined) transaction.amount = parsedAmount;
      if (type !== undefined) transaction.type = type;
      if (category !== undefined) transaction.category = category;
      if (date !== undefined) transaction.date = new Date(date);

      await transaction.save({ session });

      updatedTransaction = transaction;
      updatedWallet = wallet;
    });

    res.status(200).json({
      message: "Transacción actualizada correctamente.",
      transaction: updatedTransaction,
      wallet: updatedWallet,
    });
  } finally {
    session.endSession();
  }
});

/**
 * GET /api/transactions/report/comparative
 * Compara el mes actual vs el anterior por categoría y totales.
 */
const getComparativeReport = asyncHandler(async (req, res) => {
  const { wallet_id } = req.query;
  const current = monthRange(0);
  const previous = monthRange(-1);

  const baseFilter = { user_id: req.userId };
  if (wallet_id) baseFilter.wallet_id = wallet_id;

  const [currentTxs, previousTxs] = await Promise.all([
    Transaction.find({
      ...baseFilter,
      date: { $gte: current.start, $lte: current.end },
    }),
    Transaction.find({
      ...baseFilter,
      date: { $gte: previous.start, $lte: previous.end },
    }),
  ]);

  const currentIncome = sumByType(currentTxs, "income");
  const currentExpense = sumByType(currentTxs, "expense");
  const previousIncome = sumByType(previousTxs, "income");
  const previousExpense = sumByType(previousTxs, "expense");

  const currentByCat = groupByCategory(currentTxs, "expense");
  const previousByCat = groupByCategory(previousTxs, "expense");
  const allCategories = new Set([
    ...Object.keys(currentByCat),
    ...Object.keys(previousByCat),
  ]);

  const categoryComparison = [...allCategories]
    .map((category) => {
      const curr = currentByCat[category] || 0;
      const prev = previousByCat[category] || 0;
      return {
        category,
        current: curr,
        previous: prev,
        change: curr - prev,
        changePercent: pctChange(curr, prev),
      };
    })
    .sort((a, b) => b.current - a.current);

  res.status(200).json({
    currentMonth: {
      year: current.year,
      month: current.month + 1,
      income: currentIncome,
      expense: currentExpense,
      net: currentIncome - currentExpense,
    },
    previousMonth: {
      year: previous.year,
      month: previous.month + 1,
      income: previousIncome,
      expense: previousExpense,
      net: previousIncome - previousExpense,
    },
    trends: {
      incomeChangePercent: pctChange(currentIncome, previousIncome),
      expenseChangePercent: pctChange(currentExpense, previousExpense),
      netChangePercent: pctChange(
        currentIncome - currentExpense,
        previousIncome - previousExpense
      ),
    },
    categoryComparison,
  });
});

/**
 * GET /api/transactions/report/projection
 * Proyecta flujo de caja a fin de mes basado en promedios de los últimos 3 meses.
 */
const getCashFlowProjection = asyncHandler(async (req, res) => {
  const { wallet_id } = req.query;
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, "Usuario no encontrado.");

  const wallet = wallet_id
    ? user.findWallet(wallet_id)
    : user.wallets?.[0];
  if (!wallet) throw new ApiError(404, "Billetera no encontrada.");

  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

  const historical = await Transaction.find({
    user_id: req.userId,
    wallet_id: wallet.wallet_id,
    date: { $gte: threeMonthsAgo, $lt: monthRange(0).start },
  });

  const avgIncome =
    historical.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0) / 3;
  const avgExpense =
    historical.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0) / 3;

  const currentMonthTxs = await Transaction.find({
    user_id: req.userId,
    wallet_id: wallet.wallet_id,
    date: { $gte: monthRange(0).start, $lte: monthRange(0).end },
  });

  const mtdIncome = sumByType(currentMonthTxs, "income");
  const mtdExpense = sumByType(currentMonthTxs, "expense");

  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const daysRemaining = daysInMonth - dayOfMonth;

  const projectedIncome = mtdIncome + (avgIncome / daysInMonth) * daysRemaining;
  const projectedExpense = mtdExpense + (avgExpense / daysInMonth) * daysRemaining;
  const projectedNet = projectedIncome - projectedExpense;

  const dailyProjection = [];
  let runningBalance = wallet.current_balance;
  for (let d = dayOfMonth; d <= daysInMonth; d += 1) {
    const dailyIncome = avgIncome / daysInMonth;
    const dailyExpense = avgExpense / daysInMonth;
    runningBalance += dailyIncome - dailyExpense;
    dailyProjection.push({
      day: d,
      projectedBalance: Number(runningBalance.toFixed(2)),
      optimistic: Number((runningBalance + dailyIncome * 0.2).toFixed(2)),
      pessimistic: Number((runningBalance - dailyExpense * 0.2).toFixed(2)),
    });
  }

  res.status(200).json({
    currentBalance: wallet.current_balance,
    currency: wallet.currency_code,
    monthToDate: { income: mtdIncome, expense: mtdExpense, net: mtdIncome - mtdExpense },
    averages: {
      monthlyIncome: Number(avgIncome.toFixed(2)),
      monthlyExpense: Number(avgExpense.toFixed(2)),
    },
    projection: {
      projectedIncome: Number(projectedIncome.toFixed(2)),
      projectedExpense: Number(projectedExpense.toFixed(2)),
      projectedNet: Number(projectedNet.toFixed(2)),
      projectedEndBalance: Number(
        (wallet.current_balance + projectedNet - (mtdIncome - mtdExpense)).toFixed(2)
      ),
      daysRemaining,
    },
    dailyProjection,
  });
});

/**
 * GET /api/transactions/report/insights
 * Genera insights automáticos comparando el mes actual vs el anterior.
 */
const getInsights = asyncHandler(async (req, res) => {
  const { wallet_id } = req.query;
  const baseFilter = { user_id: req.userId };
  if (wallet_id) baseFilter.wallet_id = wallet_id;

  const current = monthRange(0);
  const previous = monthRange(-1);

  const [currentTxs, previousTxs] = await Promise.all([
    Transaction.find({
      ...baseFilter,
      date: { $gte: current.start, $lte: current.end },
    }),
    Transaction.find({
      ...baseFilter,
      date: { $gte: previous.start, $lte: previous.end },
    }),
  ]);

  const insights = [];
  const currentExpense = sumByType(currentTxs, "expense");
  const previousExpense = sumByType(previousTxs, "expense");
  const currentIncome = sumByType(currentTxs, "income");
  const previousIncome = sumByType(previousTxs, "income");
  const currentNet = currentIncome - currentExpense;
  const previousNet = previousIncome - previousExpense;

  const expensePct = pctChange(currentExpense, previousExpense);
  if (previousExpense > 0 || currentExpense > 0) {
    insights.push({
      id: "expense-trend",
      type: "expense",
      severity: expensePct > 15 ? "warning" : expensePct < -10 ? "positive" : "neutral",
      icon: expensePct > 0 ? "trending-up" : "trending-down",
      message:
        expensePct > 0
          ? `Gastaste ${Math.abs(expensePct)}% más este mes que el anterior`
          : expensePct < 0
            ? `Redujiste tus gastos un ${Math.abs(expensePct)}% respecto al mes pasado`
            : "Tus gastos se mantienen similares al mes anterior",
      changePercent: expensePct,
    });
  }

  const savingsPct = pctChange(currentNet, previousNet);
  if (previousNet !== 0 || currentNet !== 0) {
    insights.push({
      id: "savings-trend",
      type: "savings",
      severity: savingsPct > 10 ? "positive" : savingsPct < -10 ? "warning" : "neutral",
      icon: "piggy-bank",
      message:
        savingsPct > 0
          ? `Tu ahorro neto subió ${Math.abs(savingsPct)}% vs el mes anterior`
          : savingsPct < 0
            ? `Tu ahorro neto bajó ${Math.abs(savingsPct)}% vs el mes anterior`
            : "Tu ahorro neto se mantiene estable",
      changePercent: savingsPct,
    });
  }

  const currentByCat = groupByCategory(currentTxs, "expense");
  const previousByCat = groupByCategory(previousTxs, "expense");

  Object.keys(currentByCat).forEach((category) => {
    const curr = currentByCat[category];
    const prev = previousByCat[category] || 0;
    const change = pctChange(curr, prev);
    if (Math.abs(change) >= 20 && curr > 0) {
      insights.push({
        id: `cat-${category}`,
        type: "category",
        category,
        severity: change > 30 ? "warning" : change < -20 ? "positive" : "neutral",
        icon: "tag",
        message:
          change > 0
            ? `Gastaste ${Math.abs(change)}% más en ${category}`
            : `Gastaste ${Math.abs(change)}% menos en ${category}`,
        changePercent: change,
      });
    }
  });

  const topCategory = Object.entries(currentByCat).sort((a, b) => b[1] - a[1])[0];
  if (topCategory && currentExpense > 0) {
    const [name, amount] = topCategory;
    const share = Number(((amount / currentExpense) * 100).toFixed(0));
    insights.push({
      id: "top-category",
      type: "highlight",
      category: name,
      severity: "neutral",
      icon: "star",
      message: `${name} concentra el ${share}% de tus gastos este mes`,
      changePercent: share,
    });
  }

  res.status(200).json({ insights: insights.slice(0, 8) });
});

/**
 * GET /api/transactions/search?q=...
 * Búsqueda por descripción, categoría o monto.
 */
const searchTransactions = asyncHandler(async (req, res) => {
  const { q, wallet_id, type, limit = 20 } = req.query;

  if (!q || String(q).trim().length < 2) {
    throw new ApiError(400, "La búsqueda debe tener al menos 2 caracteres.");
  }

  const query = String(q).trim();
  const filter = { user_id: req.userId };

  if (wallet_id) filter.wallet_id = wallet_id;
  if (type) filter.type = type;

  const numericQuery = Number(query.replace(/[^\d.-]/g, ""));
  const orConditions = [
    { description: { $regex: escapeRegex(query), $options: "i" } },
    { category: { $regex: escapeRegex(query), $options: "i" } },
  ];
  if (!Number.isNaN(numericQuery) && numericQuery > 0) {
    orConditions.push({ amount: numericQuery });
  }

  filter.$or = orConditions;

  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const results = await Transaction.find(filter)
    .sort({ date: -1 })
    .limit(limitNum);

  res.status(200).json({ data: results, query, total: results.length });
});

/**
 * GET /api/transactions/export?format=csv|xlsx
 * Exporta transacciones filtradas a CSV o Excel.
 */
const exportTransactions = asyncHandler(async (req, res) => {
  const { format = "csv", wallet_id, type, category, from, to } = req.query;

  if (!["csv", "xlsx"].includes(format)) {
    throw new ApiError(400, "Formato no soportado. Usa csv o xlsx.");
  }

  const filter = { user_id: req.userId };
  if (wallet_id) filter.wallet_id = wallet_id;
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const transactions = await Transaction.find(filter).sort({ date: -1 }).limit(5000);

  const rows = transactions.map((t) => ({
    fecha: new Date(t.date).toISOString().split("T")[0],
    descripcion: t.description,
    categoria: t.category,
    tipo: t.type === "income" ? "Ingreso" : "Gasto",
    monto: t.amount,
    moneda: t.currency_code,
    billetera: t.wallet_id,
  }));

  const timestamp = new Date().toISOString().split("T")[0];

  if (format === "csv") {
    const parser = new Parser({ fields: Object.keys(rows[0] || {}) });
    const csv = rows.length > 0 ? parser.parse(rows) : "fecha,descripcion,categoria,tipo,monto,moneda,billetera\n";
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="transacciones-${timestamp}.csv"`
    );
    return res.send("\uFEFF" + csv);
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Transacciones");
  sheet.columns = [
    { header: "Fecha", key: "fecha", width: 14 },
    { header: "Descripción", key: "descripcion", width: 32 },
    { header: "Categoría", key: "categoria", width: 18 },
    { header: "Tipo", key: "tipo", width: 12 },
    { header: "Monto", key: "monto", width: 14 },
    { header: "Moneda", key: "moneda", width: 10 },
    { header: "Billetera", key: "billetera", width: 16 },
  ];
  sheet.addRows(rows);
  sheet.getRow(1).font = { bold: true };

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="transacciones-${timestamp}.xlsx"`
  );
  await workbook.xlsx.write(res);
  res.end();
});

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  getComparativeReport,
  getCashFlowProjection,
  getInsights,
  searchTransactions,
  exportTransactions,
};
