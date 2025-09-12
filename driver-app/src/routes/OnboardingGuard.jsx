// src/routes/OnboardingGuard.jsx
import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function OnboardingGuard() {
  const { driver, loading } = useAuth();

  if (loading) return null; // or spinner

  if (driver?.onboarding?.status === "approved") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
