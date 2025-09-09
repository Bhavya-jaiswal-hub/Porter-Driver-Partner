import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";


export default function TestLottie() {
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
        src={deliveryAnimation}
        style={{ height: "300px", width: "300px" }}
      />
    </div>
  );
}
