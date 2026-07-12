const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, { token, ...options } = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Error ${res.status} al llamar a ${path}`);
  }

  return data;
}

// --- Autenticación ---

export async function registerApi(name, email, password) {
  const { token, user } = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  return { token, user };
}

export async function loginApi(email, password) {
  const { token, user } = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return { token, user };
}

export async function fetchMe(token) {
  const { user } = await request("/auth/me", { token });
  return user;
}

// --- Transacciones ---

// Convierte una transacción del backend (_id, wallet_id, currency_code...)
// al formato simple que usan los componentes del frontend.
function toFrontendTransaction(t) {
  return {
    id: t._id,
    description: t.description,
    amount: t.amount,
    type: t.type,
    category: t.category,
    date: new Date(t.date).toISOString().split("T")[0],
  };
}

export async function fetchTransactions(token, userId) {
  const { data } = await request(`/transactions/${userId}?limit=100`, { token });
  return data.map(toFrontendTransaction);
}

export async function createTransaction(token, userId, walletId, currencyCode, transaction) {
  const { transaction: created } = await request("/transactions", {
    token,
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      wallet_id: walletId,
      currency_code: currencyCode,
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    }),
  });
  return toFrontendTransaction(created);
}

export async function updateTransaction(token, transactionId, updates) {
  const { transaction: updated } = await request(`/transactions/${transactionId}`, {
    token,
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return toFrontendTransaction(updated);
}

export async function deleteTransactionApi(token, transactionId) {
  await request(`/transactions/${transactionId}`, { token, method: "DELETE" });
}

// --- Presupuestos ---

export async function fetchBudgets(token, userId) {
  const { budgets } = await request(`/budgets/${userId}`, { token });
  return budgets;
}

export async function upsertBudgetApi(token, userId, category, monthlyLimit) {
  await request(`/budgets/${userId}`, {
    token,
    method: "PUT",
    body: JSON.stringify({ category, monthly_limit: monthlyLimit }),
  });
}
