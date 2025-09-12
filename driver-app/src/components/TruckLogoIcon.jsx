// src/components/TruckLogoIcon.jsx
import React from "react";
import { Icon } from "@chakra-ui/react";

export default function TruckLogoIcon({ boxSize = 6, color = "#19A7F2", ...rest }) {
  return (
    <Icon viewBox="0 0 64 40" boxSize={boxSize} color={color} {...rest}>
      {/* Cargo box */}
      <rect x="18" y="10" width="28" height="14" rx="2" fill="currentColor" />
      {/* Cab */}
      <path d="M46 24h7c.6 0 1-.4 1-1v-4.5c0-.3-.1-.6-.3-.8l-3.8-4A1 1 0 0 0 49.2 13H46v11z" fill="currentColor"/>
      {/* Window */}
      <rect x="47.5" y="15.2" width="3.6" height="3.6" rx="0.8" fill="white" opacity="0.9" />
      {/* Ground line (subtle) */}
      <rect x="6" y="28" width="52" height="1" fill="currentColor" opacity="0.12" />
      {/* Motion lines */}
      <rect x="6" y="12" width="8" height="2" rx="1" fill="currentColor" opacity="0.45" />
      <rect x="6" y="16" width="10" height="2" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="6" y="20" width="6" height="2" rx="1" fill="currentColor" opacity="0.25" />
      {/* Wheels */}
      <circle cx="26" cy="30" r="4.2" fill="currentColor" />
      <circle cx="26" cy="30" r="1.8" fill="white" opacity="0.9" />
      <circle cx="48" cy="30" r="4.2" fill="currentColor" />
      <circle cx="48" cy="30" r="1.8" fill="white" opacity="0.9" />
      {/* Underbody connector */}
      <rect x="30" y="24" width="12" height="2" rx="1" fill="currentColor" />
    </Icon>
  );
}
