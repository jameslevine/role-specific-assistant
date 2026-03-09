import axios from "axios";
import { useStore } from "../store";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/v1";

const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiInstance.interceptors.request.use(
  (config) => {
    const token = useStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useStore.getState().setAuthenticated(false);
      useStore.getState().setAccessToken(null);
    }
    return Promise.reject(error);
  },
);

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await apiInstance.get<T>(url);
    return response.data;
  },
  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await apiInstance.post<T>(url, data);
    return response.data;
  },
  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await apiInstance.patch<T>(url, data);
    return response.data;
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await apiInstance.delete<T>(url);
    return response.data;
  },
};
