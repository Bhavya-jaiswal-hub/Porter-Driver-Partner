import React, { useEffect, useState, useRef } from 'react';
import socket from '../socket/socket';

const DriverDashboard = ({ driverId, vehicleType, location }) => {
  const [rideRequest, setRideRequest] = useState(null);
  const [respondedBookingIds, setRespondedBookingIds] = useState([]);
  const isMountedRef = useRef(false);

  const type = String(vehicleType || '').trim().toLowerCase();

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const registerDriver = () => {
      socket.emit('driverLocation', {
        driverId,
        location,
        vehicleType: type,
      });
      console.log(`🚗 Registered driver ${driverId} (${type})`);
    };

    const handleNewRide = (data) => {
      const { bookingId } = data || {};
      if (!bookingId || respondedBookingIds.includes(bookingId)) return;
      console.log(`📦 Driver ${driverId} got new ride:`, data);
      setRideRequest(data);
    };

    const handleTaken = ({ bookingId }) => {
      console.warn(`⚠️ Ride ${bookingId} already taken`);
      if (bookingId) {
        setRespondedBookingIds((prev) => [...prev, bookingId]);
        if (rideRequest?.bookingId === bookingId) setRideRequest(null);
      }
    };

    const handleNoDrivers = () => {
      console.warn(`🚫 Driver ${driverId}: No drivers available`);
    };

    const handleUnknownEvent = (event, payload) => {
      const knownEvents = ['new-ride-request', 'rideAlreadyTaken', 'noDriversAvailable', 'connect'];
      if (!knownEvents.includes(event)) {
        console.log(`📡 [${driverId}] Unknown event: ${event}`, payload);
      }
    };

    socket.on('connect', registerDriver);
    socket.on('new-ride-request', handleNewRide);
    socket.on('rideAlreadyTaken', handleTaken);
    socket.on('noDriversAvailable', handleNoDrivers);
    socket.onAny(handleUnknownEvent);

    isMountedRef.current = true;

    return () => {
      socket.off('connect', registerDriver);
      socket.off('new-ride-request', handleNewRide);
      socket.off('rideAlreadyTaken', handleTaken);
      socket.off('noDriversAvailable', handleNoDrivers);
      socket.offAny(handleUnknownEvent);
      isMountedRef.current = false;
    };
  }, [respondedBookingIds, driverId, location, type]);

  const handleAcceptRide = () => {
    if (!rideRequest) return;
    socket.emit('acceptRide', {
      driverId,
      bookingId: rideRequest.bookingId,
    });
    setRespondedBookingIds((prev) => [...prev, rideRequest.bookingId]);
    setRideRequest(null);
  };

  const handleRejectRide = () => {
    if (!rideRequest?.bookingId) return;
    setRespondedBookingIds((prev) => [...prev, rideRequest.bookingId]);
    setRideRequest(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🚖 Driver Dashboard ({driverId})</h2>

      {rideRequest ? (
        <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px', borderRadius: '8px' }}>
          <h3>🚗 New Ride Request</h3>
          <p><strong>Pickup:</strong> {rideRequest.pickupLocation?.address || '—'}</p>
          <p><strong>Drop:</strong> {rideRequest.dropLocation?.address || '—'}</p>
          <p><strong>Fare:</strong> ₹{rideRequest.fareEstimate || '—'}</p>
          <p><strong>Customer:</strong> {rideRequest.customerName || '—'} ({rideRequest.customerPhone || '—'})</p>
          <button onClick={handleAcceptRide} style={{ marginRight: '10px', background: 'green', color: 'white', padding: '10px' }}>
            ✅ Accept
          </button>
          <button onClick={handleRejectRide} style={{ background: 'red', color: 'white', padding: '10px' }}>
            ❌ Reject
          </button>
        </div>
      ) : (
        <p>No new ride requests yet 🚦</p>
      )}
    </div>
  );
};

export default DriverDashboard;
