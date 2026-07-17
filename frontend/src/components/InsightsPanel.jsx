import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Tag,
  Star,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { getInsights } from "../api";

const ICON_MAP = {
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "piggy-bank": PiggyBank,
  tag: Tag,
  star: Star,
};

const SEVERITY_STYLES = {
  positive: "border-emerald-100 bg-emerald-50 text-emerald-800",
  warning: "border-amber-100 bg-amber-50 text-amber-800",
  neutral: "border-neutral-100 bg-neutral-50 text-neutral-700",
};

export function InsightsPanel({ token, walletId }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const { insights: data } = await getInsights(token, walletId);
        if (!cancelled) setInsights(data || []);
      } catch {
        if (!cancelled) setInsights([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token, walletId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-neutral-100 bg-white px-4 py-3 text-sm text-neutral-400 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Analizando tus finanzas...
      </div>
    );
  }

  if (insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Lightbulb className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-bold text-neutral-800">Insights del mes</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {insights.map((insight, i) => {
          const Icon = ICON_MAP[insight.icon] || Lightbulb;
          const style =
            SEVERITY_STYLES[insight.severity] || SEVERITY_STYLES.neutral;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 rounded-2xl border p-4 ${style}`}
            >
              <div className="mt-0.5 rounded-xl bg-white/60 p-2">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-snug">
                  {insight.message}
                </p>
                {insight.changePercent != null && (
                  <p className="mt-1 text-xs opacity-70">
                    {insight.changePercent > 0 ? "+" : ""}
                    {insight.changePercent}%
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
