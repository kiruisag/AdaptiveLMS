import { create } from 'zustand';
import { UserDTO, TenantDTO } from '../types/api.types';
import { authApi } from '../services/api/auth.api';

interface AuthState {
  user: UserDTO | null;
  activeTenant: TenantDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  setAuth: (user: UserDTO, token: string) => void;
  setActiveTenant: (tenant: TenantDTO) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  activeTenant: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken: localStorage.getItem('access_token'),
  
  setAuth: (user, token) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('mock_user_role', user.role || 'learner');
    localStorage.setItem('mock_user_email', user.email);
    set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
  },
  
  setActiveTenant: (tenant) => {
    localStorage.setItem('active_tenant_id', tenant.id);
    
    // For backwards compatibility and routing logic
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, role: tenant.role };
      localStorage.setItem('mock_user_role', tenant.role);
      return { activeTenant: tenant, user: updatedUser };
    });
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('mock_user_role');
    localStorage.removeItem('mock_user_email');
    localStorage.removeItem('active_tenant_id');
    set({ user: null, activeTenant: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },
  
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("No token");
      
      const user = await authApi.me();
      const activeTenantId = localStorage.getItem('active_tenant_id');
      
      let activeTenant = null;
      if (activeTenantId && user.tenants) {
        activeTenant = user.tenants.find(t => t.id === activeTenantId) || null;
      }
      
      // Update role based on active tenant if found
      if (activeTenant) {
        user.role = activeTenant.role;
      }
      
      set({ 
        user, 
        activeTenant,
        accessToken: token,
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error) {
      set({ user: null, activeTenant: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  }
}));

// Export for backward compatibility with existing imports
export const useAuthStore = useAuth;

