import React, { useEffect } from 'react';
import socket from './socket/socket';

const DriverDashboard = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("rideRequest", (data) => {
      console.log("New ride request:", data);
      // Show popup to accept/reject
    });

    return () => {
      socket.off("rideRequest");
    };
  }, []);

  return (
    <div>
      <h2>Driver Dashboard</h2>
    </div>
  );
};

export default DriverDashboard;
