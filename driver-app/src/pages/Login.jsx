// src/pages/Login.jsx
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/driver/auth/login", { email, password });
      login(res.data.token, res.data.driver);
      toast({ title: "Login successful", status: "success", duration: 3000 });
      navigate("/dashboard");
    } catch (err) {
      toast({
        title: "Login failed",
        description: err.response?.data?.message || "Error",
        status: "error",
      });
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
      <Box
        bg="white"
        p={8}
        rounded="lg"
        shadow="lg"
        w={{ base: "100%", sm: "400px" }}
      >
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center" color="teal.600">
            Driver Login
          </Heading>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Welcome back! Please log in to continue.
          </Text>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="teal.400"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focusBorderColor="teal.400"
            />
          </FormControl>

          <Button colorScheme="teal" onClick={handleSubmit}>
            Login
          </Button>

          {/* Toggle link */}
          <Text fontSize="sm" textAlign="center">
            Don’t have an account?{" "}
            <Button
              as={RouterLink}
              to="/register"
              variant="link"
              colorScheme="teal"
              fontWeight="bold"
            >
              Register here
            </Button>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}
