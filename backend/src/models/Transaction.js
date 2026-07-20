const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  wallet_id: { type: String, required: true }, // Debe coincidir con la wallet_id dentro del usuario
  description: { type: String, required: true, trim: true },
  amount: {
    type: Number,
    required: true,
    min: [0.01, "El monto debe ser mayor que cero."],
  }, // Siempre positivo en la BD; el signo lo determina "type"
  type: { type: String, enum: ["income", "expense"], required: true },
  category: { type: String, required: true }, // Ej: "Comida", "Salario"
  currency_code: { type: String, required: true, uppercase: true },
  date: { type: Date, default: Date.now },
});

// Acelera las consultas más comunes: historial por usuario, filtrado por billetera/fecha
TransactionSchema.index({ user_id: 1, wallet_id: 1, date: -1 });

// Índice de texto para el endpoint de búsqueda (/search?q=...).
// Es más eficiente que $regex y resistente a ReDoS al no ejecutar expresiones
// regulares sobre cada documento.
TransactionSchema.index({ description: "text", category: "text" });

module.exports = mongoose.model("Transaction", TransactionSchema);
