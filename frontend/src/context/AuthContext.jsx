import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { registerApi, loginApi, fetchMe, logoutApi } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // La sesión vive en una cookie httpOnly que el navegador ya no expone a
  // JavaScript (protección contra robo de token vía XSS), así que al cargar
  // la app simplemente intentamos recuperar el usuario actual: si la cookie
  // es válida, el backend responde con los datos; si no, con 401.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const currentUser = await fetchMe();
        if (!cancelled) setUser(currentUser);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: newUser } = await loginApi(email, password);
    setUser(newUser);
  }, []);

  const register = useCallback(async (name, email, password, currencyCode) => {
    const { user: newUser } = await registerApi(name, email, password, currencyCode);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // Best-effort: limpia la cookie httpOnly en el servidor. No bloqueamos
    // el logout en la UI si la petición falla (ej: sin conexión).
    logoutApi().catch(() => {});
  }, []);

  const value = { user, loading, login, register, logout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  return ctx;
}
