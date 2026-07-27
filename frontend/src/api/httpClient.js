import axios from 'axios';
import { useStaffAuthStore } from '../store/staffAuthStore';

// 프로덕션 빌드는 프런트/백엔드가 같은 Vercel 배포(same-origin)이므로 기본값이
// 빈 문자열이어야 한다. VITE_API_BASE_URL을 깜빡 설정하지 않아도 localhost로
// 굳어버리지 않도록 import.meta.env.PROD로 분기한다.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:4000');

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
