// Catálogo de monedas que el usuario puede elegir como moneda principal al
// crear su cuenta. `MAIN_CURRENCIES` son las que siempre aparecen primero al
// abrir el selector (dólar, euro y peso colombiano); `OTHER_CURRENCIES` son
// el resto, disponibles debajo.

export const MAIN_CURRENCIES = [
  { code: "USD", symbol: "$", flag: "🇺🇸", nameKey: "currency.USD" },
  { code: "EUR", symbol: "€", flag: "🇪🇺", nameKey: "currency.EUR" },
  { code: "COP", symbol: "$", flag: "🇨🇴", nameKey: "currency.COP" },
];

export const OTHER_CURRENCIES = [
  { code: "MXN", symbol: "$", flag: "🇲🇽", nameKey: "currency.MXN" },
  { code: "ARS", symbol: "$", flag: "🇦🇷", nameKey: "currency.ARS" },
  { code: "CLP", symbol: "$", flag: "🇨🇱", nameKey: "currency.CLP" },
  { code: "PEN", symbol: "S/", flag: "🇵🇪", nameKey: "currency.PEN" },
  { code: "BRL", symbol: "R$", flag: "🇧🇷", nameKey: "currency.BRL" },
  { code: "UYU", symbol: "$U", flag: "🇺🇾", nameKey: "currency.UYU" },
  { code: "GBP", symbol: "£", flag: "🇬🇧", nameKey: "currency.GBP" },
  { code: "CAD", symbol: "$", flag: "🇨🇦", nameKey: "currency.CAD" },
  { code: "CHF", symbol: "Fr.", flag: "🇨🇭", nameKey: "currency.CHF" },
  { code: "JPY", symbol: "¥", flag: "🇯🇵", nameKey: "currency.JPY" },
];

export const ALL_CURRENCIES = [...MAIN_CURRENCIES, ...OTHER_CURRENCIES];

export function findCurrency(code) {
  return ALL_CURRENCIES.find((c) => c.code === code) || MAIN_CURRENCIES[0];
}
