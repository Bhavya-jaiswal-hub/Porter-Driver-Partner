// src/pages/Onboarding.jsx
import { Box, Heading, Text, VStack, Link } from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { useEffect, useState } from "react";

export default function Onboarding() {
  const { driver, loading } = useAuth();
  const [onboarding, setOnboarding] = useState(driver?.onboarding || null);

  // Optional: fetch fresh data in case driver was updated
  useEffect(() => {
    if (!driver) return;
    api.get("/api/driver/auth/me").then((res) => {
      setOnboarding(res.data.onboarding);
    });
  }, [driver]);

  if (loading) return <Text>Loading...</Text>;
  if (!onboarding) return <Text>No onboarding data found.</Text>;

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        Onboarding Status: {onboarding.status}
      </Heading>

      <VStack align="start" spacing={4}>
        <Box>
          <Text fontWeight="bold">Personal Info</Text>
          <Text>Name: {onboarding.personal?.name}</Text>
          <Text>Phone: {onboarding.personal?.phone}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold">Vehicle Info</Text>
          <Text>Type: {onboarding.vehicle?.type}</Text>
          <Text>Number: {onboarding.vehicle?.number}</Text>
        </Box>

        <Box>
          <Text fontWeight="bold">Documents</Text>
          {Object.entries(onboarding.documents || {}).map(([key, doc]) => (
            <Link
              key={key}
              href={doc.url}
              target="_blank"
              color="teal.500"
            >
              {key.toUpperCase()} — {doc.name}
            </Link>
          ))}
        </Box>
      </VStack>
    </Box>
  );
}
