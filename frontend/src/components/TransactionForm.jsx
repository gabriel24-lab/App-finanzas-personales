import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  ArrowUpRight,
  ArrowDownRight,
  Tag,
  Calendar,
  FileText,
} from "lucide-react";
import { TRANSACTION_TYPES } from "../types";
import { InfoTooltip } from "./InfoTooltip";

export function TransactionForm({ categories = [], onAddTransaction, wallet }) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState(TRANSACTION_TYPES.expense);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const locale = wallet?.currency_code ? (
    {
      USD: "en-US", EUR: "de-DE", COP: "es-CO", MXN: "es-MX",
      ARS: "es-AR", CLP: "es-CL", PEN: "es-PE", BRL: "pt-BR",
      UYU: "es-UY", GBP: "en-GB", CAD: "en-CA", CHF: "de-CH", JPY: "ja-JP",
    }[wallet.currency_code] || "es-CO"
  ) : "es-CO";

  const formatAmountInput = (value) => {
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
    const cleaned = value.replace(/\./g, "").replace(/,/g, ".");
    return parseFloat(cleaned);
  };

  const categoriesByType = (t) =>
    categories.filter((c) => c.type === t).map((c) => c.name);

  // Sync category options with the current type
  useEffect(() => {
    // Select the first category by default when type changes
    const availableCategories = categoriesByType(type);
    if (availableCategories.length > 0) {
      setCategory(availableCategories[0]);
    } else {
      setCategory("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, categories]);

  // Set today's date by default
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedAmount = parseAmountValue(amount);
    if (!description.trim()) {
      setError("Escribe una descripción para el movimiento.");
      return;
    }
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Ingresa un monto mayor que cero.");
      return;
    }
    if (!category) {
      setError("Selecciona una categoría.");
      return;
    }
    if (!date) {
      setError("Selecciona una fecha.");
      return;
    }

    const newTransaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      description: description.trim(),
      amount: parsedAmount,
      type,
      category,
      date,
    };

    onAddTransaction(newTransaction);

    setDescription("");
    setAmount("");
    setError("");
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    const availableCategories = categoriesByType(type);
    if (availableCategories.length > 0) {
      setCategory(availableCategories[0]);
    }
  };

  const isFormValid =
    description.trim() !== "" &&
    amount !== "" &&
    parseAmountValue(amount) > 0 &&
    category !== "" &&
    date !== "";

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
        <PlusCircle className="h-5 w-5 text-neutral-900" />
        Agregar movimiento
      </h2>
      <p className="mb-5 mt-1 text-xs text-neutral-500">
        Un "movimiento" es cualquier entrada o salida de dinero: un pago, una
        compra, tu sueldo o cualquier otro ingreso.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector (Tabs) */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-2">
            Tipo de Movimiento
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-50 rounded-2xl border border-neutral-100">
            <button
              type="button"
              onClick={() => setType(TRANSACTION_TYPES.expense)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-sm font-semibold transition-all ${
                type === TRANSACTION_TYPES.expense
                  ? "bg-rose-500 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <ArrowDownRight className="h-4 w-4" />
              Gasto
            </button>
            <button
              type="button"
              onClick={() => setType(TRANSACTION_TYPES.income)}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-2xl text-sm font-semibold transition-all ${
                type === TRANSACTION_TYPES.income
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <ArrowUpRight className="h-4 w-4" />
              Ingreso
            </button>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
            Descripción
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <FileText className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Ej: Suscripción Netflix, Sueldo..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError("");
              }}
              className="w-full pl-10 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600 focus:bg-white transition-all"
              required
            />
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
            Monto
            <InfoTooltip text="Escribe solo el número, sin el símbolo de moneda. Usa un punto para los decimales, por ejemplo: 25000 o 25000.50." />
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <span className="text-sm font-semibold">$</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => {
                setAmount(formatAmountInput(e.target.value));
                setError("");
              }}
              className="w-full pl-10 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600 focus:bg-white transition-all"
              pattern="[0-9.,]*"
              required
            />
          </div>
        </div>

        {/* Dynamic Category Select */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
            Categoría
          </label>
          {categoriesByType(type).length > 0 ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                <Tag className="h-4 w-4" />
              </div>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setError("");
                }}
                className="w-full pl-10 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600 focus:bg-white transition-all appearance-none cursor-pointer"
                required
              >
                {categoriesByType(type).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-500">
              Todavía no tienes categorías de{" "}
              {type === TRANSACTION_TYPES.income ? "ingreso" : "gasto"}. Ve a la
              pestaña <strong>Categorías</strong> para crear la primera; solo
              toma unos segundos.
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
            Fecha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <Calendar className="h-4 w-4" />
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setError("");
              }}
              className="w-full pl-10 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600 focus:bg-white transition-all cursor-pointer"
              required
            />
          </div>
        </div>

        {error && (
          <p className="rounded-2xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-2.5 px-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            isFormValid
              ? "bg-brand-600 text-white hover:bg-brand-700 hover:shadow-md active:scale-[0.98] cursor-pointer"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          }`}
        >
          Guardar Transacción
        </button>
      </form>
    </div>
  );
}
