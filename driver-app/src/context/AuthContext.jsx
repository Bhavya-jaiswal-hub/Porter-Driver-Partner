import { createContext, useState, useEffect } from "react";
import api from "../services/api"; // Axios instance with baseURL + token interceptor

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  // Called after successful login
  const login = async (token, driverData = null) => {
    localStorage.setItem("driverToken", token);

    if (driverData) {
      // If driver data is already provided, just set it
      setDriver(driverData);
    } else {
      try {
        // Otherwise, fetch it from /me
        const res = await api.get("/api/driver/auth/me");
        setDriver(res.data);
      } catch (err) {
        console.error("Failed to fetch driver after login:", err);
        localStorage.removeItem("driverToken");
        setDriver(null);
      }
    }
  };

  // Called when logging out
  const logout = () => {
    localStorage.removeItem("driverToken");
    setDriver(null);
  };

  // Restore session on page load
  useEffect(() => {
    const token = localStorage.getItem("driverToken");
    if (token) {
      api
        .get("/api/driver/auth/me")
        .then((res) => setDriver(res.data))
        .catch(() => {
          localStorage.removeItem("driverToken");
          setDriver(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ driver, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
