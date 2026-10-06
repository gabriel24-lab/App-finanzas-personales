import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Trash2, Check, X, PartyPopper } from "lucide-react";
import { COLOR_OPTIONS } from "../iconMap";
import { ConfirmDialog } from "./ConfirmDialog";
import { useLanguage } from "../context/LanguageContext";
import {
  fetchGoals,
  createGoalApi,
  addGoalFundsApi,
  deleteGoalApi,
} from "../api";

const easeOut = [0.22, 1, 0.36, 1];

// Clave que usaban las versiones anteriores para guardar las metas SOLO en
// este navegador. Ahora las metas viven en la base de datos; esta clave se
// conserva únicamente para migrar una vez las metas que ya existían.
const LEGACY_STORAGE_PREFIX = "app_finanzas_goals_";

function readLegacyGoals(userId) {
  try {
    const raw = localStorage.getItem(`${LEGACY_STORAGE_PREFIX}${userId}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Migraciones en curso por usuario, para que una segunda ejecución del
// efecto espere a la primera en lugar de cargar una lista incompleta.
const pendingMigrations = new Map();

function migrateLegacyGoals(token, userId) {
  if (pendingMigrations.has(userId)) return pendingMigrations.get(userId);
  const promise = doMigrateLegacyGoals(token, userId).finally(() => {
    pendingMigrations.delete(userId);
  });
  pendingMigrations.set(userId, promise);
  return promise;
}

// Sube a la base de datos las metas que estaban solo en el navegador y,
// si todo sale bien, limpia el almacenamiento local para no duplicarlas.
async function doMigrateLegacyGoals(token, userId) {
  const legacy = readLegacyGoals(userId);
  if (legacy.length === 0) return;

  const key = `${LEGACY_STORAGE_PREFIX}${userId}`;
  // Se borra antes de subir para que una segunda ejecución simultánea
  // (p. ej. React StrictMode en desarrollo) no las suba dos veces.
  const backup = localStorage.getItem(key);
  localStorage.removeItem(key);

  try {
    // De la más antigua a la más reciente para conservar el orden.
    for (const g of [...legacy].reverse()) {
      await createGoalApi(token, userId, {
        name: g.name,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        color: /^#[0-9a-fA-F]{6}$/.test(g.color || "") ? g.color : undefined,
      });
    }
  } catch (err) {
    // Si falla, se restaura para reintentar en la próxima visita.
    if (backup !== null) localStorage.setItem(key, backup);
    throw err;
  }
}

function GoalForm({ onCancel, onSubmit }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetAmount = parseFloat(target);
    const currentAmount = parseFloat(current) || 0;
    if (!name.trim()) {
      setError("Ponle un nombre a tu meta, por ejemplo: Vacaciones.");
      return;
    }
    if (Number.isNaN(targetAmount) || targetAmount <= 0) {
      setError("Escribe cuánto quieres ahorrar en total (mayor que cero).");
      return;
    }
    onSubmit({
      name: name.trim(),
      targetAmount,
      currentAmount: Math.min(currentAmount, targetAmount),
      color: COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)],
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: easeOut }}
      onSubmit={handleSubmit}
      className="overflow-hidden"
    >
      <div className="mt-3 space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            ¿Para qué estás ahorrando?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            placeholder="Ej: Vacaciones, Computador nuevo, Fondo de emergencia..."
            autoFocus
            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Meta total
            </label>
            <input
              type="number"
              min="0.01"
              step="any"
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
                setError("");
              }}
              placeholder="2000000"
              className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
              Ya tienes ahorrado (opcional)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="0"
              className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600"
            />
          </div>
        </div>

        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-500 hover:bg-neutral-100 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center gap-1 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700 cursor-pointer"
          >
            <Check className="h-3.5 w-3.5" />
            Crear meta
          </button>
        </div>
      </div>
    </motion.form>
  );
}

function GoalCard({ goal, formatCurrency, onAddFunds, onDelete }) {
  const [addingFunds, setAddingFunds] = useState(false);
  const [amount, setAmount] = useState("");
  const percentage = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100,
  );
  const completed = goal.currentAmount >= goal.targetAmount;

  const handleAdd = (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (Number.isNaN(value) || value <= 0) return;
    onAddFunds(goal.id, value);
    setAmount("");
    setAddingFunds(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.25, ease: easeOut }}
      className="rounded-2xl border border-neutral-100 p-4 hover:bg-neutral-50/60"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${goal.color}1a`, color: goal.color }}
          >
            {completed ? (
              <PartyPopper className="h-4.5 w-4.5" />
            ) : (
              <Target className="h-4.5 w-4.5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-800">
              {goal.name}
            </p>
            <p className="text-xs text-neutral-500">
              {formatCurrency(goal.currentAmount)}{" "}
              <span className="text-neutral-400">
                / {formatCurrency(goal.targetAmount)}
              </span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(goal.id)}
          title="Eliminar meta"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-neutral-300 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="h-full rounded-full"
          style={{ backgroundColor: goal.color }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-y-1">
        <span className="text-[11px] font-semibold text-neutral-500">
          {completed
            ? "¡Meta completada! 🎉"
            : `${percentage.toFixed(0)}% completado`}
        </span>
        {!completed &&
          (addingFunds ? (
            <form onSubmit={handleAdd} className="flex items-center gap-1.5">
              <input
                type="number"
                min="0.01"
                step="any"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Monto"
                className="w-20 rounded-lg border border-neutral-200 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-600/15 focus:border-brand-600"
              />
              <button
                type="submit"
                className="rounded-lg bg-brand-600 px-2 py-1 text-[11px] font-semibold text-white cursor-pointer"
              >
                Añadir
              </button>
              <button
                type="button"
                onClick={() => setAddingFunds(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAddingFunds(true)}
              className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              + Agregar ahorro
            </button>
          ))}
      </div>
    </motion.div>
  );
}

export function SavingsGoals({ userId, token, wallet }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [adding, setAdding] = useState(false);
  const currencyCode = wallet?.currency_code || "COP";

  // Carga las metas desde el servidor (así se ven igual en cualquier
  // dispositivo) y, antes, migra las que estuvieran solo en este navegador.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        try {
          await migrateLegacyGoals(token, userId);
        } catch {
          // Si la migración falla no bloqueamos la carga; se reintentará.
        }
        const data = await fetchGoals(token, userId);
        if (!cancelled) setGoals(data);
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || "No se pudieron cargar tus metas.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [token, userId]);

  const formatCurrency = useMemo(
    () => (value) =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: currencyCode,
        minimumFractionDigits: 0,
      }).format(value),
    [currencyCode],
  );

  const handleCreate = async (values) => {
    setActionError("");
    try {
      const created = await createGoalApi(token, userId, values);
      setGoals((prev) => [created, ...prev]);
      setAdding(false);
    } catch (err) {
      setActionError(err.message || "No se pudo crear la meta.");
    }
  };

  const handleAddFunds = async (id, amount) => {
    setActionError("");
    try {
      const updated = await addGoalFundsApi(token, id, amount);
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
    } catch (err) {
      setActionError(err.message || "No se pudo agregar el ahorro.");
    }
  };

  const { t } = useLanguage();
  const [pendingDeleteGoalId, setPendingDeleteGoalId] = useState(null);

  const handleDelete = (id) => {
    setPendingDeleteGoalId(id);
  };

  const cancelDeleteGoal = () => {
    setPendingDeleteGoalId(null);
  };

  const confirmDeleteGoal = async () => {
    if (!pendingDeleteGoalId) return;
    const id = pendingDeleteGoalId;
    setPendingDeleteGoalId(null);
    setActionError("");
    try {
      await deleteGoalApi(token, id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setActionError(err.message || "No se pudo eliminar la meta.");
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-1 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-800">
          <Target className="h-5 w-5 text-neutral-900" />
          Metas de ahorro
        </h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 rounded-xl border border-neutral-200 px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:border-brand-600 hover:text-neutral-900 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Nueva meta
          </button>
        )}
      </div>
      <p className="mb-4 text-xs text-neutral-500">
        Ponle nombre y monto a lo que quieres lograr — unas vacaciones, un fondo
        de emergencia, un computador nuevo — y ve tu progreso.
      </p>

      <AnimatePresence>
        {adding && (
          <GoalForm onCancel={() => setAdding(false)} onSubmit={handleCreate} />
        )}
      </AnimatePresence>

      {actionError && (
        <p className="mt-3 text-xs font-medium text-rose-600">{actionError}</p>
      )}

      {loading && (
        <p className="mt-3 text-xs text-neutral-500">Cargando tus metas...</p>
      )}

      {!loading && loadError && (
        <p className="mt-3 text-xs font-medium text-rose-600">{loadError}</p>
      )}

      <div className="mt-3 space-y-3">
        <AnimatePresence initial={false}>
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              formatCurrency={formatCurrency}
              onAddFunds={handleAddFunds}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>

        {!loading && !loadError && goals.length === 0 && !adding && (
          <div className="rounded-2xl border border-dashed border-neutral-200 py-8 px-4 text-center">
            <p className="text-sm font-semibold text-neutral-700">
              Todavía no tienes metas de ahorro
            </p>
            <p className="mx-auto mt-1 max-w-xs text-xs text-neutral-500">
              Por ejemplo: "Vacaciones — $2.000.000". Usa el botón "Nueva meta"
              para crear la primera.
            </p>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={Boolean(pendingDeleteGoalId)}
        title={t("goals.confirm.deleteTitle")}
        message={t("goals.confirm.delete")}
        cancelLabel={t("common.dialog.cancel")}
        confirmLabel={t("common.dialog.confirm")}
        onCancel={cancelDeleteGoal}
        onConfirm={confirmDeleteGoal}
      />
    </div>
  );
}