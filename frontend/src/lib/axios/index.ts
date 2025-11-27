import { errorToast } from "@/utils/toast";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Network or CORS errors
    if (!error.response) {
      console.error("Network error or backend unreachable:", error);
      errorToast("Cannot connect to server. Please check your connection.");
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
