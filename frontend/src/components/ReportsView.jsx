import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  Line,
  ComposedChart,
} from "recharts";
import {
  getComparativeReport,
  getCashFlowProjection,
  exportTransactions,
  downloadPDFReport,
} from "../api";
import { InsightsPanel } from "./InsightsPanel";

const easeOut = [0.22, 1, 0.36, 1];

function formatCurrency(value, currencyCode = "COP") {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function TrendBadge({ value, label }) {
  const isUp = value > 0;
  const isDown = value < 0;
  const Icon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus;
  const color = isUp
    ? "text-rose-600 bg-rose-50"
    : isDown
      ? "text-emerald-600 bg-emerald-50"
      : "text-neutral-500 bg-neutral-100";

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}
      >
        <Icon className="h-3 w-3" />
        {value > 0 ? "+" : ""}
        {value}%
      </span>
      {label && <span className="text-xs text-neutral-400">{label}</span>}
    </div>
  );
}

function ExportButtons({ onExport, exporting }) {
  return (
    <div className="flex flex-wrap gap-2">
      {[
        { format: "csv", label: "CSV", icon: Download },
        { format: "xlsx", label: "Excel", icon: FileSpreadsheet },
        { format: "pdf", label: "PDF", icon: FileText },
      ].map(({ format, label, icon: Icon }) => (
        <button
          key={format}
          type="button"
          disabled={exporting === format}
          onClick={() => onExport(format)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 shadow-sm transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
        >
          {exporting === format ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Icon className="h-3.5 w-3.5" />
          )}
          {label}
        </button>
      ))}
    </div>
  );
}

