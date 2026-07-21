import React, { useState, useEffect } from "react";
import { Settings2, DollarSign } from "lucide-react";

const formatAmountInput = (value, locale = "es-CO") => {
  const cleaned = String(value).replace(/[^0-9,\.]/g, "");
  if (!cleaned) return "";

  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  const separator = lastComma > lastDot ? "," : ".";

  let integerPart = cleaned;
  let decimalPart = "";

  if (separator && (lastComma !== -1 || lastDot !== -1)) {
    const index = separator === "," ? lastComma : lastDot;
    const candidateDecimal = cleaned.slice(index + 1);
    const candidateInteger = cleaned.slice(0, index);

    if (candidateDecimal.length <= 2) {
      integerPart = candidateInteger.replace(/[\.,]/g, "");
      decimalPart = candidateDecimal.replace(/[^0-9]/g, "");
    } else {
      integerPart = cleaned.replace(/[\.,]/g, "");
    }
  }

  const numericInteger = integerPart.replace(/[^0-9]/g, "") || "0";
  const formattedInteger = new Intl.NumberFormat(locale).format(
    Number(numericInteger),
  );

  const decimalSeparator = new Intl.NumberFormat(locale).format(1.1).charAt(1);
  const endsWithSeparator = cleaned.endsWith(",") || cleaned.endsWith(".");

  if (decimalPart) {
    return `${formattedInteger}${decimalSeparator}${decimalPart.slice(0, 2)}`;
  } else if (endsWithSeparator) {
    return `${formattedInteger}${decimalSeparator}`;
  }

  return formattedInteger;
};

const parseAmountValue = (value) => {
  if (!value) return NaN;
  const cleaned = String(value).replace(/\./g, "").replace(/,/g, ".");
  return parseFloat(cleaned);
};

function BudgetInput({ category, initialValue, onChange, locale }) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (initialValue && !inputValue) {
      setInputValue(formatAmountInput(initialValue, locale));
    } else if (!initialValue && !inputValue) {
      setInputValue("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, locale]);

  const handleChange = (e) => {
    const formatted = formatAmountInput(e.target.value, locale);
    setInputValue(formatted);
    const parsed = parseAmountValue(formatted);
    onChange(category, Number.isNaN(parsed) ? 0 : parsed);
  };

  return (
    <input
      id={`budget-${category}`}
      type="text"
      inputMode="decimal"
      placeholder="0,00"
      value={inputValue}
      onChange={handleChange}
      className="w-full pl-8 pr-2 py-1.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600 focus:bg-white transition-all text-right"
    />
  );
}

export function BudgetManager({
  categories = [],
  budgets = {},
  onUpdateBudget,
  wallet,
}) {
  const locale = wallet?.currency_code ? (
    {
      USD: "en-US", EUR: "de-DE", COP: "es-CO", MXN: "es-MX",
      ARS: "es-AR", CLP: "es-CL", PEN: "es-PE", BRL: "pt-BR",
      UYU: "es-UY", GBP: "en-GB", CAD: "en-CA", CHF: "de-CH", JPY: "ja-JP",
    }[wallet.currency_code] || "es-CO"
  ) : "es-CO";

  const expenseCategories = categories
    .filter((c) => c.type === "expense")
    .map((c) => c.name);

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-800 mb-1 flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-neutral-900" />
        Presupuestos
      </h2>
      <p className="text-xs text-neutral-500 mb-5">
        Escribe cuánto quieres gastar como máximo este mes en cada categoría.
        Déjalo vacío o en 0 si no quieres ponerle límite todavía.
      </p>

      <div className="space-y-3">
        {expenseCategories.length === 0 && (
          <p className="py-4 text-center text-xs text-neutral-400">
            Todavía no tienes categorías de gasto. Crea alguna en la pestaña de
            Categorías para poder asignarle un presupuesto.
          </p>
        )}
        {expenseCategories.map((category) => (
          <div
            key={category}
            className="flex items-center justify-between gap-3"
          >
            <label
              htmlFor={`budget-${category}`}
              className="text-sm font-medium text-neutral-700 flex-1"
            >
              {category}
            </label>
            <div className="relative w-36">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <DollarSign className="h-3.5 w-3.5" />
              </div>
              <BudgetInput
                category={category}
                initialValue={budgets[category]}
                onChange={onUpdateBudget}
                locale={locale}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
