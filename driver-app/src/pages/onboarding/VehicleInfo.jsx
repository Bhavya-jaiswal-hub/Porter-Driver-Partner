// src/pages/onboarding/VehicleInfo.jsx
import { Box, Heading, FormControl, FormLabel, Input, Select, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function VehicleInfo() {
  const [type, setType] = useState("");
  const [number, setNumber] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await api.post("/api/driver/onboarding/vehicle", {
        type,
        number,
        completed: true
      });
      toast({ title: "Vehicle info saved", status: "success" });
      navigate("/onboarding");
    } catch (err) {
      toast({ title: "Error saving vehicle info", status: "error" });
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Vehicle Information</Heading>
      <FormControl mb={4}>
        <FormLabel>Vehicle Type</FormLabel>
        <Select placeholder="Select type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="truck">Truck</option>
          <option value="bike">Bike</option>
          <option value="van">Van</option>
        </Select>
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Vehicle Number</FormLabel>
        <Input value={number} onChange={(e) => setNumber(e.target.value)} />
      </FormControl>
      <Button colorScheme="teal" onClick={handleSubmit}>Save</Button>
    </Box>
  );
}
