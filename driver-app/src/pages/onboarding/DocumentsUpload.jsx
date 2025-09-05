// src/pages/onboarding/DocumentsUpload.jsx
import { Box, Heading, VStack, Button, Input, useToast } from "@chakra-ui/react";
import { useState } from "react";
import api from "../../services/api";

export default function DocumentsUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const toast = useToast();

  const handleUpload = async (docType) => {
    if (!selectedFile) {
      toast({ title: "Please select a file first", status: "warning" });
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await api.post(`/api/driver/onboarding/documents/${docType}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast({ title: `${docType.toUpperCase()} uploaded`, status: "success" });
      setSelectedFile(null);
    } catch (err) {
      toast({ title: `Error uploading ${docType}`, status: "error" });
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Upload Documents</Heading>
      <VStack align="stretch" spacing={4}>
        <Input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />

        <Button colorScheme="teal" onClick={() => handleUpload("aadhar")}>
          Upload Aadhaar
        </Button>
        <Button colorScheme="teal" onClick={() => handleUpload("pan")}>
          Upload PAN
        </Button>
        <Button colorScheme="teal" onClick={() => handleUpload("dl")}>
          Upload DL
        </Button>
        <Button colorScheme="teal" onClick={() => handleUpload("rc")}>
          Upload RC
        </Button>
      </VStack>
    </Box>
  );
}
