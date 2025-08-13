import React, { useState } from 'react';
import { useRideSocket } from '../../hooks/useRideSocket';
import RideRequestCard from '../ride/RideRequestCard';
import { acceptRide, rejectRide } from '../ride/rideUtils';

const DriverDashboard = ({ driverId, vehicleType, location }) => {
  const [rideRequest, setRideRequest] = useState(null);
  const [respondedBookingIds, setRespondedBookingIds] = useState([]);

  useRideSocket({ driverId, location, vehicleType, respondedBookingIds, setRideRequest, setRespondedBookingIds });

  const handleAccept = () => {
    if (!rideRequest) return;
    acceptRide(driverId, rideRequest.bookingId, setRespondedBookingIds, () => setRideRequest(null));
  };

  const handleReject = () => {
    if (!rideRequest?.bookingId) return;
    rejectRide(rideRequest.bookingId, setRespondedBookingIds, () => setRideRequest(null));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🚖 Driver Dashboard ({driverId})</h2>
      <RideRequestCard rideRequest={rideRequest} onAccept={handleAccept} onReject={handleReject} />
    </div>
  );
};

export default DriverDashboard;
