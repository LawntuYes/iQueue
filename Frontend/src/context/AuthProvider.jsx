import { useState } from "react";
import { login as loginService, register as registerService, logout as logoutService } from "../services/auth";
import AuthContext from "./AuthContext";

const STORAGE_KEY = "iq_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      return err;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginService(email, password);
      // Assuming backend returns { user: ... }
      setUser(data.user);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user)); } catch (e) { setError("LocalStorage error", e); }
      return data;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, userType) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerService(name, email, password, userType);
      setUser(data.user);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user)); } catch (e) { setError("LocalStorage error", e); }
      return data;
    } catch (err) {
      setError(err.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
        await logoutService();
        setUser(null);
        try { localStorage.removeItem(STORAGE_KEY); } catch (e) { setError("LocalStorage error", e); }
    } catch (err) {
        console.error("Logout failed", err);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
