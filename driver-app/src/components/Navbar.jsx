// src/components/Navbar.jsx
import {
  Flex,
  Heading,
  Spacer,
  Button,
  IconButton,
  useDisclosure,
  VStack,
  Collapse
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

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run on mount
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
      bg={
        scrolled
          ? "rgba(255, 255, 255, 0.25)"
          : "rgba(255, 255, 255, 0.15)"
      }
      backdropFilter="blur(12px) saturate(180%)"
      borderBottom="1px solid rgba(255, 255, 255, 0.2)"
      boxShadow={
        scrolled
          ? "0 0 25px rgba(0, 255, 255, 0.6)"
          : "0 0 15px rgba(0, 255, 255, 0.4)"
      }
    >
      {/* Brand */}
      <Heading
        as={RouterLink}
        to="/"
        size="md"
        color="white"
        _hover={{ textDecoration: "none", color: "teal.100" }}
      >
        Delivery King
      </Heading>

      <Spacer />

      {/* Desktop Menu */}
      <Flex gap={4} display={{ base: "none", md: "flex" }}>
        {driver ? (
          <>
            <Button
              as={RouterLink}
              to="/onboarding"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              Onboarding
            </Button>
            <Button
              onClick={handleLogout}
              colorScheme="green"
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
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
            >
              Register
            </Button>
            <Button
              as={RouterLink}
              to="/login"
              variant="ghost"
              color="white"
              _hover={{ bg: "whiteAlpha.200" }}
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
        color="white"
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
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={onToggle}
              >
                Onboarding
              </Button>
              <Button
                onClick={() => {
                  handleLogout();
                  onToggle();
                }}
                colorScheme="green"
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
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={onToggle}
              >
                Register
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                variant="ghost"
                color="white"
                _hover={{ bg: "whiteAlpha.200" }}
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
