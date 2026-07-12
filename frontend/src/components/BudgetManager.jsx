import React from "react";
import { Settings2, DollarSign } from "lucide-react";
import { CATEGORIES } from "../mockData";

export function BudgetManager({ budgets = {}, onUpdateBudget }) {
  const handleChange = (category, value) => {
    // Allow clearing the field; store as 0 when empty or invalid
    const parsed = value === "" ? 0 : parseFloat(value);
    onUpdateBudget(category, Number.isNaN(parsed) ? 0 : parsed);
  };

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-800 mb-1 flex items-center gap-2">
        <Settings2 className="h-5 w-5 text-neutral-900" />
        Definir Presupuestos
      </h2>
      <p className="text-xs text-neutral-500 mb-5">
        Establece un límite mensual para cada categoría de gasto. Un valor de 0
        significa sin límite.
      </p>

      <div className="space-y-3">
        {CATEGORIES.expense.map((category) => (
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
              <input
                id={`budget-${category}`}
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={budgets[category] || ""}
                onChange={(e) => handleChange(category, e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 focus:bg-white transition-all text-right"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
