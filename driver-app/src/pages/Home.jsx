// src/pages/Home.jsx
// src/pages/Home.jsx
import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Stack,
  Icon,
  Container,
  Divider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "../components/Navbar"; // now using the updated light Navbar
import { motion } from "framer-motion";
import {
  FiZap,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionRouterLink = motion(RouterLink);

// Simple “Delivery Fleet” SVG illustration
const DeliveryFleetIllustration = () => {
  const Msvg = motion.svg;
  const Mg = motion.g;
  const Mrect = motion.rect;
  const Mcircle = motion.circle;

  return (
    <Msvg
      viewBox="0 0 520 320"
      width="100%"
      height="100%"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#C7E6FF" />
        </linearGradient>
      </defs>
      <Mrect x="0" y="0" width="520" height="320" rx="18" fill="url(#bgGrad)" />

      {/* Packages */}
      <Mg initial={{ y: 0 }} animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}>
        <Mrect x="60" y="70" width="70" height="60" rx="8" fill="#F2B35E" />
        <Mrect x="140" y="60" width="56" height="48" rx="8" fill="#F2B35E" opacity="0.85" />
        <Mrect x="110" y="120" width="60" height="52" rx="8" fill="#F2B35E" opacity="0.9" />
      </Mg>

      {/* Vans */}
      <Mg
        initial={{ x: -220 }}
        animate={{ x: 540 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <Mrect x="40" y="200" width="150" height="60" rx="12" fill="#19A7F2" />
        <Mrect x="30" y="210" width="60" height="50" rx="10" fill="#1597E5" />
        <Mrect x="38" y="218" width="44" height="20" rx="4" fill="#CFEFFF" />
        <Mcircle cx="70" cy="266" r="14" fill="#111" animate={{ rotate: 360 }} transform="rotate(0 70 266)" transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} />
        <circle cx="70" cy="266" r="6" fill="#666" />
        <Mcircle cx="160" cy="266" r="14" fill="#111" animate={{ rotate: 360 }} transform="rotate(0 160 266)" transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} />
        <circle cx="160" cy="266" r="6" fill="#666" />
      </Mg>

      {/* Road */}
      <rect x="0" y="280" width="520" height="6" fill="#0F172A" opacity="0.15" />
    </Msvg>
  );
};

export default function Home() {
  return (
    <Box minH="100vh" bg="white">
      {/* Updated Navbar */}
      <Navbar />

      {/* Hero */}
      <Container maxW="7xl" px={{ base: 4, md: 8 }} py={{ base: 10, md: 16 }}>
        <MotionFlex
          direction={{ base: "column", lg: "row" }}
          align="center"
          justify="space-between"
          gap={{ base: 10, md: 12 }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left: Headline + subhead + CTAs */}
          <Box flex="1" maxW={{ lg: "600px" }}>
            <Heading
              as="h1"
              size={{ base: "xl", md: "2xl" }}
              lineHeight="1.15"
              mb={4}
              color="gray.800"
            >
              Deliver Faster. Earn Smarter.
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" mb={8}>
              Join thousands of drivers who trust our platform for speed, safety, and high earnings.
              Experience the future of delivery services with cutting‑edge technology and driver‑centric solutions.
            </Text>

            <Flex gap={4} wrap="wrap">
              <Button
                as={MotionRouterLink}
                to="/register"
                colorScheme="teal"
                size="lg"
                px={8}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started
              </Button>
              <Button
                as={MotionRouterLink}
                to="/onboarding"
                variant="outline"
                colorScheme="teal"
                size="lg"
                px={8}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Track My Onboarding
              </Button>
            </Flex>
          </Box>

          {/* Right: Illustration */}
          <Box
            flex="1"
            maxW={{ base: "100%", md: "520px" }}
            w="full"
            minH="320px"
            rounded="lg"
            overflow="hidden"
            boxShadow="lg"
          >
            <DeliveryFleetIllustration />
          </Box>
        </MotionFlex>
      </Container>

      {/* Features */}
      <Container maxW="7xl" px={{ base: 4, md: 8 }} pb={{ base: 12, md: 16 }}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }}>
          <FeatureCard
            icon={FiZap}
            title="Lightning Fast"
            desc="Optimized routes lead to faster deliveries and more completed orders. Maximize your time and earnings."
          />
          <FeatureCard
            icon={FiShield}
            title="Safety First"
            desc="Advanced navigation, real‑time alerts, and driver support help ensure your safety on every trip."
          />
          <FeatureCard
            icon={FiTrendingUp}
            title="Higher Earnings"
            desc="More deliveries mean more income. Incentives and bonuses boost your revenue."
          />
        </SimpleGrid>
      </Container>

      <Divider />

      {/* Stats */}
      <Container maxW="7xl" px={{ base: 4, md: 8 }} py={{ base: 12, md: 16 }}>
        <Stack spacing={4} textAlign="center" mb={{ base: 8, md: 10 }}>
          <Heading size={{ base: "lg", md: "xl" }} color="gray.800">
            Join Our Growing Community
          </Heading>
          <Text color="gray.600">
            Safe, reliable, and driver‑friendly delivery platform.
          </Text>
        </Stack>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={{ base: 6, md: 10 }}>
          <StatItem value="50K+" label="Active Drivers" />
          <StatItem value="2M+" label="Completed Deliveries" />
          <StatItem value="4.9" label="Average Rating" />
          <StatItem value="$2500" label="Average Monthly Earnings" />
        </SimpleGrid>
      </Container>

      {/* Footer */}
      <Box bg="gray.50" borderTop="1px solid" borderColor="gray.200">
        <Container maxW="7xl" px={{ base: 4, md: 8 }} py={{ base: 8, md: 12 }}>
          <Stack spacing={1} textAlign="center">
            <Heading as="h3" size="md" color="gray.800">
              Delivery King
            </Heading>
            <Text color="gray.600">
              Safe, reliable, and driver‑friendly delivery platform.
            </Text>
            <Text fontSize="sm" color="gray.500" mt={2}>
              © 2023 Delivery King. All rights reserved.
            </Text>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

/* ----------------- UI Partials
/* ----------------- UI Partials ----------------- */

function FeatureCard({ icon, title, desc }) {
  return (
    <MotionBox
      p={6}
      bg="white"
      rounded="lg"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Stack spacing={3}>
        <Icon as={icon} boxSize={7} color="teal.500" />
        <Heading size="md" color="gray.800">
          {title}
        </Heading>
        <Text color="gray.600">{desc}</Text>
      </Stack>
    </MotionBox>
  );
}

function StatItem({ value, label }) {
  return (
    <Stack
      align="center"
      p={5}
      bg="white"
      rounded="lg"
      border="1px solid"
      borderColor="gray.200"
    >
      <Heading size="lg" color="gray.800">
        {value}
      </Heading>
      <Text color="gray.600">{label}</Text>
    </Stack>
  );
}