export function ReportsView({ token, wallet }) {
  const [comparative, setComparative] = useState(null);
  const [projection, setProjection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(null);
  const [error, setError] = useState("");

  const currency = wallet?.currency_code || "COP";
  const walletId = wallet?.wallet_id;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const [comp, proj] = await Promise.all([
          getComparativeReport(token, walletId),
          getCashFlowProjection(token, walletId),
        ]);
        if (!cancelled) {
          setComparative(comp);
          setProjection(proj);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token, walletId]);

  const handleExport = useCallback(
    async (format) => {
      setExporting(format);
      try {
        if (format === "pdf") {
          const now = new Date();
          await downloadPDFReport(
            token,
            now.getMonth() + 1,
            now.getFullYear(),
            walletId,
          );
        } else {
          await exportTransactions(token, format, { walletId });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setExporting(null);
      }
    },
    [token, walletId],
  );

  const comparisonChartData =
    comparative?.categoryComparison?.slice(0, 8).map((c) => ({
      name: c.category.length > 12 ? `${c.category.slice(0, 12)}…` : c.category,
      actual: c.current,
      anterior: c.previous,
    })) || [];

  const summaryChartData = comparative
    ? [
        {
          name: "Ingresos",
          actual: comparative.currentMonth.income,
          anterior: comparative.previousMonth.income,
        },
        {
          name: "Gastos",
          actual: comparative.currentMonth.expense,
          anterior: comparative.previousMonth.expense,
        },
        {
          name: "Neto",
          actual: comparative.currentMonth.net,
          anterior: comparative.previousMonth.net,
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-neutral-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: easeOut }}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Reportes</h2>
          <p className="text-sm text-neutral-500">
            Comparativos, proyecciones y exportación
          </p>
        </div>
        <ExportButtons onExport={handleExport} exporting={exporting} />
      </div>

      <InsightsPanel token={token} walletId={walletId} />

      {/* Resumen comparativo mes vs mes */}
      {comparative && (
        <div className="rounded-3xl border border-neutral-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-neutral-500" />
            <h3 className="text-sm font-bold text-neutral-800">
              Mes actual vs anterior
            </h3>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                label: "Ingresos",
                curr: comparative.currentMonth.income,
                trend: comparative.trends.incomeChangePercent,
                color: "text-emerald-600",
              },
              {
                label: "Gastos",
                curr: comparative.currentMonth.expense,
                trend: comparative.trends.expenseChangePercent,
                color: "text-rose-600",
              },
              {
                label: "Balance neto",
                curr: comparative.currentMonth.net,
                trend: comparative.trends.netChangePercent,
                color: "text-brand-800",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4"
              >
                <p className="text-xs font-medium text-neutral-500">
                  {item.label}
                </p>
                <p className={`mt-1 text-xl font-bold ${item.color}`}>
                  {formatCurrency(item.curr, currency)}
                </p>
                <div className="mt-2">
                  <TrendBadge value={item.trend} label="vs mes anterior" />
                </div>
              </div>
            ))}
          </div>

          {summaryChartData.length > 0 && (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summaryChartData} barGap={6}>
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#a3a3a3" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#a3a3a3" }}
                    tickFormatter={(v) =>
                      v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                    }
                  />
                  <Tooltip formatter={(v) => formatCurrency(v, currency)} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Bar
                    dataKey="actual"
                    name="Mes actual"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="anterior"
                    name="Mes anterior"
                    fill="#d4d4d4"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Gastos por categoría comparativo */}
      {comparisonChartData.length > 0 && (
        <div className="rounded-3xl border border-neutral-100 bg-white p-4 sm:p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-bold text-neutral-800">
            Gastos por categoría
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 text-left text-xs text-neutral-500">
                  <th className="pb-2 font-medium">Categoría</th>
                  <th className="pb-2 font-medium">Este mes</th>
                  <th className="pb-2 font-medium">Anterior</th>
                  <th className="pb-2 font-medium">Cambio</th>
                </tr>
              </thead>
              <tbody>
                {comparative.categoryComparison.slice(0, 10).map((row) => (
                  <tr key={row.category} className="border-b border-neutral-50">
                    <td className="py-2.5 font-medium text-neutral-800">
                      {row.category}
                    </td>
                    <td className="py-2.5 text-neutral-600">
                      {formatCurrency(row.current, currency)}
                    </td>
                    <td className="py-2.5 text-neutral-400">
                      {formatCurrency(row.previous, currency)}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`text-xs font-semibold ${
                          row.changePercent > 10
                            ? "text-rose-600"
                            : row.changePercent < -10
                              ? "text-emerald-600"
                              : "text-neutral-500"
                        }`}
                      >
                        {row.changePercent > 0 ? "+" : ""}
                        {row.changePercent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Proyección de flujo de caja */}
      {projection && (
        <div className="rounded-3xl border border-neutral-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-neutral-500" />
            <h3 className="text-sm font-bold text-neutral-800">
              Flujo de caja proyectado
            </h3>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
              <p className="text-xs text-neutral-500">Balance actual</p>
              <p className="mt-1 text-lg font-bold text-neutral-900">
                {formatCurrency(projection.currentBalance, currency)}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-emerald-50 p-4">
              <p className="text-xs text-emerald-600">Ingresos proyectados</p>
              <p className="mt-1 text-lg font-bold text-emerald-700">
                {formatCurrency(
                  projection.projection.projectedIncome,
                  currency,
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-neutral-100 bg-rose-50 p-4">
              <p className="text-xs text-rose-600">Gastos proyectados</p>
              <p className="mt-1 text-lg font-bold text-rose-700">
                {formatCurrency(
                  projection.projection.projectedExpense,
                  currency,
                )}
              </p>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-brand-100 p-4">
              <p className="text-xs text-brand-700">Balance fin de mes</p>
              <p className="mt-1 text-lg font-bold text-brand-900">
                {formatCurrency(
                  projection.projection.projectedEndBalance,
                  currency,
                )}
              </p>
            </div>
          </div>

          {projection.dailyProjection?.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={projection.dailyProjection}>
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#a3a3a3" }}
                    tickFormatter={(d) => `Día ${d}`}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#a3a3a3" }}
                    tickFormatter={(v) =>
                      v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
                    }
                  />
                  <Tooltip formatter={(v) => formatCurrency(v, currency)} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="optimistic"
                    name="Optimista"
                    fill="#d1fae5"
                    stroke="#10b981"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="pessimistic"
                    name="Pesimista"
                    fill="#ffe4e6"
                    stroke="#f43f5e"
                    fillOpacity={0.3}
                  />
                  <Line
                    type="monotone"
                    dataKey="projectedBalance"
                    name="Proyección"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          <p className="mt-3 text-xs text-neutral-400">
            Basado en el promedio de los últimos 3 meses. Quedan{" "}
            {projection.projection.daysRemaining} días del mes.
          </p>
        </div>
      )}
    </motion.div>
  );
}
