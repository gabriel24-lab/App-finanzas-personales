const mongoose = require("mongoose");
const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const DEFAULT_CATEGORIES = require("../utils/defaultCategories");

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

function assertOwnsUser(userId, req) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "userId no es un ObjectId válido.");
  }
  if (userId !== req.userId) {
    throw new ApiError(403, "No tienes permiso para operar sobre estas categorías.");
  }
}

/**
 * Crea el set de categorías por defecto para un usuario. Se usa tanto en el
 * registro (authController) como perezosamente la primera vez que un
 * usuario antiguo (creado antes de esta feature) pide sus categorías.
 */
async function seedDefaultCategories(userId) {
  const docs = DEFAULT_CATEGORIES.map((c) => ({ ...c, user_id: userId, is_default: true }));
  await Category.insertMany(docs, { ordered: false }).catch(() => {
    // Si alguna ya existe (carrera entre requests), ignoramos el duplicado.
  });
}

/**
 * GET /api/categories/:userId
 * Devuelve todas las categorías del usuario, sembrando las categorías por
 * defecto si todavía no tiene ninguna.
 */
const getCategories = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  assertOwnsUser(userId, req);

  let categories = await Category.find({ user_id: userId }).sort({ type: 1, name: 1 });

  if (categories.length === 0) {
    await seedDefaultCategories(userId);
    categories = await Category.find({ user_id: userId }).sort({ type: 1, name: 1 });
  }

  res.status(200).json({ categories });
});

/**
 * POST /api/categories
 * Body: { user_id, name, type, color?, icon? }
 */
const createCategory = asyncHandler(async (req, res) => {
  const { user_id, name, type, color, icon } = req.body;
  assertOwnsUser(user_id, req);

  if (!name || typeof name !== "string" || !name.trim()) {
    throw new ApiError(400, "El nombre de la categoría es obligatorio.");
  }
  if (!["income", "expense"].includes(type)) {
    throw new ApiError(400, "El campo 'type' debe ser 'income' o 'expense'.");
  }
  if (color && !HEX_COLOR_RE.test(color)) {
    throw new ApiError(400, "El color debe ser un hexadecimal válido (ej: #6366f1).");
  }

  const existing = await Category.findOne({ user_id, name: name.trim(), type });
  if (existing) {
    throw new ApiError(409, "Ya tienes una categoría con ese nombre para ese tipo.");
  }

  const category = await Category.create({
    user_id,
    name: name.trim(),
    type,
    color: color || "#6366f1",
    icon: icon || "Tag",
  });

  res.status(201).json({ message: "Categoría creada correctamente.", category });
});

/**
 * PUT /api/categories/:id
 * Body: cualquier subconjunto de { name, color, icon }
 * (el `type` no se puede cambiar: mueve la categoría entre gastos e
 * ingresos y rompería el sentido de las transacciones ya registradas).
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, color, icon } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id no es un ObjectId válido.");
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Categoría no encontrada.");
  }
  if (String(category.user_id) !== req.userId) {
    throw new ApiError(403, "No tienes permiso para modificar esta categoría.");
  }

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      throw new ApiError(400, "El nombre de la categoría no puede estar vacío.");
    }
    category.name = name.trim();
  }
  if (color !== undefined) {
    if (!HEX_COLOR_RE.test(color)) {
      throw new ApiError(400, "El color debe ser un hexadecimal válido (ej: #6366f1).");
    }
    category.color = color;
  }
  if (icon !== undefined) {
    if (typeof icon !== "string" || !icon.trim()) {
      throw new ApiError(400, "El ícono no puede estar vacío.");
    }
    category.icon = icon.trim();
  }

  await category.save();

  res.status(200).json({ message: "Categoría actualizada correctamente.", category });
});

/**
 * DELETE /api/categories/:id
 * Las transacciones y presupuestos ya creados guardan el nombre de la
 * categoría como texto plano, así que borrarla no los afecta ni los borra;
 * simplemente deja de aparecer como opción para nuevos movimientos.
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "id no es un ObjectId válido.");
  }

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Categoría no encontrada.");
  }
  if (String(category.user_id) !== req.userId) {
    throw new ApiError(403, "No tienes permiso para eliminar esta categoría.");
  }

  await category.deleteOne();

  res.status(200).json({ message: "Categoría eliminada correctamente." });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
