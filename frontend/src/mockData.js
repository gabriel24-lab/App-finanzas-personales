import { TRANSACTION_TYPES } from "./types";

/** @type {import("./types").Transaction[]} */
export const INITIAL_TRANSACTIONS = [
  {
    id: "mock-1",
    description: "Salario Mensual",
    amount: 2500,
    type: TRANSACTION_TYPES.income,
    category: "Salario",
    date: "2026-07-01",
  },
  {
    id: "mock-2",
    description: "Compra de Supermercado",
    amount: 154.3,
    type: TRANSACTION_TYPES.expense,
    category: "Comida",
    date: "2026-07-05",
  },
  {
    id: "mock-3",
    description: "Suscripción Netflix",
    amount: 15.99,
    type: TRANSACTION_TYPES.expense,
    category: "Entretenimiento",
    date: "2026-07-09",
  },
];

export const CATEGORIES = {
  income: ["Salario", "Freelance", "Inversiones", "Otros Ingresos"],
  expense: [
    "Comida",
    "Transporte",
    "Educación",
    "Salud",
    "Hogar",
    "Entretenimiento",
    "Otros Gastos",
  ],
};

/** @type {import("./types").BudgetMap} */
export const INITIAL_BUDGETS = {
  Comida: 400,
  Transporte: 150,
  Educación: 100,
  Salud: 100,
  Hogar: 300,
  Entretenimiento: 60,
  "Otros Gastos": 100,
};
