// Configuración centralizada de la cookie de sesión (JWT).
// httpOnly: JavaScript del navegador no puede leerla -> protege contra robo por XSS.
// secure: solo se envía sobre HTTPS (se relaja en desarrollo local sobre HTTP).
// sameSite: "strict" evita que la cookie se envíe en peticiones cross-site,
// mitigando CSRF. Requiere que frontend y backend compartan el mismo "site"
// (mismo dominio raíz, ej. api.tuapp.com y app.tuapp.com) en producción.
const isProduction = process.env.NODE_ENV === "production";

const AUTH_COOKIE_NAME = "token";

const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días, en sintonía con la expiración del JWT
};

module.exports = { AUTH_COOKIE_NAME, authCookieOptions };
