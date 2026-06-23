import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added to prevent route flickering on refresh

  // Check for existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // In a real application, you'd usually decode the JWT token here or fetch user profile data
      setUser({ token });
    }
    setLoading(false);
  }, []);

  // Updated to make a real backend API request
  async function login(email, password) {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to log in.");
    }

    localStorage.setItem("token", data.token);
    setUser({ token: data.token, ...data.user }); 
  }

  // Added the missing register function
  async function register(email, password, name, startDate) {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, startDate }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to register account.");
    }

    // Optional: Log them in automatically right after registering if your backend returns a token
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser({ token: data.token, ...data.user });
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}