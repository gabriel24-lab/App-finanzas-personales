const ApiError = require("../utils/ApiError");

// Middleware de 404 para rutas no definidas
function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

// Middleware centralizado de errores. Debe registrarse al final de la cadena.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : err.statusCode || 500;

  // Errores de validación de Mongoose -> 400 con detalle por campo
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: "Error de validación.", details });
  }

  // Email duplicado u otro índice único de MongoDB
  if (err.code === 11000) {
    return res.status(409).json({ message: "Registro duplicado.", details: err.keyValue });
  }

  if (!isApiError) {
    console.error("[ErrorHandler]", err);
  }

  res.status(statusCode).json({
    message: err.message || "Error interno del servidor.",
  });
}

module.exports = { notFoundHandler, errorHandler };
