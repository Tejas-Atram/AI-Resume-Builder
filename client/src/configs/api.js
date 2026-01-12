import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
console.log("🔧 API Base URL configured as:", baseURL);

const api = axios.create({
  baseURL: baseURL,
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('🚀 Request:', request.method.toUpperCase(), request.url);
  console.log('🚀 Full URL:', request.baseURL + request.url);
  return request;
});

export default api;
