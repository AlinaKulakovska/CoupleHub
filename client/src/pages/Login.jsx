import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e) {

        e.preventDefault();

        // later this comes from backend
        const fakeToken = "123456";

        login(fakeToken);

        navigate("/");
    }

    return (

        <div className="flex justify-center items-center min-h-screen">

            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-3xl shadow w-96 space-y-4"
            >

                <h1 className="text-3xl font-bold text-pink-500">
                    Login
                </h1>

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

                <button className="bg-pink-500 text-white w-full p-3 rounded-xl">
                    Login
                </button>

            </form>

        </div>
    );
}