import {
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../layout/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  // Inline validation
  const validate = () => {
    let errs = {};
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email format";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Min 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle login
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const res = await api.post("/api/driver/auth/login", { email, password });
      console.log("Login response:", res.data);

      const token = res.data.accessToken;
      if (!token) {
        throw new Error("No access token returned from backend");
      }

      // Let AuthContext handle storing token + fetching driver
      await login(token);

      toast({ title: "Login successful", status: "success", duration: 3000 });
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response || err);
      toast({
        title: "Login failed",
        description: err.response?.data?.message || err.message || "Error",
        status: "error",
      });
    }
  };

  return (
    <AuthLayout gradient="linear(to-br, teal.400, blue.500)">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center" color="white">
            Driver Login
          </Heading>
          <Text fontSize="sm" color="whiteAlpha.800" textAlign="center">
            Welcome back! Please log in to continue.
          </Text>

          {/* Email */}
          <FormControl isInvalid={errors.email}>
            <FormLabel color="white">Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="teal.200"
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
                focusBorderColor="teal.200"
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

          {/* Submit */}
          <Button colorScheme="teal" onClick={handleSubmit}>
            Login
          </Button>

          {/* Toggle to Register */}
          <Text fontSize="sm" textAlign="center" color="whiteAlpha.900">
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
      </motion.div>
    </AuthLayout>
  );
}
