const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

/**
 * Verifica el header "Authorization: Bearer <token>" y expone el id del
 * usuario autenticado en req.userId. Corta la petición con 401 si el
 * token falta, es inválido o expiró.
 */
function protect(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "No autorizado. Falta el token de acceso."));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    next(new ApiError(401, "Token inválido o expirado. Inicia sesión nuevamente."));
  }
}

module.exports = { protect };
