import React, { useEffect, useState } from 'react';
import socket from "../socket/socket";

const DriverDashboard = () => {
  const [rideRequest, setRideRequest] = useState(null);

  useEffect(() => {
    // Connect to server
    socket.on("connect", () => {
      console.log("✅ Connected to server:", socket.id);

      // 1️⃣ Send driver registration with location + vehicleType
      // In real app, get driverId, vehicleType from auth/user profile
      socket.emit("driverLocation", {
        driverId: "DRIVER123", 
          location: { lat: 27.1986569, lng: 78.0059814 }, // replace with GPS
        vehicleType: "Truck" // change based on driver selection
      });
    });

    // 2️⃣ Listen for incoming ride requests from backend
    socket.on("newRideRequest", (data) => {
      console.log("📦 New ride request:", data);
      setRideRequest(data);
    });

    // 3️⃣ Handle ride already taken
    socket.on("rideAlreadyTaken", ({ bookingId }) => {
      console.warn(`⚠️ Ride ${bookingId} already taken by another driver`);
      setRideRequest(null);
    });

    // 4️⃣ Handle no drivers available (if server sends this by mistake to driver)
    socket.on("noDriversAvailable", () => {
      console.warn("🚫 No drivers available for this request");
    });

    return () => {
      socket.off("connect");
      socket.off("newRideRequest");
      socket.off("rideAlreadyTaken");
      socket.off("noDriversAvailable");
    };
  }, []);

  // Accept ride
  const handleAcceptRide = () => {
    if (!rideRequest) return;
    socket.emit("acceptRide", {
      driverId: "DRIVER123",
      bookingId: rideRequest.bookingId
    });
    setRideRequest(null);
  };

  // Reject ride
  const handleRejectRide = () => {
    setRideRequest(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Driver Dashboard</h2>

      {rideRequest ? (
        <div style={{ border: "1px solid #ccc", padding: "15px", marginTop: "20px" }}>
          <h3>🚗 New Ride Request</h3>
          <p><strong>Pickup:</strong> {rideRequest.pickupLocation?.address}</p>
          <p><strong>Drop:</strong> {rideRequest.dropLocation?.address}</p>
          <p><strong>Fare:</strong> ₹{rideRequest.fareEstimate}</p>
          <p><strong>Customer:</strong> {rideRequest.customerName} ({rideRequest.customerPhone})</p>
          <button onClick={handleAcceptRide} style={{ marginRight: "10px", background: "green", color: "white", padding: "10px" }}>✅ Accept</button>
          <button onClick={handleRejectRide} style={{ background: "red", color: "white", padding: "10px" }}>❌ Reject</button>
        </div>
      ) : (
        <p>No new ride requests</p>
      )}
    </div>
  );
};

export default DriverDashboard;
