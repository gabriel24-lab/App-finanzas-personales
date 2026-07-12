// Envuelve un controlador async para propagar errores a next()
// sin repetir try/catch en cada función.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
