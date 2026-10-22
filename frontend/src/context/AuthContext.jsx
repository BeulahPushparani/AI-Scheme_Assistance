import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/auth.api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- On mount: restore session from localStorage, then verify with /me ----
  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Optimistically set from localStorage so UI doesn't flash
      if (storedUser) {
        try { setUser(JSON.parse(storedUser)); } catch { /* ignore */ }
      }
      setToken(storedToken);

      // Verify with backend (token may be expired)
      try {
        const res = await authApi.me();
        const freshUser = res.data.data.user;
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      } catch {
        // Invalid / expired token → clear
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  // ---- Register ----
  const register = useCallback(async ({ name, email, password }) => {
    const res = await authApi.register({ name, email, password });
    const { user: newUser, token: newToken } = res.data.data;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setToken(newToken);
    return newUser;
  }, []);

  // ---- Login ----
  const login = useCallback(async ({ email, password }) => {
    const res = await authApi.login({ email, password });
    const { user: newUser, token: newToken } = res.data.data;
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setToken(newToken);
    return newUser;
  }, []);

  // ---- Logout ----
  const logout = useCallback(() => {
    // Best-effort call — JWT logout is client-side
    authApi.logout().catch(() => {});
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}