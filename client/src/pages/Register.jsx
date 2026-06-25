import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const { register } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [partnerId, setPartnerId] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // Pass ALL state variables to your context function
      await register(email, password, name, startDate, partnerId);
      navigate("/");
    } catch (err) {
      console.error("Registration failed", err);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow w-96 space-y-4"
      >
        <h1 className="text-3xl font-bold text-pink-500">Register</h1>

        <input
          className="border w-full p-3 rounded-xl"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border w-full p-3 rounded-xl"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          className="border w-full p-3 rounded-xl"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-pink-500">When did your relationship start?</p>
        <input
          type="date"
          className="border w-full p-3 rounded-xl"
          placeholder="Start of relationship"
          onChange={(e) => setStartDate(e.target.value)}
        />
        <p className="text-pink-500">
          Enter your partner's unique Hub ID (optional):
        </p>
        <input
          type="text"
          className="border w-full p-3 rounded-xl"
          placeholder="Partner's Hub ID"
          onChange={(e) => setPartnerId(e.target.value)}
        />

        <button className="bg-pink-500 text-white w-full p-3 rounded-xl">
          Register
        </button>
        <p className="text-gray-600">
          Already have an account? {"  "}
          <button
            className=" text-pink-500 hover:text-pink-700"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
