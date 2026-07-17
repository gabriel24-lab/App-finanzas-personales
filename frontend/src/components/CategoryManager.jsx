import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tags,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { ICON_OPTIONS, COLOR_OPTIONS, getCategoryIcon } from "../iconMap";
import { InfoTooltip } from "./InfoTooltip";
import { ConfirmDialog } from "./ConfirmDialog";
import { useLanguage } from "../context/LanguageContext";

const easeOut = [0.22, 1, 0.36, 1];

function IconPicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-8 gap-1.5 max-h-36 overflow-y-auto rounded-2xl border border-neutral-200 bg-neutral-50 p-2 sm:grid-cols-10">
      {ICON_OPTIONS.map(({ name, label }) => {
        const IconComp = getCategoryIcon(name);
        const selected = value === name;
        return (
          <button
            key={name}
            type="button"
            title={label}
            onClick={() => onChange(name)}
            className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all cursor-pointer ${
              selected
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-transparent bg-white text-neutral-500 hover:border-neutral-200 hover:text-neutral-800"
            }`}
          >
            <IconComp className="h-4 w-4" />
          </button>
        );
      })}
    </div>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COLOR_OPTIONS.map((hex) => {
        const selected = value?.toLowerCase() === hex.toLowerCase();
        return (
          <button
            key={hex}
            type="button"
            onClick={() => onChange(hex)}
            className={`h-6 w-6 rounded-full border-2 transition-transform cursor-pointer ${
              selected ? "scale-110 border-brand-600" : "border-white"
            }`}
            style={{
              backgroundColor: hex,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
            }}
            title={hex}
          />
        );
      })}
    </div>
  );
}

function CategoryForm({ initial, type, onCancel, onSubmit, submitLabel }) {
  const [name, setName] = useState(initial?.name || "");
  const [icon, setIcon] = useState(initial?.icon || "Tag");
  const [color, setColor] = useState(initial?.color || COLOR_OPTIONS[0]);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Ponle un nombre a la categoría.");
      return;
    }
    onSubmit({ name: name.trim(), icon, color, type });
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
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="Nombre de la categoría"
          autoFocus
          className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600"
        />

        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Color
          </p>
          <ColorPicker value={color} onChange={setColor} />
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
            Ícono
          </p>
          <IconPicker value={icon} onChange={setIcon} />
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
            {submitLabel}
          </button>
        </div>
      </div>
    </motion.form>
  );
}

function CategoryRow({ category, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const IconComp = getCategoryIcon(category.icon);

  if (editing) {
    return (
      <CategoryForm
        initial={category}
        type={category.type}
        submitLabel="Guardar"
        onCancel={() => setEditing(false)}
        onSubmit={(values) => {
          onUpdate(category.id, values);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.25, ease: easeOut }}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-neutral-100 px-3 py-2.5 hover:bg-neutral-50/70"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${category.color}1a`,
            color: category.color,
          }}
        >
          <IconComp className="h-4.5 w-4.5" />
        </div>
        <span className="truncate text-sm font-semibold text-neutral-800">
          {category.name}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={() => setEditing(true)}
          title="Editar"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-800 cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(category.id)}
          title="Eliminar"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

function CategoryTypeSection({
  type,
  label,
  Icon,
  accentClass,
  categories,
  onCreate,
  onUpdate,
  onDelete,
}) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-neutral-800">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-lg ${accentClass}`}
          >
            <Icon className="h-4 w-4" />
          </span>
          {label}
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
            {categories.length}
          </span>
        </h3>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 rounded-xl border border-neutral-200 px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:border-brand-600 hover:text-neutral-900 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Nueva
          </button>
        )}
      </div>

      <AnimatePresence>
        {adding && (
          <CategoryForm
            type={type}
            submitLabel="Crear"
            onCancel={() => setAdding(false)}
            onSubmit={(values) => {
              onCreate(values);
              setAdding(false);
            }}
          />
        )}
      </AnimatePresence>

      <div className="mt-3 space-y-1.5">
        <AnimatePresence initial={false}>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
        {categories.length === 0 && !adding && (
          <p className="py-4 text-center text-xs text-neutral-400">
            Aún no tienes categorías de {label.toLowerCase()}. Usa el botón
            "Nueva" de arriba para crear la primera.
          </p>
        )}
      </div>
    </div>
  );
}

export function CategoryManager({
  categories = [],
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
}) {
  const { incomeCategories, expenseCategories } = useMemo(
    () => ({
      incomeCategories: categories.filter((c) => c.type === "income"),
      expenseCategories: categories.filter((c) => c.type === "expense"),
    }),
    [categories],
  );

  const { t } = useLanguage();
  const [pendingDeleteCategoryId, setPendingDeleteCategoryId] = useState(null);

  const requestDeleteCategory = (id) => setPendingDeleteCategoryId(id);
  const cancelDeleteCategory = () => setPendingDeleteCategoryId(null);
  const confirmDeleteCategory = () => {
    if (!pendingDeleteCategoryId) return;
    onDeleteCategory(pendingDeleteCategoryId);
    setPendingDeleteCategoryId(null);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-800">
          <Tags className="h-5 w-5 text-neutral-900" />
          Categorías
          <InfoTooltip text="Las categorías son etiquetas para agrupar tus movimientos, como 'Comida', 'Transporte' o 'Sueldo'. Te ayudan a ver en qué se te va el dinero y a definir presupuestos por tipo de gasto." />
        </h2>
        <p className="mt-1 text-xs text-neutral-500">
          Crea, renombra o elimina las categorías que usas para clasificar tus
          ingresos y gastos. Cada una tiene su propio color e ícono para que las
          reconozcas rápido en tus movimientos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoryTypeSection
          type="income"
          label="Ingresos"
          Icon={ArrowUpRight}
          accentClass="bg-emerald-50 text-emerald-600"
          categories={incomeCategories}
          onCreate={onCreateCategory}
          onUpdate={onUpdateCategory}
          onDelete={requestDeleteCategory}
        />
        <CategoryTypeSection
          type="expense"
          label="Gastos"
          Icon={ArrowDownRight}
          accentClass="bg-rose-50 text-rose-600"
          categories={expenseCategories}
          onCreate={onCreateCategory}
          onUpdate={onUpdateCategory}
          onDelete={requestDeleteCategory}
        />
      </div>
      <ConfirmDialog
        open={Boolean(pendingDeleteCategoryId)}
        title={t("category.confirm.deleteTitle")}
        message={t("category.confirm.delete")}
        cancelLabel={t("common.dialog.cancel")}
        confirmLabel={t("common.dialog.confirm")}
        onCancel={cancelDeleteCategory}
        onConfirm={confirmDeleteCategory}
      />
    </div>
  );
}
