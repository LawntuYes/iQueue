import { useState, useEffect } from "react";
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser } from "../services/auth";
import AuthContext from "./AuthContext";



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading true to wait for check
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await getCurrentUser();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        // If 401/403, just means not logged in, silent fail is fine or handle specific error
        console.log("No active session", err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginService(email, password);
      // Assuming backend returns { user: ... }
      setUser(data.user);

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
