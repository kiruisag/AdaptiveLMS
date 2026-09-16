import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // For cookie-based auth or sessions if needed
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      try {
        // Attempt to refresh token here if refresh endpoint exists
        // const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`);
        // localStorage.setItem('access_token', data.token);
        // if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${data.token}`;
        // return apiClient(originalRequest);
        
        // If refresh fails or is not implemented, logout
        localStorage.removeItem('access_token');
        window.location.href = '/auth/login';
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
