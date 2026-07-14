const mongoose = require("mongoose");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * GET /api/users/:id
 * Devuelve el usuario (sin password) junto con sus billeteras y balances.
 * Requiere sesión (`protect`) y solo permite que el usuario consulte su
 * propia cuenta, para evitar enumeración/fuga de datos de otras cuentas.
 */
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id no es un ObjectId válido.");
  }

  if (id !== req.userId) {
    throw new ApiError(403, "No tienes permiso para ver esta cuenta.");
  }

  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new ApiError(404, "Usuario no encontrado.");
  }

  res.status(200).json({ user });
});

/**
 * POST /api/users/:id/wallets
 * Agrega una nueva billetera (moneda) a un usuario existente.
 * Requiere sesión y solo permite modificar la propia cuenta.
 */
const addWallet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { wallet_id, currency_code, currency_symbol, account_name, current_balance } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id no es un ObjectId válido.");
  }

  if (id !== req.userId) {
    throw new ApiError(403, "No tienes permiso para modificar esta cuenta.");
  }

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "Usuario no encontrado.");
  }

  if (user.findWallet(wallet_id)) {
    throw new ApiError(409, `Ya existe una billetera con wallet_id '${wallet_id}'.`);
  }

  user.wallets.push({
    wallet_id,
    currency_code: String(currency_code).toUpperCase(),
    currency_symbol,
    account_name,
    current_balance,
  });

  await user.save();

  res.status(201).json({ message: "Billetera agregada correctamente.", wallets: user.wallets });
});

module.exports = { getUser, addWallet };
