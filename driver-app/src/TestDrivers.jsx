import React from "react";
import DriverDashboard from "./features/dashboard/DriverDashboard";
import testDrivers from "./testdrivers"; // ✅ the plain object map

const TestDrivers = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const driverId = urlParams.get("id") || "driver123";
  const vehicleType = urlParams.get("type") || "truck";

  const location =
    testDrivers[driverId]?.location || testDrivers["driver123"].location;

  return (
    <DriverDashboard
      driverId={driverId}
      vehicleType={vehicleType}
      location={location}
    />
  );
};

export default TestDrivers;
  