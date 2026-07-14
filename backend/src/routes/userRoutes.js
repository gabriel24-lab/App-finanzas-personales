const express = require("express");
const { getUser, addWallet } = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const { addWalletSchema } = require("../validation/schemas");

const router = express.Router();

// Estas rutas exponen datos y mutaciones sobre una cuenta de usuario, así
// que requieren sesión. Los controladores además verifican que :id
// coincida con el usuario autenticado (ver userController.js), evitando
// que cualquier persona autenticada consulte o modifique cuentas ajenas.
//
// NOTA: el registro de cuentas nuevas vive únicamente en
// POST /api/auth/register (con hashing, rate limiting, cookie httpOnly y
// siembra de categorías por defecto). Este router ya no expone un endpoint
// de creación de usuarios sin autenticar.
router.use(protect);

// GET /api/users/:id
router.get("/:id", getUser);

// POST /api/users/:id/wallets
router.post("/:id/wallets", validate(addWalletSchema), addWallet);

module.exports = router;
