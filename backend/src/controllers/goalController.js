const mongoose = require("mongoose");
const Goal = require("../models/Goal");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

function assertValidId(id, label = "id") {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, `${label} no es un ObjectId válido.`);
  }
}

/**
 * GET /api/goals/:userId
 * Lista las metas de ahorro del usuario (las más recientes primero).
 */
const getGoals = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  assertValidId(userId, "userId");

  if (userId !== req.userId) {
    throw new ApiError(403, "No tienes permiso para ver estas metas.");
  }

  const goals = await Goal.find({ user_id: userId }).sort({ createdAt: -1 });
  res.status(200).json({ goals });
});

/**
 * POST /api/goals
 * Crea una meta. Body: { user_id, name, target_amount, current_amount?, color? }
 */
const createGoal = asyncHandler(async (req, res) => {
  const { user_id, name, target_amount, current_amount = 0, color } = req.body;

  if (user_id !== req.userId) {
    throw new ApiError(403, "No tienes permiso para crear metas para otro usuario.");
  }

  const goal = await Goal.create({
    user_id,
    name,
    target_amount,
    // Nunca puede empezar por encima de la meta.
    current_amount: Math.min(current_amount, target_amount),
    ...(color ? { color } : {}),
  });

  res.status(201).json({ goal });
});

/**
 * POST /api/goals/:id/funds
 * Suma un abono a la meta. La suma y el tope (target_amount) se aplican
 * dentro de la propia operación de MongoDB, así que dos abonos simultáneos
 * desde dispositivos distintos no se pisan entre sí.
 * Body: { amount }
 */
const addFunds = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;
  assertValidId(id);

  const goal = await Goal.findOneAndUpdate(
    { _id: id, user_id: req.userId },
    [
      {
        $set: {
          current_amount: {
            $min: [{ $add: ["$current_amount", amount] }, "$target_amount"],
          },
        },
      },
    ],
    { new: true }
  );

  if (!goal) {
    throw new ApiError(404, "Meta no encontrada.");
  }

  res.status(200).json({ goal });
});

/**
 * DELETE /api/goals/:id
 */
const deleteGoal = asyncHandler(async (req, res) => {
  const { id } = req.params;
  assertValidId(id);

  const goal = await Goal.findOneAndDelete({ _id: id, user_id: req.userId });
  if (!goal) {
    throw new ApiError(404, "Meta no encontrada.");
  }

  res.status(200).json({ message: "Meta eliminada correctamente." });
});

module.exports = { getGoals, createGoal, addFunds, deleteGoal };