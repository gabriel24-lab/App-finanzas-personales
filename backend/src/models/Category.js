const mongoose = require("mongoose");

/**
 * Cada categoría le pertenece a un usuario (nada de catálogo global): así
 * cada quien puede renombrar, recolorear o borrar libremente sin afectar a
 * los demás. `type` determina si aparece como opción al registrar un
 * ingreso o un gasto.
 *
 * Nota de diseño: Transaction.category y Budget.category siguen guardando
 * el *nombre* de la categoría (string), no un ObjectId. Esto evita una
 * migración de esos modelos y mantiene el histórico intacto aunque el
 * usuario borre o edite una categoría más adelante.
 */
const CategorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  color: {
    type: String,
    required: true,
    default: "#6366f1",
    match: [/^#[0-9a-fA-F]{6}$/, "El color debe ser un hexadecimal válido (ej: #6366f1)."],
  },
  icon: { type: String, required: true, default: "Tag" }, // nombre de ícono de lucide-react
  is_default: { type: Boolean, default: false }, // sembrada automáticamente al registrarse
  created_at: { type: Date, default: Date.now },
});

// Un usuario no puede tener dos categorías con el mismo nombre para el mismo tipo.
CategorySchema.index({ user_id: 1, name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model("Category", CategorySchema);
