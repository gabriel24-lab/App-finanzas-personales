const mongoose = require("mongoose");

/**
 * Meta de ahorro de un usuario. Se guarda en la base de datos (y no en el
 * navegador) para que aparezca en cualquier dispositivo donde el usuario
 * inicie sesión.
 */
const GoalSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    target_amount: { type: Number, required: true, min: 0.01 },
    current_amount: { type: Number, required: true, min: 0, default: 0 },
    color: { type: String, trim: true, default: "#6366f1" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", GoalSchema);