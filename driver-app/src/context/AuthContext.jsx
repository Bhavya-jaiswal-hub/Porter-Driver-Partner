import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [driver, setDriver] = useState(null); // will hold driver object from backend
  const [loading, setLoading] = useState(true);

  // Fetch driver profile on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('driverToken');
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get('/api/driver/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDriver(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch driver profile:', err);
        localStorage.removeItem('driverToken');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, driverData) => {
    localStorage.setItem('driverToken', token);
    setDriver(driverData);
  };

  const logout = () => {
    localStorage.removeItem('driverToken');
    setDriver(null);
  };

  return (
    <AuthContext.Provider value={{ driver, setDriver, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
