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

async function downloadFile(path, { token, filename, ...options } = {}) {
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || `Error ${res.status} al descargar ${path}`);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "download";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// --- Autenticación ---

export async function registerApi(name, email, password, currencyCode) {
  const { token, user } = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, currency_code: currencyCode }),
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

// --- Categorías ---

export async function fetchCategories(token, userId) {
  const { categories } = await request(`/categories/${userId}`, { token });
  return categories.map((c) => ({
    id: c._id,
    name: c.name,
    type: c.type,
    color: c.color,
    icon: c.icon,
    isDefault: c.is_default,
  }));
}

export async function createCategoryApi(token, userId, { name, type, color, icon }) {
  const { category } = await request("/categories", {
    token,
    method: "POST",
    body: JSON.stringify({ user_id: userId, name, type, color, icon }),
  });
  return {
    id: category._id,
    name: category.name,
    type: category.type,
    color: category.color,
    icon: category.icon,
    isDefault: category.is_default,
  };
}

export async function updateCategoryApi(token, categoryId, updates) {
  const { category } = await request(`/categories/${categoryId}`, {
    token,
    method: "PUT",
    body: JSON.stringify(updates),
  });
  return {
    id: category._id,
    name: category.name,
    type: category.type,
    color: category.color,
    icon: category.icon,
    isDefault: category.is_default,
  };
}

export async function deleteCategoryApi(token, categoryId) {
  await request(`/categories/${categoryId}`, { token, method: "DELETE" });
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

// --- Reportes y analítica (Fase 1) ---

export async function getComparativeReport(token, walletId) {
  const params = new URLSearchParams();
  if (walletId) params.set("wallet_id", walletId);
  const qs = params.toString();
  return request(`/transactions/report/comparative${qs ? `?${qs}` : ""}`, { token });
}

export async function getCashFlowProjection(token, walletId) {
  const params = new URLSearchParams();
  if (walletId) params.set("wallet_id", walletId);
  const qs = params.toString();
  return request(`/transactions/report/projection${qs ? `?${qs}` : ""}`, { token });
}

export async function getInsights(token, walletId) {
  const params = new URLSearchParams();
  if (walletId) params.set("wallet_id", walletId);
  const qs = params.toString();
  return request(`/transactions/report/insights${qs ? `?${qs}` : ""}`, { token });
}

export async function getOpportunities(token, walletId) {
  const params = new URLSearchParams();
  if (walletId) params.set("wallet_id", walletId);
  const qs = params.toString();
  return request(`/transactions/report/opportunities${qs ? `?${qs}` : ""}`, { token });
}

export async function searchTransactions(token, query, options = {}) {
  const params = new URLSearchParams({ q: query });
  if (options.walletId) params.set("wallet_id", options.walletId);
  if (options.type) params.set("type", options.type);
  if (options.limit) params.set("limit", String(options.limit));
  const { data } = await request(`/transactions/search?${params}`, { token });
  return data.map(toFrontendTransaction);
}

function buildExportQuery(format, filters = {}) {
  const params = new URLSearchParams({ format });
  if (filters.walletId) params.set("wallet_id", filters.walletId);
  if (filters.type) params.set("type", filters.type);
  if (filters.category) params.set("category", filters.category);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  return params.toString();
}

export async function exportTransactions(token, format = "csv", filters = {}) {
  const qs = buildExportQuery(format, filters);
  const ext = format === "xlsx" ? "xlsx" : "csv";
  await downloadFile(`/transactions/export?${qs}`, {
    token,
    filename: `transacciones.${ext}`,
  });
}

export async function downloadPDFReport(token, month, year, walletId) {
  const params = new URLSearchParams({
    month: String(month),
    year: String(year),
  });
  if (walletId) params.set("wallet_id", walletId);
  await downloadFile(`/reports/pdf?${params}`, {
    token,
    filename: `reporte-${year}-${String(month).padStart(2, "0")}.pdf`,
  });
}
