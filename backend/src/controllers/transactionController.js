const mongoose = require("mongoose");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

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

module.exports = {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
};
