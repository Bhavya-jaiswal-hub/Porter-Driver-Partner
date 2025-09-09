import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";

export default function TestLottieInline() {
  return (
    <div
      style={{
        background: "#0f172a",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Player
        autoplay
        loop
        src="https://assets1.lottiefiles.com/packages/lf20_touohxv0.json"
        style={{ height: "300px", width: "300px" }}
      />
    </div>
  );
}
