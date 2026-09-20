import { create } from 'zustand';
import { UserDTO, TenantDTO } from '../types/api.types';
import { authApi } from '../services/api/auth.api';

interface AuthState {
  user: UserDTO | null;
  activeTenant: TenantDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;

  setAuth: (user: UserDTO, token?: string) => void;
  setActiveTenant: (tenant: TenantDTO) => void;
  clearActiveTenant: () => void;
  logout: () => Promise<void>;
  checkAuth: (force?: boolean) => Promise<void>;
}

const ACCESS_TOKEN_KEY = 'access_token';
const ACTIVE_TENANT_KEY = 'active_tenant_id';

const resolveActiveTenant = (user: UserDTO | null, tenantId?: string | null): TenantDTO | null => {
  if (!user?.tenants?.length) {
    return null;
  }

  const normalizedTenantId = tenantId ?? getStorageItem(ACTIVE_TENANT_KEY);

  if (!normalizedTenantId) {
    return null;
  }

  return user.tenants.find((tenant) => String(tenant.id) === String(normalizedTenantId)) ?? null;
};

const getStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(key);
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(key, value);
};

const removeStorageItem = (key: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(key);
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  activeTenant: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken: getStorageItem(ACCESS_TOKEN_KEY),

  /**
   * Called immediately after successful login/register/Google auth.
   */
  setAuth: (user, token) => {
    const authToken = token ?? getStorageItem(ACCESS_TOKEN_KEY) ?? null;

    if (authToken) {
      setStorageItem(ACCESS_TOKEN_KEY, authToken);
    }

    const activeTenant = resolveActiveTenant(user, getStorageItem(ACTIVE_TENANT_KEY));

    set({
      user,
      activeTenant,
      accessToken: authToken,
      isAuthenticated: !!authToken || !!user,
      isLoading: false,
    });
  },

  /**
   * Select the organization/tenant the user wants to work in.
   */
  setActiveTenant: (tenant) => {
    if (!tenant?.id) {
      return;
    }

    setStorageItem(ACTIVE_TENANT_KEY, String(tenant.id));

    set((state) => ({
      activeTenant: tenant,
      user: state.user ? { ...state.user, role: state.user.role } : state.user,
    }));
  },

  /**
   * Clear only the active tenant.
   */
  clearActiveTenant: () => {
    removeStorageItem(ACTIVE_TENANT_KEY);

    set({
      activeTenant: null,
    });
  },

  /**
   * Verify the current authentication session.
   *
   * Important:
   * - Does not blindly overwrite an already established session.
   * - Restores the active tenant from localStorage.
   * - Never modifies user.role.
   */
  checkAuth: async (force = false) => {
    const state = get();

    if (!force && state.isAuthenticated && state.user && state.accessToken) {
      return;
    }

    const token = getStorageItem(ACCESS_TOKEN_KEY);

    if (!token) {
      if (state.user || state.isAuthenticated || state.accessToken) {
        removeStorageItem(ACTIVE_TENANT_KEY);
        set({
          user: null,
          activeTenant: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          activeTenant: null,
          accessToken: null,
        });
      }
      return;
    }

    set({ isLoading: true });

    try {
      const user = await authApi.me();

      if (!user) {
        throw new Error('Unable to retrieve authenticated user');
      }

      const activeTenantId = getStorageItem(ACTIVE_TENANT_KEY);
      const activeTenant = resolveActiveTenant(user, activeTenantId);

      if (activeTenantId && !activeTenant) {
        removeStorageItem(ACTIVE_TENANT_KEY);
      }

      set({
        user,
        activeTenant,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Authentication check failed:', error);

      removeStorageItem(ACCESS_TOKEN_KEY);
      removeStorageItem(ACTIVE_TENANT_KEY);

      set({
        user: null,
        activeTenant: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Logout from the backend and clear local state.
   */
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      /**
       * Even if the API logout fails, clear the local session.
       */
      console.error(
        'Logout request failed:',
        error
      );
    } finally {
      removeStorageItem(ACCESS_TOKEN_KEY);
      removeStorageItem(ACTIVE_TENANT_KEY);

      set({
        user: null,
        activeTenant: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

/**
 * Backward compatibility.
 */
export const useAuthStore = useAuth;

