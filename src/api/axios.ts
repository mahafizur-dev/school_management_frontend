import axios from "axios";
import { useAuthStore } from "../store/auth.store";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
// This runs before each request is sent
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState(); // Get token from Zustand store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
