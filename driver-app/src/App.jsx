import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import DriverDashboard from "./components/DriverDashboard";

// ⛳ Utility to parse query params
function useQueryParams() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

// 📦 Wrapper to inject props from URL
function DriverDashboardWrapper() {
  const query = useQueryParams();

  const driverId = query.get("id") || "driver123";
  const vehicleType = query.get("type") || "truck";

  const locationMap = {
    driver123: { lat: 27.1986569, lng: 78.0059814 }, // Agra
    driver456: { lat: 27.1980, lng: 78.0050 },       // Agra (Bike)
    driver789: { lat: 28.6139, lng: 77.2090 },       // Delhi
  };

  const location = locationMap[driverId] || locationMap.driver123;

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
        <Route path="/dashboard" element={<DriverDashboardWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}
