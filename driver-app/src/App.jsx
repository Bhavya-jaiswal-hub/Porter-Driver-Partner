import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DriverDashboard from "./features/dashboard/DriverDashboard";
import testDrivers from "./testdrivers";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./hooks/useAuth";
import PersonalInfo from "./pages/onboarding/PersonalInfo";
import VehicleInfo from "./pages/onboarding/VehicleInfo";
import DocumentsUpload from "./pages/onboarding/DocumentsUpload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import TestLottie from "./pages/TestLottie";
import OnboardingGuard from "./routes/OnboardingGuard"
import DashboardGuard from "./routes/DashboardGuard";
import RedirectIfAuth from "./components/RedirectIfAuth";
import TestLottieInline from "./pages/TestLottieInline";
import Dashboard from "./pages/Dashboard";

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
  path="/login"
  element={
    <RedirectIfAuth>
      <Login />
    </RedirectIfAuth>
  }
/>
       <Route
  path="/register"
  element={
    <RedirectIfAuth>
      <Register />
    </RedirectIfAuth>
  }
/>
<Route path="/dashboard" element={<ErrorBoundary>
              <Dashboard />
            </ErrorBoundary>} />

        
<Route path="/test-lottie" element={<TestLottie />} />
<Route path="/test-lottie-inline" element={<TestLottieInline />} />
<Route element={<OnboardingGuard />}>
  <Route path="/onboarding" element={<Onboarding />} />
   <Route path="/onboarding/personal" element={<PersonalInfo />} />
  <Route path="/onboarding/vehicle" element={<VehicleInfo />} />
  <Route path="/onboarding/documents" element={<DocumentsUpload />} />
</Route>
         
         <Route element={<DashboardGuard />}> <Route
          path="/dashboard"
          element={
            <ErrorBoundary>
              <RequireApproval>
                <DriverDashboardWrapper />
              </RequireApproval>
            </ErrorBoundary>
          }
        /></Route>
       
        {/* Placeholder onboarding route */}
      <Route
  path="/onboarding"
  element={
    <ErrorBoundary>
      <Onboarding />
    </ErrorBoundary>
  }
/>


      </Routes>
    </BrowserRouter>
  );
}
