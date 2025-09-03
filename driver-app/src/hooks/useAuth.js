import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// ✅ Simple wrapper so you can just call useAuth() anywhere
export const useAuth = () => {
  return useContext(AuthContext);
};
