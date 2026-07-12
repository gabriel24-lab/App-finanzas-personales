const express = require("express");
const {
  createTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/transactionController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Todas las rutas de transacciones requieren estar autenticado.
router.use(protect);

// POST /api/transactions
router.post("/", createTransaction);

// GET /api/transactions/:userId?wallet_id=...&currency_code=...&page=1&limit=20
router.get("/:userId", getTransactions);

// PUT /api/transactions/:id
router.put("/:id", updateTransaction);

// DELETE /api/transactions/:id
router.delete("/:id", deleteTransaction);

module.exports = router;
