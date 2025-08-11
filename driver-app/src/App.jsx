import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RideRequests from "./pages/RideRequests";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rides" element={<RideRequests />} />
      </Routes>
    </BrowserRouter>
  );
}
