import React, { useEffect, useState } from "react";
import socket from "../socket/socket";

export default function RideRequests() {
  const [incomingRide, setIncomingRide] = useState(null);
  const driverId = localStorage.getItem("driverId"); // once you add auth

  useEffect(() => {
    socket.on("ride-request", (rideData) => {
      console.log("📩 Ride Request Received:", rideData);
      setIncomingRide(rideData);
    });

    return () => {
      socket.off("ride-request");
    };
  }, []);

  const acceptRide = () => {
    if (!incomingRide) return;

    socket.emit("accept-ride", {
      bookingId: incomingRide.bookingId,
      driverId,
      vehicleType: incomingRide.vehicleType
    });

    setIncomingRide(null); // clear after accepting
  };

  return (
    <div className="p-6">
      {!incomingRide ? (
        <p className="text-gray-600">No ride requests yet...</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2">🚖 New Ride Request</h2>
          <p><strong>Pickup:</strong> {incomingRide.pickupLocation.address}</p>
          <p><strong>Drop:</strong> {incomingRide.dropLocation.address}</p>
          <p><strong>Fare:</strong> ₹{incomingRide.fareEstimate}</p>
          <button
            onClick={acceptRide}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded-lg"
          >
            ✅ Accept Ride
          </button>
        </div>
      )}
    </div>
  );
}
