import { create } from 'zustand';
import type {
  AuthUserDTO,
  OrganizationDTO,
} from '../types';
import { authApi } from '../services/api/auth.api';

type AuthStatus =
  | 'unauthenticated'
  | 'mfa_pending'
  | 'authenticated';

interface MfaChallenge {
  challengeId: string;
  method?: string | null;
  expiresIn?: number | null;
}

interface AuthState {
  user: AuthUserDTO | null;
  activeOrganization: OrganizationDTO | null;
  status: AuthStatus;
  isLoading: boolean;
  accessToken: string | null;
  mfaChallenge: MfaChallenge | null;

  setAuth: (user: AuthUserDTO, token?: string) => void;
  setMfaPending: (
    user: AuthUserDTO,
    challenge: MfaChallenge,
  ) => void;
  clearMfaChallenge: () => void;
  setActiveOrganization: (
    organization: OrganizationDTO,
  ) => void;
  clearActiveOrganization: () => void;
  logout: () => Promise<void>;
  checkAuth: (force?: boolean) => Promise<void>;
}

const ACCESS_TOKEN_KEY = 'access_token';
const ACTIVE_ORGANIZATION_KEY = 'active_organization_uuid';

const getStorageItem = (
  key: string,
): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem(key);
};

const setStorageItem = (
  key: string,
  value: string,
): void => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(key, value);
};

const removeStorageItem = (
  key: string,
): void => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(key);
};

const resolveActiveOrganization = (
  user: AuthUserDTO | null,
  organizationUuid?: string | null,
): OrganizationDTO | null => {
  const organizations = user?.organizations ?? [];

  if (organizations.length === 0) {
    return null;
  }

  const normalizedUuid =
    organizationUuid ??
    getStorageItem(ACTIVE_ORGANIZATION_KEY);

  if (normalizedUuid) {
    return (
      organizations.find(
        (organization) =>
          organization.uuid === normalizedUuid,
      ) ?? null
    );
  }

  if (organizations.length === 1) {
    return organizations[0];
  }

  return null;
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  activeOrganization: null,
  status: 'unauthenticated',
  isLoading: true,
  accessToken: getStorageItem(ACCESS_TOKEN_KEY),
  mfaChallenge: null,

  /**
   * Called immediately after successful login/register/Google auth.
   */
  setAuth: (user, token) => {
    const authToken =
      token ??
      getStorageItem(ACCESS_TOKEN_KEY) ??
      null;

    if (authToken) {
      setStorageItem(
        ACCESS_TOKEN_KEY,
        authToken,
      );
    }

    const storedOrganizationUuid =
      getStorageItem(
        ACTIVE_ORGANIZATION_KEY,
      );

    const activeOrganization =
      resolveActiveOrganization(
        user,
        storedOrganizationUuid,
      );

    if (
      activeOrganization &&
      !storedOrganizationUuid
    ) {
      setStorageItem(
        ACTIVE_ORGANIZATION_KEY,
        activeOrganization.uuid,
      );
    }

    set({
      user,
      activeOrganization,
      accessToken: authToken,
      status: authToken
        ? 'authenticated'
        : 'unauthenticated',
      mfaChallenge: null,
      isLoading: false,
    });
  },

  setMfaPending: (
    user,
    challenge,
  ) => {
    set({
      user,
      status: 'mfa_pending',
      mfaChallenge: challenge,
      isLoading: false,
    });
  },

  clearMfaChallenge: () => {
    set({
      mfaChallenge: null,
      status: 'unauthenticated',
    });
  },

  /**
   * Select the organization the user wants to work in.
   *
   * The organization UUID is the public context identifier.
   * The backend receives it through X-Organization-ID.
   */
  setActiveOrganization: (
    organization,
  ) => {
    if (!organization?.uuid) {
      return;
    }

    setStorageItem(
      ACTIVE_ORGANIZATION_KEY,
      organization.uuid,
    );

    set({
      activeOrganization: organization,
    });
  },

  /**
   * Clear only the active organization.
   */
  clearActiveOrganization: () => {
    removeStorageItem(
      ACTIVE_ORGANIZATION_KEY,
    );

    set({
      activeOrganization: null,
    });
  },

  /**
   * Verify the current authentication session.
   *
   * Important:
   * - Does not blindly overwrite an already established session.
   * - Restores the active organization from localStorage.
   * - Automatically selects a single available organization.
   * - Never modifies role or permission information.
   */
  checkAuth: async (
    force = false,
  ) => {
    const state = get();

    if (
      !force &&
      state.status === 'authenticated' &&
      state.user &&
      state.accessToken
    ) {
      return;
    }

    const token =
      getStorageItem(ACCESS_TOKEN_KEY);

    if (!token) {
      removeStorageItem(
        ACTIVE_ORGANIZATION_KEY,
      );

      set({
        user: null,
        activeOrganization: null,
        accessToken: null,
        status: 'unauthenticated',
        isLoading: false,
        mfaChallenge: null,
      });

      return;
    }

    set({
      isLoading: true,
    });

    try {
      const user =
        await authApi.me();

      if (!user) {
        throw new Error(
          'Unable to retrieve authenticated user',
        );
      }

      const activeOrganizationUuid =
        getStorageItem(
          ACTIVE_ORGANIZATION_KEY,
        );

      const activeOrganization =
        resolveActiveOrganization(
          user,
          activeOrganizationUuid,
        );

      if (
        activeOrganizationUuid &&
        !activeOrganization
      ) {
        removeStorageItem(
          ACTIVE_ORGANIZATION_KEY,
        );
      }

      if (
        activeOrganization &&
        !activeOrganizationUuid
      ) {
        setStorageItem(
          ACTIVE_ORGANIZATION_KEY,
          activeOrganization.uuid,
        );
      }

      set({
        user,
        activeOrganization,
        accessToken: token,
        status: 'authenticated',
        isLoading: false,
      });
    } catch (error) {
      console.error(
        'Authentication check failed:',
        error,
      );

      removeStorageItem(
        ACCESS_TOKEN_KEY,
      );
      removeStorageItem(
        ACTIVE_ORGANIZATION_KEY,
      );

      set({
        user: null,
        activeOrganization: null,
        accessToken: null,
        status: 'unauthenticated',
        isLoading: false,
        mfaChallenge: null,
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
      console.error(
        'Logout request failed:',
        error,
      );
    } finally {
      removeStorageItem(
        ACCESS_TOKEN_KEY,
      );
      removeStorageItem(
        ACTIVE_ORGANIZATION_KEY,
      );

      set({
        user: null,
        activeOrganization: null,
        accessToken: null,
        status: 'unauthenticated',
        isLoading: false,
        mfaChallenge: null,
      });
    }
  },
}));

/**
 * Backward compatibility.
 */
export const useAuthStore = useAuth;
