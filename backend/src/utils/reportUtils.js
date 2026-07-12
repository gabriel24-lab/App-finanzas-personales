function startOfMonth(year, month) {
  return new Date(year, month, 1, 0, 0, 0, 0);
}

function endOfMonth(year, month) {
  return new Date(year, month + 1, 0, 23, 59, 59, 999);
}

function monthRange(offsetMonths = 0) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + offsetMonths, 1);
  return {
    start: startOfMonth(d.getFullYear(), d.getMonth()),
    end: endOfMonth(d.getFullYear(), d.getMonth()),
    year: d.getFullYear(),
    month: d.getMonth(),
  };
}

function pctChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function sumByType(transactions, type) {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.amount, 0);
}

function groupByCategory(transactions, type = "expense") {
  return transactions
    .filter((t) => t.type === type)
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = {
  startOfMonth,
  endOfMonth,
  monthRange,
  pctChange,
  sumByType,
  groupByCategory,
  escapeRegex,
};
