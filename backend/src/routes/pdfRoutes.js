const express = require("express");
const { generatePDFReport } = require("../controllers/pdfController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

// GET /api/reports/pdf?month=7&year=2026
router.get("/pdf", generatePDFReport);

module.exports = router;
