import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, PiggyBank, Tags, Check, X, Sparkles } from "lucide-react";

const easeOut = [0.22, 1, 0.36, 1];
const STORAGE_PREFIX = "app_finanzas_onboarding_dismissed_";

/**
 * Guía de 3 pasos para usuarios nuevos: registrar el primer movimiento,
 * definir un presupuesto y personalizar sus categorías. Se oculta sola
 * cuando el usuario completa los 3 pasos, o si la descarta manualmente
 * (se recuerda por usuario en localStorage).
 *
 * Por qué existe: un dashboard recién creado, sin datos, se siente rígido
 * y no le dice a la persona qué hacer primero. Esto reemplaza esa
 * sensación de "pantalla vacía" por un camino claro y accionable
 * (patrón de "progressive disclosure" + feedback de progreso).
 */
export function OnboardingChecklist({
  userId,
  hasTransactions,
  hasBudget,
  hasCustomCategory,
  onGoToBudgets,
  onGoToCategories,
}) {
  const storageKey = `${STORAGE_PREFIX}${userId}`;
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(storageKey) === "true",
  );

  const steps = useMemo(
    () => [
      {
        id: "transaction",
        label: "Registra tu primer movimiento",
        hint: "Usa el formulario de la izquierda para anotar un ingreso o un gasto.",
        done: hasTransactions,
        Icon: PlusCircle,
      },
      {
        id: "budget",
        label: "Define un presupuesto",
        hint: "Ponle un límite mensual a una categoría de gasto.",
        done: hasBudget,
        Icon: PiggyBank,
        onClick: onGoToBudgets,
      },
      {
        id: "categories",
        label: "Ajusta tus categorías",
        hint: "Ya te dejamos categorías por defecto: edítalas o crea las tuyas.",
        done: hasCustomCategory,
        Icon: Tags,
        onClick: onGoToCategories,
      },
    ],
    [
      hasTransactions,
      hasBudget,
      hasCustomCategory,
      onGoToBudgets,
      onGoToCategories,
    ],
  );

  const completedCount = steps.filter((s) => s.done).length;
  const allDone = completedCount === steps.length;

  // Si el usuario completa todo, guardamos el estado como "visto" para que
  // no vuelva a aparecer aunque borre datos después.
  useEffect(() => {
    if (allDone) {
      localStorage.setItem(storageKey, "true");
    }
  }, [allDone, storageKey]);

  if (dismissed || allDone) return null;

  const handleDismiss = () => {
    localStorage.setItem(storageKey, "true");
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.35, ease: easeOut }}
        className="relative overflow-hidden rounded-3xl border border-neutral-100 bg-linear-to-br from-white to-neutral-50 p-6 shadow-sm"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-500/10 blur-3xl" />

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Ocultar guía de bienvenida"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-800" />
          <h2 className="text-base font-bold text-neutral-800">
            Empecemos a organizar tu dinero
          </h2>
        </div>
        <p className="relative mt-1 text-xs text-neutral-500">
          {completedCount} de {steps.length} pasos completados. Te toma menos de
          2 minutos.
        </p>

        <div className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            initial={false}
            animate={{ width: `${(completedCount / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="h-full rounded-full bg-linear-to-r from-brand-600 to-brand-900"
          />
        </div>

        <div className="relative mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {steps.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={step.done ? undefined : step.onClick}
              disabled={step.done || !step.onClick}
              className={`flex items-start gap-2.5 rounded-2xl border p-3 text-left transition-all ${
                step.done
                  ? "border-emerald-100 bg-emerald-50/60 cursor-default"
                  : step.onClick
                    ? "border-neutral-200 bg-white hover:border-brand-600 cursor-pointer"
                    : "border-neutral-100 bg-white cursor-default"
              }`}
            >
              <div
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  step.done
                    ? "bg-emerald-500 text-white"
                    : "bg-neutral-100 text-neutral-400"
                }`}
              >
                {step.done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <step.Icon className="h-3.5 w-3.5" />
                )}
              </div>
              <div className="min-w-0">
                <p
                  className={`text-xs font-semibold leading-tight ${
                    step.done
                      ? "text-emerald-700 line-through"
                      : "text-neutral-800"
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-neutral-500">
                  {step.hint}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
