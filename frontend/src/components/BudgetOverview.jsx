import React, { useMemo } from "react";
import { PiggyBank, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { CATEGORIES } from "../mockData";

const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 2,
  }).format(value);

// Returns visual status based on how much of the budget has been consumed
const getStatus = (percentage) => {
  if (percentage >= 100) {
    return {
      label: "Excedido",
      barClass: "bg-rose-500",
      textClass: "text-rose-600",
      badgeClass: "bg-rose-50 text-rose-600 border-rose-100",
      Icon: XCircle,
    };
  }
  if (percentage >= 80) {
    return {
      label: "Cerca del límite",
      barClass: "bg-amber-500",
      textClass: "text-amber-600",
      badgeClass: "bg-amber-50 text-amber-600 border-amber-100",
      Icon: AlertTriangle,
    };
  }
  return {
    label: "Bajo control",
    barClass: "bg-emerald-500",
    textClass: "text-emerald-600",
    badgeClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Icon: CheckCircle2,
  };
};

export function BudgetOverview({ transactions = [], budgets = {} }) {
  const summary = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Only consider expenses from the current month for budget tracking
    const monthlyExpenses = transactions.filter((t) => {
      if (t.type !== "expense") return false;
      const [year, month] = t.date.split("-").map(Number);
      return year === currentYear && month - 1 === currentMonth;
    });

    const spentByCategory = monthlyExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + (Number(t.amount) || 0);
      return acc;
    }, {});

    const rows = CATEGORIES.expense.map((category) => {
      const limit = Number(budgets[category]) || 0;
      const spent = spentByCategory[category] || 0;
      const percentage = limit > 0 ? Math.min((spent / limit) * 100, 999) : 0;
      return { category, limit, spent, percentage };
    });

    const withBudget = rows.filter((r) => r.limit > 0);
    const totalBudgeted = withBudget.reduce((sum, r) => sum + r.limit, 0);
    const totalSpent = withBudget.reduce((sum, r) => sum + r.spent, 0);

    return { rows, withBudget, totalBudgeted, totalSpent };
  }, [transactions, budgets]);

  const monthLabel = new Date().toLocaleDateString("es-CO", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-neutral-900" />
          Presupuesto Mensual
        </h2>
        <span className="text-xs font-medium text-neutral-500 capitalize bg-neutral-50 border border-neutral-100 px-2.5 py-1 rounded-full">
          {monthLabel}
        </span>
      </div>
      <p className="text-xs text-neutral-500 mb-5">
        Seguimiento de gastos frente al límite definido para cada categoría este
        mes.
      </p>

      {summary.withBudget.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 py-8 px-4 text-center">
          <p className="text-sm font-semibold text-neutral-700">
            Aún no has definido presupuestos
          </p>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
            Asigna un límite mensual a tus categorías de gasto para empezar a
            controlar tu presupuesto.
          </p>
        </div>
      ) : (
        <>
          {/* Overall totals */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Presupuestado
              </p>
              <p className="text-sm font-bold text-neutral-800 mt-1">
                {formatCurrency(summary.totalBudgeted)}
              </p>
            </div>
            <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Gastado
              </p>
              <p className="text-sm font-bold text-neutral-800 mt-1">
                {formatCurrency(summary.totalSpent)}
              </p>
            </div>
            <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                Restante
              </p>
              <p
                className={`text-sm font-bold mt-1 ${
                  summary.totalBudgeted - summary.totalSpent < 0
                    ? "text-rose-600"
                    : "text-emerald-600"
                }`}
              >
                {formatCurrency(summary.totalBudgeted - summary.totalSpent)}
              </p>
            </div>
          </div>

          {/* Per-category progress */}
          <div className="space-y-4">
            {summary.rows
              .filter((r) => r.limit > 0)
              .map((row) => {
                const status = getStatus(row.percentage);
                const { Icon } = status;
                return (
                  <div key={row.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-neutral-800">
                          {row.category}
                        </span>
                        <span
                          className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${status.badgeClass}`}
                        >
                          <Icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-neutral-500">
                        {formatCurrency(row.spent)}{" "}
                        <span className="text-neutral-400">
                          / {formatCurrency(row.limit)}
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${status.barClass} transition-all duration-500`}
                        style={{ width: `${Math.min(row.percentage, 100)}%` }}
                      />
                    </div>
                    {row.percentage >= 100 && (
                      <p className="text-[11px] text-rose-600 font-medium mt-1">
                        Excediste el presupuesto por{" "}
                        {formatCurrency(row.spent - row.limit)}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
