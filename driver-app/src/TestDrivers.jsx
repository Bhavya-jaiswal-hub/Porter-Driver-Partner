import React from 'react';
import DriverDashboard from './components/Driverdashboard';

const TestDrivers = () => {
  // Change driver data based on browser tab
  const urlParams = new URLSearchParams(window.location.search);
  const driverId = urlParams.get('id') || 'driver123';
  const vehicleType = urlParams.get('type') || 'truck';

  // Set location based on driver ID
  const locations = {
    driver123: { lat: 27.1986569, lng: 78.0059814 }, // Agra
    driver456: { lat: 27.1980, lng: 78.0050 }, // Agra (Bike)
    driver789: { lat: 28.6139, lng: 77.2090 }, // Delhi
  };

  const location = locations[driverId] || locations.driver123;

  return (
    <DriverDashboard
      driverId={driverId}
      vehicleType={vehicleType}
      location={location}
    />
  );
};

export default TestDrivers;
