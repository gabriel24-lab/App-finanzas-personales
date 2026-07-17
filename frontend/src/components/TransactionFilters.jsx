import React, { useEffect, useMemo } from "react";
import { Search, Filter, RefreshCw } from "lucide-react";

export function TransactionFilters({
  categories = [],
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  onResetFilters,
}) {
  const displayedCategories = useMemo(() => {
    const names = categories
      .filter((c) => typeFilter === "all" || c.type === typeFilter)
      .map((c) => c.name);
    return names;
  }, [typeFilter, categories]);

  // Reset category filter if it's no longer in the list when type filter changes
  useEffect(() => {
    if (
      categoryFilter !== "" &&
      !displayedCategories.includes(categoryFilter)
    ) {
      setCategoryFilter("");
    }
  }, [typeFilter, displayedCategories, categoryFilter, setCategoryFilter]);

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Buscar por descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600 focus:bg-white transition-all"
          />
        </div>

        {/* Quick Type Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-50 rounded-2xl border border-neutral-100 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setTypeFilter("all")}
            className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
              typeFilter === "all"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("income")}
            className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
              typeFilter === "income"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Ingresos
          </button>
          <button
            type="button"
            onClick={() => setTypeFilter("expense")}
            className={`px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
              typeFilter === "expense"
                ? "bg-white text-rose-600 shadow-sm"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Gastos
          </button>
        </div>
      </div>

      {/* Row 2: Category Filter & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Category Selector */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-400" />
          <span className="text-xs text-neutral-500 font-medium">
            Categoría:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-3 pr-8 py-1.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs text-neutral-700 font-medium focus:outline-none focus:ring-2 focus:ring-brand-600/10 focus:border-brand-600 focus:bg-white transition-all cursor-pointer appearance-none"
          >
            <option value="">Todas las categorías</option>
            {displayedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Clear/Reset button */}
        {(search || typeFilter !== "all" || categoryFilter) && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-xs text-neutral-900 hover:text-neutral-600 font-semibold cursor-pointer transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Limpiar filtros
          </button>
        )}
      </div>
    </div>
  );
}
