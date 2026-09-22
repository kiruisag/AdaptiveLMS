import axios, { AxiosError } from 'axios';
import { useUiStore } from '../stores/ui.store';
import type { ApiError } from '../types/api.types';
import {
  getActiveOrganizationUuid,
  resolveOrganizationHeader,
} from './organization-context';

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
  withCredentials: false,
});

apiClient.interceptors.request.use(
  (config) => {
    useUiStore.getState().showGlobalLoader();

    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null;

    const organizationUuid =
      getActiveOrganizationUuid();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.headers) {
      const organizationHeaders =
        resolveOrganizationHeader(
          organizationUuid,
        );

      Object.entries(
        organizationHeaders,
      ).forEach(([key, value]) => {
        config.headers[key] = value;
      });
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
      // Prevent redirecting when the failing request is an authentication endpoint
      const authPaths = [
        '/auth/login',
        '/auth/mfa/login',
        '/auth/register',
        '/auth/verify-email',
        '/auth/resend-verification',
        '/auth/forgot-password',
        '/auth/reset-password',
      ];

      const requestUrl = String(originalRequest.url ?? '');
      const isAuthRequest = authPaths.some((p) => requestUrl.includes(p));

      if (isAuthRequest) {
        // Let the caller handle the error (e.g., show validation messages) and
        // avoid navigating away from the login page on failed authentication attempts.
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        localStorage.removeItem('access_token');
        localStorage.removeItem('active_organization_uuid');
        window.location.href = '/auth/login';
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('active_organization_uuid');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
