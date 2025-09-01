import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DriverDashboard from "./features/dashboard/DriverDashboard";
import testDrivers from "./testdrivers";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./context/AuthContext";

// Utility to parse query params
function useQueryParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

// Wrapper to inject props from URL
function DriverDashboardWrapper() {
  const query = useQueryParams();

  const driverId = query.get("id") || "driver123";
  const vehicleType = query.get("type") || "truck";

  const location =
    testDrivers[driverId]?.location || testDrivers["driver123"].location;

  return (
    <DriverDashboard
      driverId={driverId}
      vehicleType={vehicleType}
      location={location}
    />
  );
}

// Route guard for approved drivers
function RequireApproval({ children }) {
  const { driver, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!driver) {
    return <Navigate to="/" replace />;
  }

  if (driver?.onboarding?.status !== "approved") {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ErrorBoundary>
              <RequireApproval>
                <DriverDashboardWrapper />
              </RequireApproval>
            </ErrorBoundary>
          }
        />
        {/* Placeholder onboarding route */}
        <Route path="/onboarding" element={<div>Onboarding Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}
