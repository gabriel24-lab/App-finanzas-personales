import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Inbox } from "lucide-react";
import { getCategoryIcon } from "../iconMap";

// Busca la categoría del usuario por nombre para tomar su color/ícono real.
// Si la transacción quedó "huérfana" (la categoría fue borrada luego), cae
// a un estilo neutro genérico en vez de romper la fila.
const getCategoryDetails = (categoryName, categories) => {
  const match = categories.find((c) => c.name === categoryName);
  if (!match) {
    return { IconComponent: getCategoryIcon("Tag"), color: "#a3a3a3" };
  }
  return { IconComponent: getCategoryIcon(match.icon), color: match.color };
};

export function TransactionList({ transactions = [], categories = [], onDeleteTransaction }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateStr) => {
    // Prevent time zone offset shift by parsing date as UTC or splitting
    const [year, month, day] = dateStr.split("-");
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white py-12 px-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 text-neutral-400">
          <Inbox className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-neutral-800">
          No hay movimientos
        </h3>
        <p className="mt-1 text-xs text-neutral-500 max-w-xs mx-auto">
          No se encontraron transacciones. Intenta ajustando los filtros o
          agrega una nueva transacción para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-125 border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <th className="py-3.5 px-4 font-semibold">
                Descripción / Categoría
              </th>
              <th className="py-3.5 px-4 font-semibold">Fecha</th>
              <th className="py-3.5 px-4 font-semibold text-right">Monto</th>
              <th className="py-3.5 px-4 font-semibold text-center w-16">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            <AnimatePresence initial={false}>
              {transactions.map((transaction) => {
                const { IconComponent, color } = getCategoryDetails(
                  transaction.category,
                  categories,
                );
                const isIncome = transaction.type === "income";

                return (
                  <motion.tr
                    key={transaction.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="group hover:bg-neutral-50/50 transition-colors duration-200"
                  >
                  {/* Category Icon and Description */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border"
                        style={{
                          backgroundColor: `${color}14`,
                          borderColor: `${color}33`,
                          color,
                        }}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-800 text-sm leading-tight">
                          {transaction.description}
                        </p>
                        <span className="inline-flex items-center text-xs text-neutral-500 font-medium mt-0.5">
                          {transaction.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 align-middle">
                    <span className="text-neutral-600 text-xs font-medium">
                      {formatDate(transaction.date)}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 text-right align-middle">
                    <div className="inline-flex items-center gap-1 font-bold text-sm">
                      {isIncome ? (
                        <span className="text-emerald-600 font-bold">
                          +{formatCurrency(transaction.amount)}
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold">
                          -{formatCurrency(transaction.amount)}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions (Delete button) */}
                  <td className="py-4 px-4 text-center align-middle">
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="inline-flex items-center justify-center h-8 w-8 text-neutral-400 hover:text-rose-600 rounded-2xl hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                      title="Eliminar transacción"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
