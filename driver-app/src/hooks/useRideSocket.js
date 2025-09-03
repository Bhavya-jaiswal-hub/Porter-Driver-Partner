// src/hooks/useRideSocket.js
import { useEffect, useRef, useCallback } from "react";
import socket from "../socket/socket";
import { useAuth } from "../hooks/useAuth";

export const useRideSocket = ({
  respondedBookingIds,
  setRideRequest,
  setRespondedBookingIds,
  locationUpdateInterval = 10000 // default: every 10 seconds
}) => {
  const isMountedRef = useRef(false);
  const locationWatchIdRef = useRef(null);
  const { driver } = useAuth();

  const driverId = driver?._id;
  const type = String(driver?.vehicleType || "").trim().toLowerCase();

  // Emit driver location to backend
  const emitLocation = useCallback(
    (coords) => {
      if (!driverId || !coords) return;
      const { latitude, longitude } = coords;
      socket.emit("driverLocation", {
        driverId,
        location: { latitude, longitude },
        vehicleType: type
      });
      console.log(`📍 Sent location for driver ${driverId}:`, latitude, longitude);
    },
    [driverId, type]
  );

  // Register driver on socket connect
  const registerDriver = useCallback(() => {
    if (!driverId) return;
    console.log(`🚗 Registered driver ${driverId} (${type})`);
  }, [driverId, type]);

  const handleNewRide = useCallback(
    (data) => {
      const { bookingId } = data || {};
      if (!bookingId || respondedBookingIds.includes(bookingId)) return;
      console.log(`📦 Driver ${driverId} got new ride:`, data);
      setRideRequest(data);
    },
    [driverId, respondedBookingIds, setRideRequest]
  );

  const handleTaken = useCallback(
    ({ bookingId }) => {
      console.warn(`⚠️ Ride ${bookingId} already taken`);
      if (bookingId) {
        setRespondedBookingIds((prev) => [...prev, bookingId]);
        setRideRequest((prev) => (prev?.bookingId === bookingId ? null : prev));
      }
    },
    [setRespondedBookingIds, setRideRequest]
  );

  const handleNoDrivers = useCallback(() => {
    console.warn(`🚫 Driver ${driverId}: No drivers available`);
  }, [driverId]);

  const handleUnknownEvent = useCallback(
    (event, payload) => {
      const knownEvents = [
        "new-ride-request",
        "rideAlreadyTaken",
        "noDriversAvailable",
        "connect"
      ];
      if (!knownEvents.includes(event)) {
        console.log(`📡 [${driverId}] Unknown event: ${event}`, payload);
      }
    },
    [driverId]
  );

  useEffect(() => {
    // ✅ Only connect if driver is approved
    if (!driver || driver?.onboarding?.status !== "approved") {
      console.warn("Driver not approved — socket connection skipped.");
      return;
    }

    if (!socket.connected) socket.connect();

    socket.on("connect", registerDriver);
    socket.on("new-ride-request", handleNewRide);
    socket.on("rideAlreadyTaken", handleTaken);
    socket.on("noDriversAvailable", handleNoDrivers);
    socket.onAny(handleUnknownEvent);

    // 🌍 Start watching location
    if (navigator.geolocation) {
      locationWatchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          emitLocation(pos.coords);
        },
        (err) => {
          console.error("❌ Error getting location:", err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    } else {
      console.warn("Geolocation not supported in this browser.");
    }

    isMountedRef.current = true;

    return () => {
      socket.off("connect", registerDriver);
      socket.off("new-ride-request", handleNewRide);
      socket.off("rideAlreadyTaken", handleTaken);
      socket.off("noDriversAvailable", handleNoDrivers);
      socket.offAny(handleUnknownEvent);

      // 🛑 Stop watching location
      if (locationWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(locationWatchIdRef.current);
      }

      isMountedRef.current = false;
    };
  }, [
    driver,
    registerDriver,
    handleNewRide,
    handleTaken,
    handleNoDrivers,
    handleUnknownEvent,
    emitLocation
  ]);
};
