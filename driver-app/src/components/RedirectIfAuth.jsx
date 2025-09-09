// src/components/RedirectIfAuth.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RedirectIfAuth({ children }) {
  const { driver, loading } = useAuth();

  if (loading) return null; // or a spinner

  if (driver) {
    // Already logged in → always send to home
    return <Navigate to="/" replace />;
  }

  return children;
}
