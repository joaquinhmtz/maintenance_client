import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import authenticationService from "./../src/services/authentication";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await authenticationService.verifySession();
        setUser(res?.data?.user ?? null);
        if (res && res.data && res.data.user && window.location.href.endsWith("/")) navigate("/dashboard");
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await authenticationService.login(email, password);
      setUser(res?.data?.user ?? null);
      return res;
    } catch (error) {
      console.error("Error al iniciar sesión: ", error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authenticationService.logout();
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}