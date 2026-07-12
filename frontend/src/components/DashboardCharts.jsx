import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PieChart as PieIcon, BarChart3, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from "recharts";

const easeOut = [0.22, 1, 0.36, 1];

const CATEGORY_COLORS = [
  "#6366f1",
  "#f43f5e",
  "#f59e0b",
  "#0ea5e9",
  "#8b5cf6",
  "#84cc16",
  "#ec4899",
  "#14b8a6",
  "#a3a3a3",
];

const RANGE_OPTIONS = [
  { key: "1M", months: 1, label: "1M" },
  { key: "3M", months: 3, label: "3M" },
  { key: "6M", months: 6, label: "6M" },
  { key: "1Y", months: 12, label: "1A" },
  { key: "all", months: null, label: "Todo" },
];

const formatCurrency = (value, currencyCode = "COP") =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const MONTH_LABELS = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

function filterByRange(transactions, rangeKey) {
  const opt = RANGE_OPTIONS.find((r) => r.key === rangeKey);
  if (!opt || opt.months === null) return transactions;

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - opt.months);
  cutoff.setDate(1);
  cutoff.setHours(0, 0, 0, 0);

  return transactions.filter((t) => new Date(t.date) >= cutoff);
}

function ChartCard({ icon: Icon, title, subtitle, children, empty, emptyLabel, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOut }}
      className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-800">
            <Icon className="h-4 w-4 text-neutral-500" />
            {title}
          </h3>
          {subtitle && <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>}
        </div>
        {action}
      </div>

      {empty ? (
        <div className="flex h-55 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 text-center">
          <p className="text-sm font-semibold text-neutral-600">Sin datos suficientes</p>
          <p className="mt-1 max-w-55 text-xs text-neutral-400">{emptyLabel}</p>
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
}

function CategoryTooltip({ active, payload, currencyCode }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-neutral-100 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-neutral-800">{item.name}</p>
      <p className="mt-0.5 text-neutral-500">{formatCurrency(item.value, currencyCode)}</p>
    </div>
  );
}

function MonthlyTooltip({ active, payload, label, currencyCode }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-neutral-100 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-neutral-800">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-1.5 text-neutral-500">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: {formatCurrency(entry.value, currencyCode)}
        </p>
      ))}
    </div>
  );
}

function RangeSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-0.5 text-[11px] font-semibold">
      {RANGE_OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`rounded-lg px-2.5 py-1 transition-colors cursor-pointer ${
            value === opt.key ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-400"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function DashboardCharts({ transactions = [], categories = [], wallet }) {
  const [range, setRange] = useState("6M");
  const [pieScope, setPieScope] = useState("month");
  const currencyCode = wallet?.currency_code || "COP";

  const scopedTransactions = useMemo(
    () => filterByRange(transactions, range),
    [transactions, range]
  );

  const categoryData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const scoped = scopedTransactions.filter((t) => {
      if (t.type !== "expense") return false;
      if (pieScope === "all") return true;
      const [year, month] = t.date.split("-").map(Number);
      return year === currentYear && month - 1 === currentMonth;
    });

    const totals = scoped.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + (Number(t.amount) || 0);
      return acc;
    }, {});

    return Object.entries(totals)
      .map(([name, value], index) => {
        const match = categories.find((c) => c.name === name && c.type === "expense");
        return {
          name,
          value,
          color: match?.color || CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [scopedTransactions, pieScope, categories]);

  const totalCategorySpend = categoryData.reduce((sum, c) => sum + c.value, 0);

  const monthlyData = useMemo(() => {
    const monthsBack = range === "1M" ? 1 : range === "3M" ? 3 : range === "6M" ? 6 : range === "1Y" ? 12 : 12;
    const now = new Date();
    const buckets = [];

    for (let i = monthsBack - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: MONTH_LABELS[d.getMonth()],
        income: 0,
        expense: 0,
        net: 0,
      });
    }

    const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));

    scopedTransactions.forEach((t) => {
      const [year, month] = t.date.split("-").map(Number);
      const key = `${year}-${String(month).padStart(2, "0")}`;
      const bucket = byKey[key];
      if (!bucket) return;
      const amount = Number(t.amount) || 0;
      if (t.type === "income") bucket.income += amount;
      else bucket.expense += amount;
      bucket.net = bucket.income - bucket.expense;
    });

    return buckets;
  }, [scopedTransactions, range]);

  const trendComparison = useMemo(() => {
    if (monthlyData.length < 2) return [];
    const current = monthlyData[monthlyData.length - 1];
    const previous = monthlyData[monthlyData.length - 2];
    return [
      { name: "Ingresos", actual: current.income, anterior: previous.income },
      { name: "Gastos", actual: current.expense, anterior: previous.expense },
      { name: "Neto", actual: current.net, anterior: previous.net },
    ];
  }, [monthlyData]);

  const hasMonthlyData = monthlyData.some((b) => b.income > 0 || b.expense > 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <RangeSelector value={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <ChartCard
            icon={PieIcon}
            title="Gastos por Categoría"
            subtitle={pieScope === "month" ? "Mes actual" : "Periodo seleccionado"}
            empty={categoryData.length === 0}
            emptyLabel="Registra algunos gastos para ver la distribución por categoría."
            action={
              <div className="flex items-center gap-1 rounded-xl border border-neutral-200 bg-neutral-50 p-0.5 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setPieScope("month")}
                  className={`rounded-lg px-2 py-1 cursor-pointer ${pieScope === "month" ? "bg-white shadow-sm" : "text-neutral-400"}`}
                >
                  Mes
                </button>
                <button
                  type="button"
                  onClick={() => setPieScope("all")}
                  className={`rounded-lg px-2 py-1 cursor-pointer ${pieScope === "all" ? "bg-white shadow-sm" : "text-neutral-400"}`}
                >
                  Periodo
                </button>
              </div>
            }
          >
            <div className="h-55">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="85%"
                    paddingAngle={2}
                    strokeWidth={0}
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CategoryTooltip currencyCode={currencyCode} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {categoryData.length > 0 && (
              <div className="mt-2 space-y-1.5 border-t border-neutral-100 pt-3">
                {categoryData.slice(0, 5).map((entry) => {
                  const pct = totalCategorySpend > 0 ? (entry.value / totalCategorySpend) * 100 : 0;
                  return (
                    <div key={entry.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-neutral-700">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        {entry.name}
                      </span>
                      <span className="text-neutral-400">
                        {formatCurrency(entry.value, currencyCode)}{" "}
                        <span className="text-neutral-300">· {pct.toFixed(0)}%</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </ChartCard>
        </div>

        <div className="lg:col-span-3">
          <ChartCard
            icon={BarChart3}
            title="Ingresos vs Gastos"
            subtitle={`Periodo: ${RANGE_OPTIONS.find((r) => r.key === range)?.label || range}`}
            empty={!hasMonthlyData}
            emptyLabel="Aún no hay movimientos suficientes para mostrar la tendencia mensual."
          >
            <div className="h-66">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={4} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a3a3a3" }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#a3a3a3" }}
                    tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                  />
                  <Tooltip cursor={{ fill: "#fafafa" }} content={<MonthlyTooltip currencyCode={currencyCode} />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "#737373" }} />
                  <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={22} animationDuration={800} />
                  <Bar dataKey="expense" name="Gastos" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={22} animationDuration={800} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>

      {trendComparison.length > 0 && (
        <ChartCard
          icon={TrendingUp}
          title="Tendencia: mes actual vs anterior"
          subtitle="Comparación directa de los dos últimos meses del periodo"
          empty={trendComparison.every((d) => d.actual === 0 && d.anterior === 0)}
          emptyLabel="Necesitas al menos dos meses con movimientos."
        >
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData.slice(-2)}>
                <CartesianGrid vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a3a3a3" }} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#a3a3a3" }}
                  tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
                />
                <Tooltip content={<MonthlyTooltip currencyCode={currencyCode} />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="income" name="Ingresos" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} animationDuration={800} />
                <Line type="monotone" dataKey="expense" name="Gastos" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} animationDuration={800} />
                <Line type="monotone" dataKey="net" name="Neto" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} animationDuration={800} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      )}
    </div>
  );
}
