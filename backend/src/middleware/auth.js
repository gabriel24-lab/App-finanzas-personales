const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const RevokedToken = require("../models/RevokedToken");

/**
 * Verifica el JWT enviado en el header `Authorization: Bearer <token>` y
 * expone el id del usuario autenticado en req.userId. Corta la petición con
 * 401 si el token falta, es inválido, expiró o fue revocado (logout).
 *
 * Usamos el header Authorization (en vez de una cookie) porque el frontend
 * (Vercel) y el backend (Render) viven en dominios distintos: varios
 * navegadores (Safari, Brave, y cada vez más Chrome) bloquean cookies
 * cross-site por defecto aunque estén configuradas correctamente, así que
 * una cookie de sesión no es fiable en este escenario de despliegue.
 */
async function protect(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, "No autorizado. Falta el token de acceso."));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return next(new ApiError(401, "Token inválido o expirado. Inicia sesión nuevamente."));
  }

  // Comprobar que el token no haya sido invalidado explícitamente (logout).
  // Si el jti no existe en el payload (tokens emitidos antes de esta versión),
  // se permite el acceso para no romper sesiones activas durante el rollout.
  if (decoded.jti) {
    try {
      const revoked = await RevokedToken.exists({ jti: decoded.jti });
      if (revoked) {
        return next(new ApiError(401, "Sesión cerrada. Inicia sesión nuevamente."));
      }
    } catch {
      // Si falla la consulta a la BD (rara vez), dejamos pasar por resiliencia.
      // En un sistema de mayor criticidad se rechazaría fail-closed.
    }
  }

  req.userId = decoded.id;
  next();
}

module.exports = { protect };
