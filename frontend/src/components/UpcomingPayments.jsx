import React, { useMemo } from "react";
import { CalendarClock } from "lucide-react";
import { getCategoryIcon } from "../iconMap";

/**
 * Encuentra gastos que se repiten mes a mes (arriendo, suscripciones,
 * gimnasio...) mirando el historial: si la misma descripción + categoría
 * aparece en 2 o más meses distintos, se asume recurrente y se proyecta
 * cuándo tocaría el próximo pago, usando el día del mes más frecuente.
 *
 * No requiere cambios en el backend: todo se calcula en el navegador a
 * partir de las transacciones que ya se cargan para el dashboard.
 */
function detectRecurring(transactions) {
  const groups = new Map();

  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const key = `${t.category}|${t.description.trim().toLowerCase()}`;
      const [year, month, day] = t.date.split("-").map(Number);
      if (!groups.has(key)) {
        groups.set(key, {
          category: t.category,
          description: t.description,
          amounts: [],
          days: [],
          months: new Set(),
        });
      }
      const g = groups.get(key);
      g.amounts.push(Number(t.amount) || 0);
      g.days.push(day);
      g.months.add(`${year}-${month}`);
    });

  const today = new Date();
  const recurring = [];

  groups.forEach((g) => {
    if (g.months.size < 2) return; // solo aparece en un mes: no es recurrente todavía

    const avgAmount = g.amounts.reduce((a, b) => a + b, 0) / g.amounts.length;
    const avgDay = Math.round(g.days.reduce((a, b) => a + b, 0) / g.days.length);

    // Próxima fecha: este mes si el día todavía no pasó, si no, el mes siguiente.
    let nextDate = new Date(today.getFullYear(), today.getMonth(), avgDay);
    if (nextDate < today) {
      nextDate = new Date(today.getFullYear(), today.getMonth() + 1, avgDay);
    }

    const daysUntil = Math.round((nextDate - today) / (1000 * 60 * 60 * 24));

    recurring.push({
      key: `${g.category}|${g.description}`,
      category: g.category,
      description: g.description,
      avgAmount,
      nextDate,
      daysUntil,
      occurrences: g.months.size,
    });
  });

  return recurring.sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 4);
}

export function UpcomingPayments({ transactions = [], categories = [], wallet }) {
  const currencyCode = wallet?.currency_code || "COP";

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
    }).format(value);

  const upcoming = useMemo(() => detectRecurring(transactions), [transactions]);

  if (upcoming.length === 0) return null;

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <CalendarClock className="h-4 w-4 text-neutral-900" />
        <h3 className="text-sm font-bold text-neutral-800">Próximos pagos esperados</h3>
      </div>
      <p className="mb-3 text-[11px] text-neutral-500">
        Calculado a partir de gastos que se repiten mes a mes en tu
        historial. Son estimaciones, no montos confirmados.
      </p>

      <div className="space-y-2">
        {upcoming.map((item) => {
          const match = categories.find((c) => c.name === item.category);
          const IconComp = getCategoryIcon(match?.icon || "Tag");
          const color = match?.color || "#a3a3a3";

          return (
            <div
              key={item.key}
              className="flex items-center justify-between gap-2 rounded-xl border border-neutral-100 px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${color}1a`, color }}
                >
                  <IconComp className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-neutral-800">
                    {item.description}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {item.daysUntil <= 0
                      ? "Hoy"
                      : item.daysUntil === 1
                        ? "Mañana"
                        : `En ${item.daysUntil} días`}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold text-neutral-700">
                ~{formatCurrency(item.avgAmount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
