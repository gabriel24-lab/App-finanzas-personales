const express = require("express");
const { register, login, me } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/me
router.get("/me", protect, me);

module.exports = router;
