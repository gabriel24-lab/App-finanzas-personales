import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { registerApi, loginApi, fetchMe, logoutApi } from "../api";

const AuthContext = createContext(null);

// Clave usada en localStorage para persistir el JWT entre recargas de
// página y cierres del navegador. No usamos cookies porque el frontend
// (Vercel) y el backend (Render) están en dominios distintos, y varios
// navegadores bloquean cookies cross-site por defecto sin importar su
// configuración.
const TOKEN_STORAGE_KEY = "finanzas_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_STORAGE_KEY) || null,
  );
  const [loading, setLoading] = useState(true);

  // Al cargar la app, si hay un token guardado de una sesión anterior,
  // intentamos recuperar el usuario actual con él. Si el token ya no es
  // válido (expiró, etc.), el backend responde 401 y limpiamos todo.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await fetchMe(token);
        if (!cancelled) setUser(currentUser);
      } catch {
        if (!cancelled) {
          setUser(null);
          setToken(null);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: newUser, token: newToken } = await loginApi(email, password);
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const register = useCallback(async (name, email, password, currencyCode) => {
    const { user: newUser, token: newToken } = await registerApi(
      name,
      email,
      password,
      currencyCode,
    );
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    // Best-effort: avisa al backend. No bloqueamos el logout en la UI si
    // la petición falla (ej: sin conexión).
    logoutApi().catch(() => {});
  }, []);

  const value = { user, token, loading, login, register, logout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return ctx;
}
