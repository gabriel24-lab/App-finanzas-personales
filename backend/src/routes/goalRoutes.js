const express = require("express");
const {
  getGoals,
  createGoal,
  addFunds,
  deleteGoal,
} = require("../controllers/goalController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createGoalSchema, addGoalFundsSchema } = require("../validation/schemas");

const router = express.Router();

// Todas las rutas de metas requieren estar autenticado.
router.use(protect);

// GET /api/goals/:userId
router.get("/:userId", getGoals);

// POST /api/goals
router.post("/", validate(createGoalSchema), createGoal);

// POST /api/goals/:id/funds
router.post("/:id/funds", validate(addGoalFundsSchema), addFunds);

// DELETE /api/goals/:id
router.delete("/:id", deleteGoal);

module.exports = router;