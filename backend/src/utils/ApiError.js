// Error de aplicación con código de estado HTTP asociado,
// para poder distinguir errores "esperados" (400/404) de fallos internos (500).
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

module.exports = ApiError;
