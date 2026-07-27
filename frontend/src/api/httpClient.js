import axios from 'axios';
import { useStaffAuthStore } from '../store/staffAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export const httpClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

httpClient.interceptors.request.use((config) => {
  const token = useStaffAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useStaffAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
