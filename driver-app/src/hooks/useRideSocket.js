// src/hooks/useRideSocket.js
import { useEffect, useRef, useCallback } from "react";
import socket from "../socket/socket";
import { useAuth } from "../hooks/useAuth";

export const useRideSocket = ({
  respondedBookingIds,
  setRideRequest,
  setRespondedBookingIds,
  setRideStatus,
  setActiveRide, // 👈 keep active ride in sync
  locationUpdateInterval = 10000,
}) => {
  const isMountedRef = useRef(false);
  const locationWatchIdRef = useRef(null);
  const { driver, loading } = useAuth();

  const driverId = driver?._id;
  const type = String(driver?.vehicleType || "").trim().toLowerCase();

  // ✅ Emit driver location
  const emitLocation = useCallback(
    (coords) => {
      if (!driverId || !coords) return;
      const { latitude, longitude } = coords;
      socket.emit("driverLocation", {
        driverId,
        location: { lat: latitude, lng: longitude },
        vehicleType: type,
      });
      console.log(`📍 Sent location for driver ${driverId}:`, latitude, longitude);
    },
    [driverId, type]
  );

  // ✅ Register driver
  const registerDriver = useCallback(() => {
    if (!driverId) return;
    console.log(`🚗 Registered driver ${driverId} (${type})`);
  }, [driverId, type]);

  // ✅ Handle new ride request
  const handleNewRide = useCallback(
    (data) => {
      const { bookingId } = data || {};
      if (!bookingId || respondedBookingIds.includes(bookingId)) return;
      console.log(`📦 Driver ${driverId} got new ride:`, data);
      setRideRequest(data);
    },
    [driverId, respondedBookingIds, setRideRequest]
  );

  // ✅ Handle ride already taken
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

  // ✅ Handle no drivers found
  const handleNoDrivers = useCallback(() => {
    console.warn(`🚫 Driver ${driverId}: No drivers found for this request`);
  }, [driverId]);

  // ✅ Handle ride confirmed
  const handleRideConfirmed = useCallback(
    (ride) => {
      console.log("✅ Ride confirmed:", ride);
      setRideStatus?.("Ride accepted");
      setActiveRide?.(ride); // full ride object from backend
      setRideRequest(null);
    },
    [setRideStatus, setActiveRide, setRideRequest]
  );

  // ✅ Handle pickup started
  const handlePickupStarted = useCallback(
    (ride) => {
      console.log("🚕 Pickup started:", ride);
      setRideStatus?.("On the way to pickup");
      setActiveRide?.(ride);
    },
    [setRideStatus, setActiveRide]
  );

  // ✅ Handle pickup complete
  const handlePickupComplete = useCallback(
    (ride) => {
      console.log("✅ Pickup complete:", ride);
      setRideStatus?.("Pickup complete");
      setActiveRide?.(ride);
    },
    [setRideStatus, setActiveRide]
  );

  // ✅ Handle ride started
  const handleRideStarted = useCallback(
    (ride) => {
      console.log("🚗 Ride started:", ride);
      setRideStatus?.("Ride in progress");
      setActiveRide?.(ride);
    },
    [setRideStatus, setActiveRide]
  );

  // ✅ Handle ride completed
  const handleRideCompleted = useCallback(
    (ride) => {
      console.log("🏁 Ride completed:", ride);
      setRideStatus?.("Ride completed");
      setActiveRide?.(null);
      setRideRequest(null);
    },
    [setRideStatus, setActiveRide, setRideRequest]
  );

  // ✅ Handle server error
  const handleServerError = useCallback(({ message }) => {
    console.error("❌ Server error:", message);
  }, []);

  // ✅ Log unknown events
  const handleUnknownEvent = useCallback(
    (event, payload) => {
      const knownEvents = [
        "new-ride-request",
        "rideAlreadyTaken",
        "no-drivers-found",
        "ride-confirmed",
        "pickup-started",
        "pickup-complete-update",
        "ride-started-update",
        "ride-completed-update",
        "serverError",
        "connect",
      ];
      if (!knownEvents.includes(event)) {
        console.log(`📡 [${driverId}] Unknown event: ${event}`, payload);
      }
    },
    [driverId]
  );

  // ✅ Register listeners
  useEffect(() => {
    if (loading) return;

    const approved =
      driver?.onboarding?.status === "approved" || driver?.status === "approved";
    if (!approved) {
      console.warn("Driver not approved — socket connection skipped.");
      return;
    }

    if (!socket.connected) socket.connect();

    socket.on("connect", registerDriver);
    socket.on("new-ride-request", handleNewRide);
    socket.on("rideAlreadyTaken", handleTaken);
    socket.on("no-drivers-found", handleNoDrivers);
    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("pickup-started", handlePickupStarted);
    socket.on("pickup-complete-update", handlePickupComplete);
    socket.on("ride-started-update", handleRideStarted);
    socket.on("ride-completed-update", handleRideCompleted);
    socket.on("serverError", handleServerError);
    socket.onAny(handleUnknownEvent);

    // 🌍 Start watching location
    if (navigator.geolocation) {
      locationWatchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => emitLocation(pos.coords),
        (err) => console.error("❌ Error getting location:", err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );
    }

    isMountedRef.current = true;

    return () => {
      socket.off("connect", registerDriver);
      socket.off("new-ride-request", handleNewRide);
      socket.off("rideAlreadyTaken", handleTaken);
      socket.off("no-drivers-found", handleNoDrivers);
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("pickup-started", handlePickupStarted);
      socket.off("pickup-complete-update", handlePickupComplete);
      socket.off("ride-started-update", handleRideStarted);
      socket.off("ride-completed-update", handleRideCompleted);
      socket.off("serverError", handleServerError);
      socket.offAny(handleUnknownEvent);

      if (locationWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(locationWatchIdRef.current);
      }
      isMountedRef.current = false;
    };
  }, [
    driver,
    loading,
    registerDriver,
    handleNewRide,
    handleTaken,
    handleNoDrivers,
    handleRideConfirmed,
    handlePickupStarted,
    handlePickupComplete,
    handleRideStarted,
    handleRideCompleted,
    handleServerError,
    handleUnknownEvent,
    emitLocation,
  ]);
};
