import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Add error state to show on screen

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // 👉 FIX: Pass the actual email and password states to your context
      await login(email, password);
      
      // If login succeeds, send them home
      navigate("/");
    } catch (err) {
      // If backend returns 401/500, it catches here
      console.error("Login failed:", err);
      setError(err.message || "Invalid email or password.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow w-96 space-y-4"
      >
        <h1 className="text-3xl font-bold text-pink-500">Login</h1>

        {/* Display backend error message if login fails */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

        <input
          type="email"
          required
          className="border w-full p-3 rounded-xl"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          required
          className="border w-full p-3 rounded-xl"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-pink-500 text-white w-full p-3 rounded-xl font-semibold">
          Login
        </button>
        
        <p className="text-gray-600 text-sm">
          Don't have an account? {"  "}
          <button
            type="button" 
            className="text-pink-500 hover:text-pink-700 font-medium"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}