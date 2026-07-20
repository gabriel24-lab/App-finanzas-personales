const crypto = require("crypto");
const jwt = require("jsonwebtoken");

/**
 * Genera un JWT firmado que identifica al usuario (id) y expira en 30 días.
 * Incluye un campo `jti` (JWT ID) único por token: permite invalidar tokens
 * individuales en logout sin necesidad de cambiar el secreto global.
 */
function generateToken(userId) {
  return jwt.sign(
    { id: userId.toString(), jti: crypto.randomUUID() },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

module.exports = generateToken;
