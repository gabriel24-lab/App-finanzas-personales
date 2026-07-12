const mongoose = require("mongoose");

/**
 * Un documento por combinación (user_id, category): representa el límite
 * mensual de gasto que el usuario definió para esa categoría.
 * No incluye mes/año porque el límite es recurrente cada mes; el cálculo
 * de "gastado este mes" se hace en el frontend/consultas de Transaction.
 */
const BudgetSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true, trim: true },
  monthly_limit: { type: Number, required: true, min: 0, default: 0 },
});

// Un usuario no puede tener dos límites para la misma categoría
BudgetSchema.index({ user_id: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Budget", BudgetSchema);
