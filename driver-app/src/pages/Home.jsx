// src/pages/Home.jsx
import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionRouterLink = motion(RouterLink);

// 🚚 Truck Animation Component
const TruckAnimation = () => {
  const Msvg = motion.svg;
  const Mg = motion.g;
  const Mcircle = motion.circle;

  return (
    <Msvg
      width="100%"
      height="100%"
      viewBox="0 0 400 220"
      initial={{ y: 10 }}
      animate={{ y: [10, 0, 10] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Road */}
      <rect x="0" y="190" width="400" height="4" fill="white" opacity="0.5" />

      {/* Truck group moving horizontally */}
      <Mg
        initial={{ x: -220 }}
        animate={{ x: 420 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        {/* Body */}
        <rect x="60" y="90" rx="12" ry="12" width="180" height="70" fill="#19A7F2" />
        {/* Cabin */}
        <rect x="40" y="110" rx="8" ry="8" width="50" height="50" fill="#1597E5" />
        {/* Window */}
        <rect x="46" y="116" rx="4" ry="4" width="36" height="20" fill="#CFEFFF" />
        {/* Package */}
        <rect x="180" y="100" rx="6" ry="6" width="28" height="28" fill="#F2B35E" />

        {/* Wheels */}
        <Mcircle
          cx="90"
          cy="170"
          r="16"
          fill="#111"
          animate={{ rotate: 360 }}
          transform="rotate(0 90 170)"
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="90" cy="170" r="7" fill="#555" />

        <Mcircle
          cx="200"
          cy="170"
          r="16"
          fill="#111"
          animate={{ rotate: 360 }}
          transform="rotate(0 200 170)"
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="200" cy="170" r="7" fill="#555" />
      </Mg>

      {/* Clouds */}
      <Mg
        initial={{ x: 0 }}
        animate={{ x: -200 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="340" cy="50" r="14" fill="white" opacity="0.7" />
        <circle cx="352" cy="50" r="10" fill="white" opacity="0.7" />
        <circle cx="330" cy="52" r="10" fill="white" opacity="0.7" />
      </Mg>
    </Msvg>
  );
};

export default function Home() {
  return (
    <Box minH="100vh" bgGradient="linear(to-br, teal.400, blue.500)">
      <Navbar />

      <Flex
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        minH="calc(100vh - 80px)"
        px={{ base: 4, md: 10 }}
        gap={10}
      >
        {/* Left: Text + Buttons */}
        <MotionBox
          flex="1"
          bg="rgba(255, 255, 255, 0.15)"
          backdropFilter="blur(16px) saturate(180%)"
          border="1px solid rgba(255, 255, 255, 0.3)"
          boxShadow="0 0 20px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.2)"
          borderRadius="lg"
          p={{ base: 6, md: 10 }}
          textAlign={{ base: "center", md: "left" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Heading
            size={{ base: "xl", md: "2xl" }}
            mb={4}
            color="white"
            textShadow="0 0 10px rgba(0,0,0,0.3)"
          >
            Deliver Faster. Earn Smarter.
          </Heading>
          <Text
            fontSize={{ base: "md", md: "lg" }}
            color="whiteAlpha.900"
            maxW="500px"
            mb={6}
          >
            Join thousands of drivers delivering with speed, safety, and higher earnings.
          </Text>

          <Flex
            gap={4}
            flexWrap="wrap"
            justify={{ base: "center", md: "flex-start" }}
            mb={4}
          >
            <Button
              as={MotionRouterLink}
              to="/register"
              colorScheme="teal"
              size="lg"
              px={8}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </Button>
            <Button
              as={MotionRouterLink}
              to="/onboarding"
              variant="outline"
              colorScheme="whiteAlpha"
              size="lg"
              px={8}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Track My Onboarding
            </Button>
          </Flex>

          <Text fontSize="sm" color="whiteAlpha.700">
            Fast, reliable, and driver‑friendly delivery platform.
          </Text>
        </MotionBox>

        {/* Right: Inline Truck Animation */}
        <Box
          flex="1"
          maxW={{ base: "320px", md: "520px" }}
          w="full"
          minH="300px"
          overflow="visible"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <TruckAnimation />
        </Box>
      </Flex>
    </Box>
  );
}
