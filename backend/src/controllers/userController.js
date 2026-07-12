const mongoose = require("mongoose");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * POST /api/users
 * Registra un usuario. Puede incluir billeteras iniciales en el body.
 */
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, wallets = [] } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "name, email y password son obligatorios.");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, "Ya existe un usuario registrado con ese email.");
  }

  const user = await User.create({ name, email, password, wallets });

  const { password: _omit, ...safeUser } = user.toObject();
  res.status(201).json({ message: "Usuario creado correctamente.", user: safeUser });
});

/**
 * GET /api/users/:id
 * Devuelve el usuario (sin password) junto con sus billeteras y balances.
 */
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id no es un ObjectId válido.");
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
 */
const addWallet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { wallet_id, currency_code, currency_symbol, account_name, current_balance = 0 } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id no es un ObjectId válido.");
  }

  if (!wallet_id || !currency_code || !currency_symbol || !account_name) {
    throw new ApiError(
      400,
      "wallet_id, currency_code, currency_symbol y account_name son obligatorios."
    );
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

module.exports = { createUser, getUser, addWallet };
