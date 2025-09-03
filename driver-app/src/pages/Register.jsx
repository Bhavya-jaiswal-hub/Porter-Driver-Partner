import {
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../layout/AuthLayout";
import api from "../services/api"; // ✅ use pre-configured Axios instance

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  // Inline validation
  const validate = () => {
    let errs = {};
    if (!name) errs.name = "Name is required";
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email format";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Min 6 characters";
    if (!vehicleType) errs.vehicleType = "Vehicle type is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await api.post("api/driver/auth/register", {
        name,
        email,
        password,
        vehicleType,
      });
      toast({
        title: "Registration successful",
        description: "Please log in with your credentials.",
        status: "success",
        duration: 3000,
      });
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response || err);
      toast({
        title: "Registration failed",
        description: err.response?.data?.message || err.message || "Error",
        status: "error",
      });
    }
  };

  return (
    <AuthLayout gradient="linear(to-br, purple.400, pink.500)">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center" color="white">
            Driver Registration
          </Heading>
          <Text fontSize="sm" color="whiteAlpha.800" textAlign="center">
            Create your account to start receiving ride requests.
          </Text>

          {/* Name */}
          <FormControl isInvalid={errors.name}>
            <FormLabel color="white">Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              focusBorderColor="purple.200"
              bg="whiteAlpha.800"
            />
            {errors.name && (
              <Text fontSize="xs" color="red.300">
                {errors.name}
              </Text>
            )}
          </FormControl>

          {/* Email */}
          <FormControl isInvalid={errors.email}>
            <FormLabel color="white">Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="purple.200"
              bg="whiteAlpha.800"
            />
            {errors.email && (
              <Text fontSize="xs" color="red.300">
                {errors.email}
              </Text>
            )}
          </FormControl>

          {/* Password */}
          <FormControl isInvalid={errors.password}>
            <FormLabel color="white">Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                focusBorderColor="purple.200"
                bg="whiteAlpha.800"
              />
              <InputRightElement>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.password && (
              <Text fontSize="xs" color="red.300">
                {errors.password}
              </Text>
            )}
          </FormControl>

          {/* Vehicle Type */}
          <FormControl isInvalid={errors.vehicleType}>
            <FormLabel color="white">Vehicle Type</FormLabel>
            <Select
              placeholder="Select vehicle type"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              focusBorderColor="purple.200"
              bg="whiteAlpha.800"
            >
              <option value="truck">Truck</option>
              <option value="bike">Bike</option>
              <option value="van">Van</option>
            </Select>
            {errors.vehicleType && (
              <Text fontSize="xs" color="red.300">
                {errors.vehicleType}
              </Text>
            )}
          </FormControl>

          {/* Submit */}
          <Button colorScheme="purple" onClick={handleSubmit}>
            Register
          </Button>

          {/* Toggle to Login */}
          <Text fontSize="sm" textAlign="center" color="whiteAlpha.900">
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
      </motion.div>
    </AuthLayout>
  );
}
