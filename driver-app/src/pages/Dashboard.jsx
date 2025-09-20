import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  SimpleGrid,
  Button,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useRideSocket } from "../hooks/useRideSocket";
import socket from "../socket/socket";

export default function Dashboard() {
  const { driver, loading } = useAuth();
  const [rideRequests, setRideRequests] = useState([]);
  const [earnings, setEarnings] = useState({ today: 0, week: 0, completed: 0 });
  const [loadingData, setLoadingData] = useState(true);
  const [respondedBookingIds, setRespondedBookingIds] = useState([]);
  const [rideStatus, setRideStatus] = useState("");
  const [activeRide, setActiveRide] = useState(null);

  const isApproved =
    driver?.onboarding?.status === "approved" || driver?.status === "approved";

  // ✅ Socket integration
  useRideSocket({
    respondedBookingIds,
    setRideRequest: (ride) => {
      setRideRequests((prev) => [ride, ...prev]);
    },
    setRespondedBookingIds,
    setRideStatus,
    setActiveRide,
  });

  // ✅ Listen for backend ride lifecycle events
  useEffect(() => {
    if (!socket) return;

    socket.on("ride-confirmed", (ride) => {
      console.log("✅ Ride confirmed:", ride);
      setActiveRide(ride);
      setRideStatus("Ride accepted");
      setRideRequests((prev) =>
        prev.filter((r) => r.bookingId !== ride.bookingId)
      );
    });

    socket.on("pickup-started", (ride) => {
      console.log("🚕 Pickup started:", ride);
      setActiveRide(ride);
      setRideStatus("On the way to pickup");
    });

    socket.on("pickup-complete-update", (ride) => {
      console.log("✅ Pickup complete:", ride);
      setActiveRide(ride);
      setRideStatus("Pickup complete");
    });

    socket.on("ride-started-update", (ride) => {
      console.log("🚗 Ride started:", ride);
      setActiveRide(ride);
      setRideStatus("Ride in progress");
    });

    socket.on("ride-completed-update", (ride) => {
      console.log("🏁 Ride completed:", ride);
      setRideStatus("Ride completed");
      setActiveRide(null);
    });

    socket.on("serverError", ({ message }) => {
      console.error("❌ Server error:", message);
    });

    return () => {
      socket.off("ride-confirmed");
      socket.off("pickup-started");
      socket.off("pickup-complete-update");
      socket.off("ride-started-update");
      socket.off("ride-completed-update");
      socket.off("serverError");
    };
  }, []);

  // ✅ Fetch ride requests & earnings from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ridesRes = await api.get("/api/driver/rides?status=pending");
        const earningsRes = await api.get("/api/driver/earnings");

        setRideRequests(ridesRes.data || []);
        setEarnings(earningsRes.data || { today: 0, week: 0, completed: 0 });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoadingData(false);
      }
    };

    if (driver && isApproved) {
      fetchData();
    }
  }, [driver, isApproved]);

  // ✅ Accept ride
  const handleAccept = (ride) => {
    if (!driver?._id) return;
    socket.emit("acceptRide", { driverId: driver._id, bookingId: ride.bookingId });
    setRespondedBookingIds((prev) => [...prev, ride.bookingId]);
  };

  // ✅ Lifecycle event emitters
  const handleStartPickup = () => {
    if (!activeRide) return;
    socket.emit("startPickup", { driverId: driver._id, bookingId: activeRide.bookingId });
  };

  const handlePickupComplete = () => {
    if (!activeRide) return;
    socket.emit("pickupComplete", { bookingId: activeRide.bookingId });
  };

  const handleStartRide = () => {
    if (!activeRide) return;
    socket.emit("startRide", { bookingId: activeRide.bookingId });
  };

  const handleCompleteRide = () => {
    if (!activeRide) return;
    socket.emit("completeRide", { bookingId: activeRide.bookingId });
  };

  if (loading || loadingData) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="white">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }
