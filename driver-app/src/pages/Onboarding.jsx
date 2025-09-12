import {
  Box,
  Heading,
  Text,
  VStack,
  Badge,
  Button,
  HStack,
  useToast,
  Spinner,
  Flex,
  Progress,
  Container,
  Divider
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const MotionHStack = motion(HStack);

export default function Onboarding() {
  const { driver, loading, login } = useAuth();
  const toast = useToast();

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg="white">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  if (!driver) return <Text>No driver data found</Text>;

  const ob = driver.onboarding || {};

  const steps = [
    { label: "Personal Info", completed: ob.personal?.completed, link: "/onboarding/personal" },
    { label: "Vehicle Info", completed: ob.vehicle?.completed, link: "/onboarding/vehicle" },
    { label: "Documents", completed: ob.documentsUploaded, link: "/onboarding/documents" }
  ];

  const completedSteps = steps.filter((s) => s.completed).length;
  const progressPercent = (completedSteps / steps.length) * 100;
  const allComplete = ob.personal?.completed && ob.vehicle?.completed && ob.documentsUploaded;

  const handleSubmit = async () => {
    try {
      await api.post("/api/driver/onboarding/submit", { status: "under_review" });
      const meRes = await api.get("/api/driver/auth/me");
      login(localStorage.getItem("driverToken"), meRes.data);
      toast({
        title: "Onboarding submitted",
        description: "Your documents are now under review.",
        status: "success"
      });
    } catch (err) {
      toast({
        title: "Submit failed",
        description: err.response?.data?.message || "Error",
        status: "error"
      });
    }
  };

  return (
    <Box minH="100vh" bg="white">
      <Navbar />

      {/* Hero */}
      <Box bg="gray.50" py={{ base: 8, md: 12 }} borderBottom="1px solid" borderColor="gray.200">
        <Container maxW="7xl" textAlign="center">
          <Heading size={{ base: "xl", md: "2xl" }} color="gray.800" mb={2}>
            Onboarding
          </Heading>
          <Text fontSize="md" color="gray.600" textTransform="uppercase" fontWeight="semibold">
            {ob.status || "Not started"}
          </Text>
        </Container>
      </Box>

      {/* Progress */}
      <Container maxW="4xl" py={8}>
        <Text fontWeight="medium" mb={2} color="gray.700">
          Progress: {completedSteps} / {steps.length} steps completed
        </Text>
        <Progress
          value={progressPercent}
          size="sm"
          colorScheme="teal"
          borderRadius="md"
          hasStripe
          isAnimated
        />
      </Container>

      <Divider />

      {/* Steps */}
      <Container maxW="4xl" py={8}>
        <VStack align="stretch" spacing={4}>
          {steps.map((step, idx) => (
            <MotionHStack
              key={step.label}
              justify="space-between"
              p={4}
              borderWidth="1px"
              borderRadius="md"
              borderColor="gray.200"
              bg="white"
              whileHover={{
                scale: 1.02,
                boxShadow: "md"
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Text fontWeight="medium" color="gray.800">
                {step.label}
              </Text>
              {step.completed ? (
                <Badge colorScheme="green">Complete</Badge>
              ) : (
                <Button
                  as={RouterLink}
                  to={step.link}
                  size="sm"
                  colorScheme="teal"
                >
                  Complete Now
                </Button>
              )}
            </MotionHStack>
          ))}
        </VStack>

        {allComplete && ob.status !== "under_review" && ob.status !== "approved" && (
          <Button
            mt={6}
            colorScheme="teal"
            w="full"
            onClick={handleSubmit}
          >
            Submit for Review
          </Button>
        )}

        {ob.status === "under_review" && (
          <Button mt={6} colorScheme="blue" w="full" isDisabled>
            Under Review by Admin
          </Button>
        )}
      </Container>
    </Box>
  );
}
