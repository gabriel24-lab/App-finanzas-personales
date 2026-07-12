const express = require("express");
const { createUser, getUser, addWallet } = require("../controllers/userController");

const router = express.Router();

// POST /api/users
router.post("/", createUser);

// GET /api/users/:id
router.get("/:id", getUser);

// POST /api/users/:id/wallets
router.post("/:id/wallets", addWallet);

module.exports = router;
