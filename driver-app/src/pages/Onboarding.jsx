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
  Progress
} from "@chakra-ui/react";
import { useAuth } from "../hooks/useAuth";
import { Link as RouterLink } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionHStack = motion(HStack);

export default function Onboarding() {
  const { driver, loading, login } = useAuth();
  const toast = useToast();

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center" bgGradient="linear(to-br, teal.400, blue.500)">
        <Spinner size="xl" color="white" />
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
      toast({ title: "Onboarding submitted", description: "Your documents are now under review.", status: "success" });
    } catch (err) {
      toast({ title: "Submit failed", description: err.response?.data?.message || "Error", status: "error" });
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient="linear(to-br, teal.400, blue.500)"
      p={4}
    >
      <MotionBox
        p={8}
        borderRadius="lg"
        shadow="xl"
        maxW="500px"
        w="full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // Glassmorphism + Glow
        bg="rgba(255, 255, 255, 0.15)"
        backdropFilter="blur(16px) saturate(180%)"
        border="1px solid rgba(255, 255, 255, 0.3)"
        boxShadow="0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2)"
        _hover={{
          boxShadow: "0 0 25px rgba(0, 255, 255, 0.6), 0 0 50px rgba(0, 255, 255, 0.3)"
        }}
      >
        {/* Progress Bar */}
        <Box mb={6}>
          <Text fontWeight="medium" mb={2} color="white">
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
        </Box>

        <Heading size="lg" mb={4} textAlign="center" color="white">
          Onboarding
        </Heading>
        <Badge
          display="block"
          textAlign="center"
          fontSize="md"
          colorScheme={
            ob.status === "approved"
              ? "green"
              : ob.status === "rejected"
              ? "red"
              : ob.status === "under_review"
              ? "blue"
              : "yellow"
          }
          mb={6}
          as={motion.div}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {ob.status || "Not started"}
        </Badge>

        <VStack align="stretch" spacing={4}>
          {steps.map((step, idx) => (
            <MotionHStack
              key={step.label}
              justify="space-between"
              p={4}
              borderWidth="1px"
              borderRadius="md"
              borderColor="rgba(255, 255, 255, 0.3)"
              bg="rgba(255, 255, 255, 0.1)"
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 15px rgba(0, 255, 255, 0.4)"
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Text fontWeight="medium" color="white">{step.label}</Text>
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
            colorScheme="blue"
            w="full"
            as={motion.button}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(0, 255, 255, 0.6)"
            }}
            whileTap={{ scale: 0.95 }}
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
      </MotionBox>
    </Flex>
  );
}
