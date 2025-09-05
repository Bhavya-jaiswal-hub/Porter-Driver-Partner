// src/pages/onboarding/PersonalInfo.jsx
import { Box, Heading, FormControl, FormLabel, Input, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function PersonalInfo() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post("/api/driver/onboarding/personal", {
        name,
        phone,
        completed: true
      });
      toast({ title: "Personal info saved", status: "success" });
      navigate("/onboarding");
    } catch (err) {
      toast({ title: "Error saving personal info", status: "error" });
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Personal Information</Heading>
      <FormControl mb={4}>
        <FormLabel>Name</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Phone</FormLabel>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </FormControl>
      <Button colorScheme="teal" onClick={handleSubmit}>Save</Button>
    </Box>
  );
}
