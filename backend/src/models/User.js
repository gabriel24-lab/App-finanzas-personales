const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const WalletSchema = new mongoose.Schema(
  {
    wallet_id: { type: String, required: true }, // Identificador único corto (ej: wallet_cop)
    currency_code: { type: String, required: true, uppercase: true }, // Ej: "COP", "USD"
    currency_symbol: { type: String, required: true }, // Ej: "$", "€"
    current_balance: { type: Number, required: true, default: 0 },
    account_name: { type: String, required: true }, // Ej: "Efectivo", "Cuenta Bancaria"
  },
  { _id: false } // wallet_id ya funciona como identificador propio del subdocumento
);

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Hash de la contraseña
  wallets: [WalletSchema], // Array de subdocumentos
  created_at: { type: Date, default: Date.now },
});

// Evita duplicar wallet_id dentro del mismo usuario
UserSchema.pre("save", function guardWalletIds(next) {
  const ids = this.wallets.map((w) => w.wallet_id);
  const hasDuplicates = new Set(ids).size !== ids.length;
  if (hasDuplicates) {
    return next(new Error("El usuario tiene wallet_id duplicados en su array de wallets."));
  }
  next();
});

// Hashea la contraseña automáticamente si fue modificada
UserSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Helper para ubicar una billetera específica dentro del array embebido
UserSchema.methods.findWallet = function findWallet(wallet_id) {
  return this.wallets.find((w) => w.wallet_id === wallet_id);
};

module.exports = mongoose.model("User", UserSchema);
