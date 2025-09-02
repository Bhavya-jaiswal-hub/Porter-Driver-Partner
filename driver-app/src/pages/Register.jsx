// src/pages/Register.jsx
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const toast = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/driver/auth/register", {
        name,
        email,
        password,
        vehicleType,
      });
      login(res.data.token, res.data.driver);
      toast({ title: "Registration successful", status: "success", duration: 3000 });
      navigate("/onboarding");
    } catch (err) {
      toast({
        title: "Registration failed",
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
      bgGradient="linear(to-br, purple.400, pink.500)"
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
          <Heading size="lg" textAlign="center" color="purple.600">
            Driver Registration
          </Heading>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Create your account to start receiving ride requests.
          </Text>

          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              focusBorderColor="purple.400"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="purple.400"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focusBorderColor="purple.400"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Vehicle Type</FormLabel>
            <Select
              placeholder="Select vehicle type"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              focusBorderColor="purple.400"
            >
              <option value="truck">Truck</option>
              <option value="bike">Bike</option>
              <option value="van">Van</option>
            </Select>
          </FormControl>

          <Button colorScheme="purple" onClick={handleSubmit}>
            Register
          </Button>

          {/* Toggle link */}
          <Text fontSize="sm" textAlign="center">
            Already have an account?{" "}
            <Button
              as={RouterLink}
              to="/login"
              variant="link"
              colorScheme="purple"
              fontWeight="bold"
            >
              Login here
            </Button>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
}
