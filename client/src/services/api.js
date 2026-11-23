import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://couplehub-gzl5.onrender.com/api",
});

export default API;