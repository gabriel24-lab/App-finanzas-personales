const ApiError = require("../utils/ApiError");

/**
 * Middleware factory: valida una parte de la request (por defecto "body")
 * contra un schema de Zod. Si es válido, reemplaza esa parte de la request
 * por el resultado "parseado" (ya con tipos normalizados, valores por
 * defecto aplicados, y campos desconocidos eliminados vía .strict()/.strip()
 * en el propio schema), evitando así "mass assignment" de campos que el
 * cliente no debería poder enviar.
 *
 * Uso: router.post("/", validate(createTransactionSchema), createTransaction);
 */
function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map(
        (issue) => `${issue.path.join(".") || source}: ${issue.message}`
      );
      return next(new ApiError(400, `Datos inválidos: ${details.join(" | ")}`));
    }

    req[source] = result.data;
    next();
  };
}

module.exports = validate;