return (
  <Box minH="100vh" bg="white">
    <Navbar />

    {/* Hero */}
    <Box
      bg="gray.50"
      py={{ base: 8, md: 12 }}
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      <Container maxW="7xl" textAlign="center">
        <Heading size={{ base: "xl", md: "2xl" }} color="gray.800" mb={2}>
          🚖 Driver Dashboard ({driver?.name || driver?.email})
        </Heading>
        <Text fontSize="md" color="gray.600">
          Here’s what's happening today
        </Text>
        {rideStatus && (
          <Text fontSize="lg" color="teal.600" mt={2}>
            📌 Status: {rideStatus}
          </Text>
        )}
      </Container>
    </Box>

    {/* Debug logs */}
    {console.log("🔎 rideRequests:", rideRequests)}
    {console.log("🔎 activeRide:", activeRide)}

    {/* Main Content */}
    <Container maxW="7xl" py={10}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        {/* Ride Requests */}
        <Box>
          <Heading size="md" mb={4} color="gray.800">
            Ride Requests
          </Heading>
          {(!rideRequests || rideRequests.length === 0) && !activeRide ? (
            <Box
              p={6}
              border="1px solid"
              borderColor="gray.200"
              rounded="md"
              textAlign="center"
              bg="white"
            >
              <Text fontSize="lg" color="gray.600">
                No new ride requests yet 🚦
              </Text>
            </Box>
          ) : (
            <>
              {rideRequests
                .filter(Boolean) // remove null/undefined rides
                .map((ride, idx) => (
                  <Box
                    key={ride?.bookingId || idx}
                    p={4}
                    mb={4}
                    border="1px solid"
                    borderColor="gray.200"
                    rounded="md"
                    bg="white"
                  >
                    <Text fontWeight="medium" color="gray.800">
                      📍{" "}
                      {ride?.pickupLocation?.address ||
                        ride?.pickupPoint?.address ||
                        ride?.pickup ||
                        "Unknown pickup"}{" "}
                      → 🏁{" "}
                      {ride?.dropLocation?.address ||
                        ride?.dropPoint?.address ||
                        ride?.drop ||
                        "Unknown drop"}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {ride?.distanceKm || ride?.distance || "?"} km • ₹
                      {ride?.fareEstimate || ride?.earnings || "?"}
                    </Text>
                    <Flex gap={2} mt={3}>
                      <Button
                        colorScheme="teal"
                        size="sm"
                        onClick={() => handleAccept(ride)}
                      >
                        Accept
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setRespondedBookingIds((prev) => [
                            ...prev,
                            ride?.bookingId,
                          ])
                        }
                      >
                        Reject
                      </Button>
                    </Flex>
                  </Box>
                ))}

              {activeRide && (
                <Box
                  p={4}
                  mb={4}
                  border="1px solid"
                  borderColor="gray.200"
                  rounded="md"
                  bg="white"
                >
                  <Text fontWeight="medium" color="gray.800">
                    🚗 Active Ride:{" "}
                    {activeRide?.pickupLocation?.address ||
                      activeRide?.pickupPoint?.address ||
                      "Unknown pickup"}{" "}
                    →{" "}
                    {activeRide?.dropLocation?.address ||
                      activeRide?.dropPoint?.address ||
                      "Unknown drop"}
                  </Text>
                  <Flex gap={2} mt={3} flexWrap="wrap">
                    {activeRide?.status === "accepted" && (
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={handleStartPickup}
                      >
                        Start Pickup
                      </Button>
                    )}
                    {activeRide?.status === "on_the_way" && (
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={handlePickupComplete}
                      >
                        Mark Pickup Complete
                      </Button>
                    )}
                    {activeRide?.status === "pickup_complete" && (
                      <Button
                        colorScheme="orange"
                        size="sm"
                        onClick={handleStartRide}
                      >
                        Start Ride
                      </Button>
                    )}
                    {activeRide?.status === "in_progress" && (
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={handleCompleteRide}
                      >
                        Complete Ride
                      </Button>
                    )}
                  </Flex>
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Earnings Summary */}
        <Box>
          <Heading size="md" mb={4} color="gray.800">
            Earnings Summary
          </Heading>
          <Stack spacing={4}>
            <SummaryCard label="Today’s Earnings" value={`₹${earnings?.today || 0}`} />
            <SummaryCard label="This Week" value={`₹${earnings?.week || 0}`} />
            <SummaryCard label="Completed Rides" value={earnings?.completed || 0} />
          </Stack>
        </Box>
      </SimpleGrid>
    </Container>
  </Box>
);


function SummaryCard({ label, value }) {
  return (
    <Box
      p={4}
      border="1px solid"
      borderColor="gray.200"
      rounded="md"
      bg="white"
      textAlign="center"
    >
      <Text fontSize="sm" color="gray.500">
        {label}
      </Text>
      <Heading size="lg" color="gray.800">
        {value}
      </Heading>
    </Box>
  );
}
}