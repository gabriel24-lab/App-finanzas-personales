const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
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

// SEC-04: trust proxy condicional.
// En producción (Render), hay exactamente un hop de proxy inverso, así que
// Express toma la IP real del usuario desde X-Forwarded-For.
// En desarrollo local no hay proxy: usamos la IP directa para que el rate
// limiter no vea siempre 127.0.0.1 ni acepte X-Forwarded-For manipulados.
app.set("trust proxy", process.env.NODE_ENV === "production" ? 1 : 0);

// Cabeceras de seguridad (mitiga XSS, clickjacking, sniffing, etc.).
// SEC-10: CSP explícita en lugar de la genérica por defecto de Helmet.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc:  ["'self'"],
        styleSrc:   ["'self'", "'unsafe-inline'"],
        imgSrc:     ["'self'", "data:"],
        connectSrc: ["'self'"].concat(
          (process.env.CORS_ORIGIN || "").split(",").map((o) => o.trim()).filter(Boolean)
        ),
        fontSrc:    ["'self'", "https://fonts.gstatic.com"],
        objectSrc:  ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

// Lista blanca de orígenes permitidos. En producción, CORS_ORIGIN debe ser
// la URL exacta del frontend desplegado (puede ser una lista separada por
// comas para soportar staging + producción).
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
    // La sesión ahora viaja en el header Authorization (JWT en localStorage
    // del frontend), no en una cookie, así que `credentials: true` ya no es
    // estrictamente necesario. Se deja en true de todas formas por si en el
    // futuro se agrega algún flujo que sí dependa de cookies/credenciales.
    credentials: true,
  })
);

// SEC-06: límite de tamaño del body para prevenir ataques de agotamiento de
// memoria (OOM) con payloads JSON enormes. 16 KB es más que suficiente para
// cualquier request legítima de esta API.
app.use(express.json({ limit: "16kb" }));

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

// SEC-13: Health check sin metadata de tecnología.
// Solo confirma que el proceso está activo (útil para Render/uptime monitors).
app.get("/api/health", (req, res) => {
  res.status(200).send("ok");
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