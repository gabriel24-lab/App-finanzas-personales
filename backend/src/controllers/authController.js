const User = require("../models/User");
const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const DEFAULT_CATEGORIES = require("../utils/defaultCategories");
const { CURRENCY_BY_CODE, DEFAULT_CURRENCY_CODE } = require("../utils/currencies");

// Nunca devolvemos el hash de la contraseña al cliente.
function toSafeUser(user) {
  const { password, __v, ...safe } = user.toObject();
  return safe;
}

/**
 * POST /api/auth/register
 * Body: { name, email, password, currency_code }
 *
 * Crea la cuenta con una billetera inicial en la moneda elegida por el
 * usuario (USD, EUR, COP u otra de la lista soportada; si no manda nada o
 * manda un código inválido, se usa COP como respaldo) en $0 y devuelve un
 * token de sesión: el usuario queda logueado inmediatamente después de
 * registrarse, sin pasos extra.
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, currency_code } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Nombre, email y contraseña son obligatorios.");
  }

  if (name.trim().length < 2) {
    throw new ApiError(400, "El nombre debe tener al menos 2 caracteres.");
  }

  if (password.length < 6) {
    throw new ApiError(400, "La contraseña debe tener al menos 6 caracteres.");
  }

  const normalizedEmail = String(email).toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new ApiError(409, "Ya existe una cuenta registrada con ese email.");
  }

  const normalizedCurrencyCode = String(currency_code || "").toUpperCase().trim();
  const currency =
    CURRENCY_BY_CODE[normalizedCurrencyCode] || CURRENCY_BY_CODE[DEFAULT_CURRENCY_CODE];

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    wallets: [
      {
        wallet_id: "wallet_main",
        currency_code: currency.code,
        currency_symbol: currency.symbol,
        account_name: "Efectivo",
        current_balance: 0,
      },
    ],
  });

  // Le damos a cada usuario nuevo su propio set de categorías editable desde
  // el día uno (nombre, color e ícono), en vez de una lista fija en el código.
  await Category.insertMany(
    DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: user._id, is_default: true }))
  );

  const token = generateToken(user._id);

  res.status(201).json({
    message: "Cuenta creada correctamente.",
    token,
    user: toSafeUser(user),
  });
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email y contraseña son obligatorios.");
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  // Mismo mensaje tanto si el email no existe como si la contraseña es
  // incorrecta: evita filtrar qué emails están registrados.
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Email o contraseña incorrectos.");
  }

  const token = generateToken(user._id);

  res.status(200).json({
    message: "Sesión iniciada correctamente.",
    token,
    user: toSafeUser(user),
  });
});

/**
 * GET /api/auth/me
 * Requiere el middleware `protect`. Permite a la app recuperar la sesión
 * (usuario + billeteras) al recargar la página usando el token guardado.
 */
const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) {
    throw new ApiError(404, "Usuario no encontrado.");
  }
  res.status(200).json({ user });
});

module.exports = { register, login, me };
