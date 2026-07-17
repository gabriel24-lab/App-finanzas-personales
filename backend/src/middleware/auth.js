const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

/**
 * Verifica el JWT enviado en el header `Authorization: Bearer <token>` y
 * expone el id del usuario autenticado en req.userId. Corta la petición con
 * 401 si el token falta, es inválido o expiró.
 *
 * Usamos el header Authorization (en vez de una cookie) porque el frontend
 * (Vercel) y el backend (Render) viven en dominios distintos: varios
 * navegadores (Safari, Brave, y cada vez más Chrome) bloquean cookies
 * cross-site por defecto aunque estén configuradas correctamente, así que
 * una cookie de sesión no es fiable en este escenario de despliegue.
 */
function protect(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

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
