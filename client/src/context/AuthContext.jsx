import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. FIXED: Retrieve BOTH token and user profile details on reload
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user"); // Read the saved user string

    if (token && storedUser) {
      // Parse the JSON string back into a JavaScript object
      setUser({ token, ...JSON.parse(storedUser) });
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to log in.");

    // 2. FIXED: Save user object to localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user)); // Save profile data
    
    setUser({ token: data.token, ...data.user }); 
  }

  async function register(email, password, name, startDate, partnerId) {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name, startDate, partnerId }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to register.");

    if (data.token) {
      // 3. FIXED: Save user object to localStorage on registration auto-login
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Save profile data
      
      setUser({ token: data.token, ...data.user });
    }
  }

  function logout() {
    // 4. FIXED: Clear both values on logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  return (
   <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
    {!loading && children} 
  </AuthContext.Provider>
  );
}