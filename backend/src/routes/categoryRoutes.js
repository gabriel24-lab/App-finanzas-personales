const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Todas las rutas de categorías requieren estar autenticado.
router.use(protect);

// GET /api/categories/:userId
router.get("/:userId", getCategories);

// POST /api/categories
router.post("/", createCategory);

// PUT /api/categories/:id
router.put("/:id", updateCategory);

// DELETE /api/categories/:id
router.delete("/:id", deleteCategory);

module.exports = router;
