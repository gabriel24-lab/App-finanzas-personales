import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  GraduationCap,
  Landmark,
  LineChart,
  Layers,
  PiggyBank,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { getOpportunities } from "../api";

const SEVERITY_STYLES = {
  positive: "border-emerald-100 bg-emerald-50 text-emerald-800",
  warning: "border-amber-100 bg-amber-50 text-amber-800",
  neutral: "border-neutral-100 bg-neutral-50 text-neutral-700",
};

const SEVERITY_ICON = {
  positive: TrendingUp,
  warning: TrendingDown,
  neutral: Minus,
};

// Contenido educativo genérico: definiciones neutrales, sin recomendar
// ninguno por encima de otro. A propósito no incluye rendimientos, montos
// mínimos ni nombres de proveedores, para no quedar desactualizado ni sonar
// a recomendación.
const EDUCATION_ITEMS = [
  {
    icon: Landmark,
    title: "CDT (Certificado de Depósito a Término)",
    description:
      "Le prestas tu dinero a un banco por un plazo fijo (ej. 90, 180, 360 días) a cambio de un interés pactado de antemano. Es de los instrumentos más conservadores: el monto y el plazo quedan fijos desde el inicio.",
  },
  {
    icon: Layers,
    title: "Fondo de Inversión Colectiva (FIC)",
    description:
      "Varias personas juntan su dinero y un gestor profesional lo invierte en una mezcla de activos (bonos, acciones, etc.). Permite diversificar sin tener que elegir cada activo por separado, aunque el valor puede subir o bajar.",
  },
  {
    icon: LineChart,
    title: "Acciones",
    description:
      "Comprar una acción es volverte dueño de una pequeña parte de una empresa que cotiza en bolsa. Su precio varía todos los días según el mercado, por lo que suelen tener mayor riesgo y mayor potencial de variación que un CDT.",
  },
  {
    icon: PiggyBank,
    title: "ETF (Fondo cotizado en bolsa)",
    description:
      "Es un fondo que agrupa muchos activos (por ejemplo, todas las empresas de un índice bursátil) y se compra y vende en bolsa como si fuera una sola acción. Es una forma común de diversificar con una sola operación.",
  },
];

const VERIFICATION_CRITERIA = [
  "Está vigilada por la Superintendencia Financiera de Colombia (SFC): puedes confirmarlo en su listado público de entidades vigiladas.",
  "Explica con claridad los riesgos, no solo las posibles ganancias, y no promete rentabilidades garantizadas.",
  "Te permite retirar tu dinero bajo condiciones claras, sin presión ni condiciones ocultas.",
  "Tiene canales de atención y quejas verificables, y aparece registrada con la misma razón social en fuentes oficiales.",
];

export function InvestmentExplorer({ token, walletId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const result = await getOpportunities(token, walletId);
        if (!cancelled) setData(result);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token, walletId]);

  const severity = data?.severity || "neutral";
  const PanoramaIcon = SEVERITY_ICON[severity] || Minus;

  return (
    <div className="space-y-6">
      {/* Disclaimer: siempre visible, no es un banner que se pueda "aceptar y olvidar" */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p>
          <span className="font-bold">
            Contenido educativo, no es asesoría financiera.
          </span>{" "}
          Esta sección no recomienda comprar ni vender ningún instrumento
          específico. Antes de invertir, consulta con un asesor financiero
          certificado o una plataforma regulada.
        </p>
      </div>

      {/* Panorama personal: solo describe los propios datos del usuario */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <PiggyBank className="h-4 w-4 text-neutral-500" />
          <h3 className="text-sm font-bold text-neutral-800">
            Tu panorama de ahorro
          </h3>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 rounded-2xl border border-neutral-100 bg-white px-4 py-3 text-sm text-neutral-400 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analizando tu flujo de caja...
          </div>
        ) : !data ? (
          <div className="rounded-2xl border border-neutral-100 bg-white px-4 py-3 text-sm text-neutral-400 shadow-sm">
            No se pudo cargar tu panorama de ahorro por ahora.
          </div>
        ) : !data.hasEnoughHistory ? (
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 shadow-sm">
            {data.message}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 rounded-2xl border p-4 ${SEVERITY_STYLES[severity]}`}
          >
            <div className="mt-0.5 rounded-xl bg-white/60 p-2">
              <PanoramaIcon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug">{data.message}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-70">
                <span>
                  Ingreso prom.: {data.currencySymbol}
                  {data.averages?.monthlyIncome?.toLocaleString("es-CO")}
                </span>
                <span>
                  Gasto prom.: {data.currencySymbol}
                  {data.averages?.monthlyExpense?.toLocaleString("es-CO")}
                </span>
                <span>
                  Excedente prom.: {data.currencySymbol}
                  {data.averages?.monthlySurplus?.toLocaleString("es-CO")}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Educación genérica */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <GraduationCap className="h-4 w-4 text-neutral-500" />
          <h3 className="text-sm font-bold text-neutral-800">
            Aprende antes de invertir
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {EDUCATION_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm"
              >
                <div className="mt-0.5 rounded-xl bg-neutral-50 p-2 text-neutral-600">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-neutral-800">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cómo verificar una plataforma, sin recomendar ninguna en particular */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck className="h-4 w-4 text-neutral-500" />
          <h3 className="text-sm font-bold text-neutral-800">
            Cómo verificar una plataforma antes de invertir
          </h3>
        </div>
        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
          <ul className="space-y-2.5">
            {VERIFICATION_CRITERIA.map((criterion) => (
              <li
                key={criterion}
                className="flex items-start gap-2.5 text-sm text-neutral-600"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
          <a
            href="https://www.superfinanciera.gov.co/publicaciones/13067/industrias-supervisadasentidades-vigiladas-por-la-superintendencia-financiera-de-colombia-13067/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
          >
            Consultar entidades vigiladas por la Superfinanciera
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <p className="mt-3 text-xs text-neutral-400">
            La decisión final de dónde invertir es siempre tuya. Esta lista de
            criterios busca ayudarte a verificarla por tu cuenta, no reemplaza
            el consejo de un asesor certificado.
          </p>
        </div>
      </div>
    </div>
  );
}
