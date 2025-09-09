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
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../layout/AuthLayout";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("register"); // "register" | "otp"
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(30); // seconds
  const otpInputRef = useRef(null);

  const toast = useToast();
  const navigate = useNavigate();

  // Mask email for display
  const maskEmail = (addr) => {
    if (!addr || !addr.includes("@")) return addr || "";
    const [user, domain] = addr.split("@");
    if (user.length <= 2) return `${user[0]}***@${domain}`;
    return `${user[0]}***${user[user.length - 1]}@${domain}`;
  };

  // Countdown timer for resend
  useEffect(() => {
    let timer;
    if (step === "otp" && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Autofocus OTP input when entering OTP step
  useEffect(() => {
    if (step === "otp" && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step]);

  // Inline validation
  const validate = () => {
    const errs = {};
    if (!name) errs.name = "Name is required";
    if (!email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = "Invalid email format";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Min 6 characters";
    if (!vehicleType) errs.vehicleType = "Vehicle type is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/api/driver/auth/send-otp", {
        name,
        email,
        password,
        vehicleType,
      });
      toast({
        title: "OTP sent",
        description: `An OTP has been sent to ${email}`,
        status: "success",
        duration: 3000,
      });
      setStep("otp");
      setCountdown(30); // reset timer when entering OTP step
    } catch (err) {
      toast({
        title: "Failed to send OTP",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Register
  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({ title: "Please enter OTP", status: "error" });
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/driver/auth/verify-otp", { email, otp });
      toast({
        title: "Registration successful",
        description: "Please log in with your credentials.",
        status: "success",
        duration: 3000,
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "OTP verification failed",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    } finally {
        setLoading(false);
    }
  };

  // Resend OTP (reuses the same registration payload)
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await api.post("/api/driver/auth/send-otp", {
        name,
        email,
        password,
        vehicleType,
      });
      toast({
        title: "OTP resent",
        description: `A new OTP has been sent to ${email}`,
        status: "success",
        duration: 3000,
      });
      setCountdown(30); // restart timer
    } catch (err) {
      toast({
        title: "Failed to resend OTP",
        description: err.response?.data?.message || err.message,
        status: "error",
      });
    } finally {
      setResending(false);
    }
  };

  // Allow Enter key to submit OTP
  const onOtpKeyDown = (e) => {
    if (e.key === "Enter") {
      handleVerifyOtp();
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
            {step === "register"
              ? "Create your account to start receiving ride requests."
              : `Enter the OTP sent to ${maskEmail(email)}`}
          </Text>

          {step === "register" && (
            <>
              {/* Name */}
              <FormControl isInvalid={!!errors.name}>
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
              <FormControl isInvalid={!!errors.email}>
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
              <FormControl isInvalid={!!errors.password}>
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

              {/* Vehicle Type (align with backend enum) */}
              <FormControl isInvalid={!!errors.vehicleType}>
                <FormLabel color="white">Vehicle Type</FormLabel>
                <Select
                  placeholder="Select vehicle type"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  focusBorderColor="purple.200"
                  bg="whiteAlpha.800"
                >
                  <option value="bike">Bike</option>
                  <option value="two-wheeler">Two-wheeler</option>
                  <option value="threewheeler">Threewheeler</option>
                  <option value="truck">Truck</option>
                  <option value="minitruck">Mini truck</option>
                  <option value="tempo">Tempo</option>
                </Select>
                {errors.vehicleType && (
                  <Text fontSize="xs" color="red.300">
                    {errors.vehicleType}
                  </Text>
                )}
              </FormControl>

              {/* Send OTP */}
              <Button
                colorScheme="purple"
                onClick={handleSendOtp}
                isLoading={loading}
              >
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
            </>
          )}

          {step === "otp" && (
            <>
              <FormControl>
                <FormLabel color="white">OTP</FormLabel>
                <Input
                  ref={otpInputRef}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  onKeyDown={onOtpKeyDown}
                  focusBorderColor="purple.200"
                  bg="whiteAlpha.800"
                  placeholder="Enter the 6-digit code"
                />
              </FormControl>

              <VStack spacing={3}>
                <Button
                  colorScheme="purple"
                  onClick={handleVerifyOtp}
                  isLoading={loading}
                  w="full"
                >
                  Verify OTP
                </Button>

                <Button
                  variant="outline"
                  colorScheme="purple"
                  onClick={handleResendOtp}
                  isLoading={resending}
                  isDisabled={countdown > 0}
                  w="full"
                >
                  {countdown > 0 ? `Resend OTP (${countdown}s)` : "Resend OTP"}
                </Button>

                <Button
                  variant="ghost"
                  colorScheme="whiteAlpha"
                  onClick={() => setStep("register")}
                  w="full"
                >
                  Change email
                </Button>
              </VStack>
            </>
          )}
        </VStack>
      </motion.div>
    </AuthLayout>
  );
}
