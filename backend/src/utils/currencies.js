// Catálogo de monedas que un usuario puede elegir como moneda principal al
// crear su cuenta. Las tres primeras (USD, EUR, COP) son las "importantes":
// el frontend las muestra siempre arriba del selector. El resto queda
// disponible debajo, ordenado alfabéticamente.
//
// Este archivo es la fuente de verdad de qué códigos son válidos: el
// controlador de registro (authController.js) valida contra esta lista en
// vez de confiar ciegamente en lo que mande el cliente.

const CURRENCIES = [
  { code: "USD", symbol: "$", name: "Dólar estadounidense" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "COP", symbol: "$", name: "Peso colombiano" },
  { code: "MXN", symbol: "$", name: "Peso mexicano" },
  { code: "ARS", symbol: "$", name: "Peso argentino" },
  { code: "CLP", symbol: "$", name: "Peso chileno" },
  { code: "PEN", symbol: "S/", name: "Sol peruano" },
  { code: "BRL", symbol: "R$", name: "Real brasileño" },
  { code: "UYU", symbol: "$U", name: "Peso uruguayo" },
  { code: "GBP", symbol: "£", name: "Libra esterlina" },
  { code: "CAD", symbol: "$", name: "Dólar canadiense" },
  { code: "CHF", symbol: "Fr.", name: "Franco suizo" },
  { code: "JPY", symbol: "¥", name: "Yen japonés" },
];

const CURRENCY_BY_CODE = CURRENCIES.reduce((map, c) => {
  map[c.code] = c;
  return map;
}, {});

const DEFAULT_CURRENCY_CODE = "COP";

module.exports = { CURRENCIES, CURRENCY_BY_CODE, DEFAULT_CURRENCY_CODE };
