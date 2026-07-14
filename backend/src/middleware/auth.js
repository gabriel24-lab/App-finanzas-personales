const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { AUTH_COOKIE_NAME } = require("../utils/cookieOptions");

/**
 * Verifica la cookie httpOnly de sesión y expone el id del usuario
 * autenticado en req.userId. Corta la petición con 401 si el token falta,
 * es inválido o expiró.
 *
 * El JWT viaja en una cookie httpOnly (no en el header Authorization) para
 * que nunca sea accesible desde JavaScript en el navegador, mitigando el
 * robo de sesión vía XSS.
 */
function protect(req, res, next) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
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
