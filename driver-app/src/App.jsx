import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DriverDashboard from "./components/DriverDashboard";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DriverDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
