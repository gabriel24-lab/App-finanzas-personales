export const TRANSACTION_TYPES = {
  income: "income",
  expense: "expense",
};

/**
 * @typedef {"income" | "expense"} TransactionType
 *
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} description
 * @property {number} amount
 * @property {TransactionType} type
 * @property {string} category
 * @property {string} date ISO date in YYYY-MM-DD format.
 */

/**
 * @typedef {Object.<string, number>} BudgetMap
 * Maps an expense category name to its monthly limit amount (0 or undefined = no limit set).
 */
