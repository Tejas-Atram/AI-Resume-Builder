import axios from "axios";

// Make sure your baseURL is correct (check if you need /api at the end)
const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: baseURL,
});

// REQUEST INTERCEPTOR: Automatically attaches JWT to every call
api.interceptors.request.use(
  (config) => {
    // 1. Get auth data from localStorage
    const authData = localStorage.getItem("auth");

    if (authData) {
      try {
        const parsedAuth = JSON.parse(authData);
        const token = parsedAuth.token;

        if (token) {
          // 2. Attach the Bearer token
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Error parsing auth token from localStorage", err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
