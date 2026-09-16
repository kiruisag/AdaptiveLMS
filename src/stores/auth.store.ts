import { create } from 'zustand';
import { UserDTO } from '../types/api.types';

interface AuthState {
  user: UserDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserDTO, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setAuth: (user, token) => {
    localStorage.setItem('access_token', token);
    set({ user, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  checkAuth: async () => {
    // In a real app, this would call the /auth/me endpoint
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("No token");
      
      // MOCK: Replace with real API call
      // const response = await apiClient.get<UserDTO>('/auth/me');
      // set({ user: response.data, isAuthenticated: true, isLoading: false });
      
      // MOCK FALLBACK for development
      set({ 
        user: {
          id: "1",
          name: "Test Learner",
          email: "learner@example.com",
          role: "learner",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
