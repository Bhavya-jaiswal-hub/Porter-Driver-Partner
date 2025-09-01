import { useEffect, useRef } from 'react';
import socket from '../socket/socket';
import { useAuth } from '../context/AuthContext';

export const useRideSocket = ({
  driverId,
  location,
  vehicleType,
  respondedBookingIds,
  setRideRequest,
  setRespondedBookingIds
}) => {
  const isMountedRef = useRef(false);
  const type = String(vehicleType || '').trim().toLowerCase();
  const { driver } = useAuth();

  useEffect(() => {
    // ✅ Only connect if driver is approved
    if (!driver || driver?.onboarding?.status !== 'approved') {
      console.warn('Driver not approved — socket connection skipped.');
      return;
    }

    if (!socket.connected) socket.connect();

    const registerDriver = () => {
      socket.emit('driverLocation', { driverId, location, vehicleType: type });
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
        setRideRequest((prev) => (prev?.bookingId === bookingId ? null : prev));
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
  }, [respondedBookingIds, driverId, location, type, driver]);
};
