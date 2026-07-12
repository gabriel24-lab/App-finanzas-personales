const PDFDocument = require("pdfkit");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { monthRange } = require("../utils/reportUtils");

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function formatMoney(value, currency = "COP") {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * GET /api/reports/pdf?month=7&year=2026&wallet_id=...
 * Genera un PDF simple con tabla de transacciones del mes indicado.
 */
const generatePDFReport = asyncHandler(async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month ?? now.getMonth() + 1);
  const year = Number(req.query.year ?? now.getFullYear());
  const { wallet_id } = req.query;

  if (month < 1 || month > 12) {
    throw new ApiError(400, "El mes debe estar entre 1 y 12.");
  }

  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, "Usuario no encontrado.");

  const filter = {
    user_id: req.userId,
    date: {
      $gte: new Date(year, month - 1, 1),
      $lte: new Date(year, month, 0, 23, 59, 59, 999),
    },
  };
  if (wallet_id) filter.wallet_id = wallet_id;

  const transactions = await Transaction.find(filter).sort({ date: -1 });

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const currency =
    transactions[0]?.currency_code ||
    user.wallets?.[0]?.currency_code ||
    "COP";

  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const filename = `reporte-${year}-${String(month).padStart(2, "0")}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  doc.pipe(res);

  doc.fontSize(18).text("Reporte de Finanzas", { align: "center" });
  doc.moveDown(0.5);
  doc
    .fontSize(11)
    .fillColor("#666")
    .text(`${user.name} · ${MONTH_NAMES[month - 1]} ${year}`, { align: "center" });
  doc.moveDown(1.5);

  doc.fillColor("#000").fontSize(12);
  doc.text(`Ingresos: ${formatMoney(income, currency)}`);
  doc.text(`Gastos: ${formatMoney(expense, currency)}`);
  doc.text(`Balance neto: ${formatMoney(income - expense, currency)}`);
  doc.moveDown(1);

  doc.fontSize(13).text("Transacciones", { underline: true });
  doc.moveDown(0.5);

  if (transactions.length === 0) {
    doc.fontSize(10).fillColor("#888").text("No hay transacciones en este periodo.");
  } else {
    const colX = { date: 50, desc: 120, cat: 300, type: 380, amount: 460 };
    doc.fontSize(9).fillColor("#444");
    doc.text("Fecha", colX.date, doc.y, { continued: false });
    const headerY = doc.y - 12;
    doc.text("Descripción", colX.desc, headerY);
    doc.text("Categoría", colX.cat, headerY);
    doc.text("Tipo", colX.type, headerY);
    doc.text("Monto", colX.amount, headerY);
    doc.moveDown(0.3);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#ddd");
    doc.moveDown(0.3);

    transactions.forEach((t) => {
      if (doc.y > 720) {
        doc.addPage();
      }
      const rowY = doc.y;
      const dateStr = new Date(t.date).toLocaleDateString("es-CO");
      doc.fontSize(8).fillColor("#333");
      doc.text(dateStr, colX.date, rowY, { width: 65 });
      doc.text(t.description.slice(0, 28), colX.desc, rowY, { width: 170 });
      doc.text(t.category.slice(0, 14), colX.cat, rowY, { width: 70 });
      doc.text(t.type === "income" ? "Ingreso" : "Gasto", colX.type, rowY, { width: 50 });
      doc.text(formatMoney(t.amount, t.currency_code), colX.amount, rowY, { width: 85 });
      doc.moveDown(0.8);
    });
  }

  doc.end();
});

module.exports = { generatePDFReport };
