import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "/api" // use Vite proxy in dev
    : import.meta.env.VITE_BACKEND_URL + "/api"; // full URL in prod

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
