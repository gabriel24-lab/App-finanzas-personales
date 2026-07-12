const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * GET /api/budgets/:userId
 * Devuelve todos los límites de presupuesto del usuario como un mapa
 * { categoria: limite }, que es el formato que espera el frontend.
 */
const getBudgets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "userId no es un ObjectId válido.");
  }

  if (userId !== req.userId) {
    throw new ApiError(403, "No tienes permiso para ver estos presupuestos.");
  }

  const budgets = await Budget.find({ user_id: userId });

  const budgetMap = budgets.reduce((acc, b) => {
    acc[b.category] = b.monthly_limit;
    return acc;
  }, {});

  res.status(200).json({ budgets: budgetMap });
});

/**
 * PUT /api/budgets/:userId
 * Crea o actualiza (upsert) el límite mensual de una categoría.
 * Body esperado: { "category": "Comida", "monthly_limit": 400 }
 */
const upsertBudget = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { category, monthly_limit } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "userId no es un ObjectId válido.");
  }

  if (userId !== req.userId) {
    throw new ApiError(403, "No tienes permiso para modificar estos presupuestos.");
  }

  if (!category || typeof category !== "string") {
    throw new ApiError(400, "El campo 'category' es obligatorio.");
  }

  const parsedLimit = Number(monthly_limit);
  if (Number.isNaN(parsedLimit) || parsedLimit < 0) {
    throw new ApiError(400, "El campo 'monthly_limit' debe ser un número mayor o igual a 0.");
  }

  const budget = await Budget.findOneAndUpdate(
    { user_id: userId, category },
    { $set: { monthly_limit: parsedLimit } },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({ message: "Presupuesto actualizado correctamente.", budget });
});

module.exports = { getBudgets, upsertBudget };
