import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
    const { user } = useContext(AuthContext);

    // If not logged in, redirect them to login page
    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}