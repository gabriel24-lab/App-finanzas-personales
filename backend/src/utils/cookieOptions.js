// Configuración centralizada de la cookie de sesión (JWT).
// httpOnly: JavaScript del navegador no puede leerla -> protege contra robo por XSS.
// secure: solo se envía sobre HTTPS (se relaja en desarrollo local sobre HTTP).
// sameSite: "strict" solo funciona si frontend y backend comparten el mismo
// dominio raíz (ej. api.tuapp.com y app.tuapp.com). Cuando están en dominios
// distintos -como Vercel y Render- la petición es "cross-site" y el
// navegador NO reenvía la cookie salvo que sameSite sea "none" (que exige
// secure: true, ya garantizado en producción por HTTPS). En local seguimos
// usando "lax" porque ahí sí es same-site (localhost) y no hace falta
// relajarlo tanto.
const isProduction = process.env.NODE_ENV === "production";

const AUTH_COOKIE_NAME = "token";

const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días, en sintonía con la expiración del JWT
};

module.exports = { AUTH_COOKIE_NAME, authCookieOptions };