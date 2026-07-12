const express = require("express");
const { getBudgets, upsertBudget } = require("../controllers/budgetController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Todas las rutas de presupuestos requieren estar autenticado.
router.use(protect);

// GET /api/budgets/:userId
router.get("/:userId", getBudgets);

// PUT /api/budgets/:userId
router.put("/:userId", upsertBudget);

module.exports = router;
