import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import DriverDashboard from "./features/dashboard/DriverDashboard";
import testDrivers from "./testdrivers"; // ✅ Plain data object with driver locations
import ErrorBoundary from "./components/ErrorBoundary";

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

  // ✅ Safe lookup with fallback
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ErrorBoundary>
              <DriverDashboardWrapper />
            </ErrorBoundary>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
