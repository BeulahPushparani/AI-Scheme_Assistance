import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error normalizer
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired/invalid → clear and let pages handle
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";
    return Promise.reject({ ...error, message });
  }
);

export default api;