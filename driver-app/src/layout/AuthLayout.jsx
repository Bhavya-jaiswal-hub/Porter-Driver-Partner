// src/layout/AuthLayout.jsx
import { Flex, Box } from "@chakra-ui/react";

export default function AuthLayout({ children, gradient }) {
  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgGradient={gradient}
      p={4}
    >
      <Box
        bg="whiteAlpha.200"
        backdropFilter="blur(10px)"
        p={8}   
        rounded="xl"
        shadow="xl"
        w={{ base: "100%", sm: "400px" }}
      >
        {children}
      </Box>
    </Flex>
  );
}
