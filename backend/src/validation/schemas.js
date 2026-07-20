const { z } = require("zod");

// ObjectId de Mongo: 24 caracteres hexadecimales.
const objectId = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "Debe ser un ObjectId válido.");

const hexColor = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "El color debe ser un hexadecimal válido (ej: #6366f1).");

const currencyCode = z
  .string()
  .trim()
  .min(3)
  .max(4)
  .transform((v) => v.toUpperCase());

const isoDateLike = z
  .union([z.string(), z.date()])
  .refine((v) => !Number.isNaN(new Date(v).getTime()), "Fecha inválida.")
  .optional();

// --- Auth ---

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres.").max(120),
    email: z.string().trim().toLowerCase().email("Email inválido.").max(254),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .max(128, "La contraseña es demasiado larga.")
      .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula.")
      .regex(/[0-9]/, "La contraseña debe contener al menos un número."),
    currency_code: currencyCode.optional(),
  })
  .strict();

const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Email inválido.").max(254),
    password: z.string().min(1, "La contraseña es obligatoria.").max(128),
  })
  .strict();

// --- Users (legacy endpoints) ---

const addWalletSchema = z
  .object({
    wallet_id: z.string().trim().min(1).max(64),
    currency_code: currencyCode,
    currency_symbol: z.string().trim().min(1).max(8),
    account_name: z.string().trim().min(1).max(80),
    current_balance: z.number().finite().optional().default(0),
  })
  .strict();

// --- Transactions ---

const createTransactionSchema = z
  .object({
    user_id: objectId,
    wallet_id: z.string().trim().min(1).max(64),
    description: z.string().trim().min(1).max(280),
    amount: z.number().positive("El monto debe ser mayor que cero."),
    type: z.enum(["income", "expense"]),
    category: z.string().trim().min(1).max(80),
    currency_code: currencyCode,
    date: isoDateLike,
  })
  .strict();

const updateTransactionSchema = z
  .object({
    description: z.string().trim().min(1).max(280).optional(),
    amount: z.number().positive("El monto debe ser mayor que cero.").optional(),
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().trim().min(1).max(80).optional(),
    date: isoDateLike,
  })
  .strict()
  .refine((obj) => Object.keys(obj).length > 0, "No se enviaron campos para actualizar.");

// --- Categories ---

const createCategorySchema = z
  .object({
    user_id: objectId,
    name: z.string().trim().min(1, "El nombre de la categoría es obligatorio.").max(60),
    type: z.enum(["income", "expense"]),
    color: hexColor.optional(),
    icon: z.string().trim().min(1).max(40).optional(),
  })
  .strict();

const updateCategorySchema = z
  .object({
    name: z.string().trim().min(1).max(60).optional(),
    color: hexColor.optional(),
    icon: z.string().trim().min(1).max(40).optional(),
  })
  .strict()
  .refine((obj) => Object.keys(obj).length > 0, "No se enviaron campos para actualizar.");

// --- Budgets ---

const upsertBudgetSchema = z
  .object({
    category: z.string().trim().min(1, "El campo 'category' es obligatorio.").max(80),
    monthly_limit: z.number().min(0, "El monto debe ser mayor o igual a 0."),
  })
  .strict();

module.exports = {
  registerSchema,
  loginSchema,
  addWalletSchema,
  createTransactionSchema,
  updateTransactionSchema,
  createCategorySchema,
  updateCategorySchema,
  upsertBudgetSchema,
};
