// src/components/Navbar.jsx
import {
  Flex,
  Heading,
  Spacer,
  Button,
  IconButton,
  useDisclosure,
  VStack,
  Collapse,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth } from "../hooks/useAuth";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { driver, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Detect scroll position for subtle shadow
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Flex
      as="nav"
      align="center"
      p={4}
      position="sticky"
      top="0"
      zIndex="1000"
      wrap="wrap"
      transition="all 0.3s ease"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      boxShadow={scrolled ? "sm" : "none"}
    >
      {/* Brand */}
      <Heading
        as={RouterLink}
        to="/"
        size="md"
        color="teal.600"
        fontWeight="bold"
        _hover={{ textDecoration: "none", color: "teal.700" }}
      >
        Delivery King
      </Heading>

      <Spacer />

      {/* Desktop Menu */}
      <Flex gap={4} display={{ base: "none", md: "flex" }} align="center">
        {driver ? (
          <>
            <Button
              as={RouterLink}
              to="/onboarding"
              variant="ghost"
              colorScheme="teal"
            >
              Onboarding
            </Button>
            <Button
              onClick={handleLogout}
              colorScheme="teal"
              variant="solid"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              as={RouterLink}
              to="/register"
              variant="ghost"
              colorScheme="teal"
            >
              Register
            </Button>
            <Button
              as={RouterLink}
              to="/login"
              variant="ghost"
              colorScheme="teal"
            >
              Login
            </Button>
            <Button
              as={RouterLink}
              to="/onboarding"
              variant="solid"
              colorScheme="teal"
            >
              Onboarding
            </Button>
          </>
        )}
      </Flex>

      {/* Mobile Menu Button */}
      <IconButton
        display={{ base: "flex", md: "none" }}
        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        variant="ghost"
        colorScheme="teal"
        onClick={onToggle}
        aria-label="Toggle Navigation"
      />

      {/* Mobile Menu */}
      <Collapse in={isOpen} animateOpacity style={{ width: "100%" }}>
        <VStack
          align="stretch"
          spacing={2}
          mt={4}
          display={{ md: "none" }}
        >
          {driver ? (
            <>
              <Button
                as={RouterLink}
                to="/onboarding"
                variant="ghost"
                colorScheme="teal"
                onClick={onToggle}
              >
                Onboarding
              </Button>
              <Button
                onClick={() => {
                  handleLogout();
                  onToggle();
                }}
                colorScheme="teal"
                variant="solid"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/register"
                variant="ghost"
                colorScheme="teal"
                onClick={onToggle}
              >
                Register
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                colorScheme="teal"
                onClick={onToggle}
              >
                Login
              </Button>
              <Button
                as={RouterLink}
                to="/onboarding"
                variant="solid"
                colorScheme="teal"
                onClick={onToggle}
              >
                Onboarding
              </Button>
            </>
          )}
        </VStack>
      </Collapse>
    </Flex>
  );
}
