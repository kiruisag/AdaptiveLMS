import axios, { AxiosError } from 'axios';
import { useUiStore } from '../stores/ui.store';
import type { ApiError } from '../types/api.types';

const API_BASE_URL = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL || '/api/v1';

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data;
    const validationErrors = payload?.errors ?? payload?.data?.errors ?? undefined;
    const message = payload?.message ?? payload?.error ?? 'Something went wrong. Please try again.';

    return {
      message,
      code: String(error.response?.status ?? 'unknown'),
      errors: validationErrors,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'unknown',
    };
  }

  return {
    message: 'Something went wrong. Please try again.',
    code: 'unknown',
  };
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    useUiStore.getState().showGlobalLoader();

    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    useUiStore.getState().hideGlobalLoader();
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    useUiStore.getState().hideGlobalLoader();
    return response;
  },
  async (error: AxiosError) => {
    useUiStore.getState().hideGlobalLoader();
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('active_tenant_id');
        window.location.href = '/auth/login';
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('active_tenant_id');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
