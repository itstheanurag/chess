/* eslint-disable @typescript-eslint/no-explicit-any */
import { flushLocalTokens, getToken, saveToken } from "@/types/utils";
import { errorToast } from "@/types/utils/toast";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
  config: any;
}[] = [];

api.interceptors.request.use((config) => {
  const token = getToken("accessToken");
  if (token)
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    } as any;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Network or CORS errors
    if (!error.response) {
      console.error("Network error or backend unreachable:", error);
      errorToast("Cannot connect to server. Please check your connection.");
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = getToken("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          { token: refreshToken }
        );

        const newAccessToken = data.data?.accessToken;
        if (!newAccessToken) throw new Error("Failed to refresh token");

        saveToken("accessToken", newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        failedQueue.forEach((req) => {
          req.config.headers.Authorization = `Bearer ${newAccessToken}`;
          req.resolve(api(req.config));
        });
        failedQueue = [];
        return api({
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
      } catch (refreshError) {
        failedQueue.forEach((req) => req.reject(refreshError));
        failedQueue = [];

        flushLocalTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
