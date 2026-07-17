const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();

// Render (y la mayoría de PaaS) coloca la app detrás de un proxy inverso.
// Sin esto, express-rate-limit y `req.ip` verían siempre la IP del proxy
// en vez de la IP real del usuario, rompiendo el rate limiting por IP.
// El valor 1 le dice a Express que confíe en un solo "hop" de proxy
// (el de Render), tomando la IP real desde X-Forwarded-For.
app.set("trust proxy", 1);

// Cabeceras de seguridad (mitiga XSS, clickjacking, sniffing, etc).
app.use(helmet());

// Lista blanca de orígenes permitidos. En producción, CORS_ORIGIN debe ser
// la URL exacta del frontend desplegado (puede ser una lista separada por
// comas para soportar staging + producción). `credentials: true` es
// obligatorio para que el navegador envíe/reciba la cookie httpOnly de sesión.
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Permite herramientas sin origin (curl, health checks) y orígenes en la lista blanca.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("No permitido por la política de CORS."));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Elimina claves con `$` o `.` de body/query/params para prevenir inyección
// de operadores NoSQL (ej: { "email": { "$ne": null } }).
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// Límite general de peticiones por IP: mitiga fuerza bruta y DoS básicos.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reports", pdfRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;