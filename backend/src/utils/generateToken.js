const jwt = require("jsonwebtoken");

// Genera un JWT firmado que identifica al usuario (id) y expira en 30 días.
function generateToken(userId) {
  return jwt.sign({ id: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

module.exports = generateToken;
