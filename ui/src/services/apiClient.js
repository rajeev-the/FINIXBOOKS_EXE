import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/slices/authSlice";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const EXE_BACKEND_URL =
  import.meta.env.VITE_EXE_BACKEND_URL || "http://localhost:3001";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("tb_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export default apiClient;
