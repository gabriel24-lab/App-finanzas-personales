const express = require("express");
const rateLimit = require("express-rate-limit");
const { register, login, me, logout } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validation/schemas");

const router = express.Router();

// Límite más estricto para login/registro: mitiga fuerza bruta y
// enumeración de credenciales sin afectar el resto de la API.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiados intentos. Intenta de nuevo más tarde." },
});

// POST /api/auth/register
router.post("/register", authLimiter, validate(registerSchema), register);

// POST /api/auth/login
router.post("/login", authLimiter, validate(loginSchema), login);

// GET /api/auth/me
router.get("/me", protect, me);

// POST /api/auth/logout — requiere token válido para poder revocarlo
router.post("/logout", protect, logout);

module.exports = router;
