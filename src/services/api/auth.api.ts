import { apiClient, normalizeApiError } from '../../api/client';
import type { AuthApiResponse, UserDTO, RegisterPayload, ForgotPasswordPayload, ResetPasswordPayload, VerifyEmailPayload, SessionDTO } from '../../types/api.types';

const toUserDTO = (payload: Partial<UserDTO> | null | undefined): UserDTO => {
  const joinedName = [payload?.first_name, payload?.last_name].filter(Boolean).join(' ');
  const nameFromResource = payload?.full_name ?? payload?.name ?? (joinedName || 'User');

  return {
    id: String(payload?.id ?? payload?.uuid ?? 'local-user'),
    uuid: payload?.uuid,
    name: nameFromResource,
    email: payload?.email ?? '',
    first_name: payload?.first_name,
    middle_name: payload?.middle_name ?? null,
    last_name: payload?.last_name,
    full_name: payload?.full_name ?? nameFromResource,
    phone: payload?.phone ?? null,
    status: payload?.status ?? 'active',
    email_verified_at: payload?.email_verified_at ?? null,
    created_at: payload?.created_at ?? new Date().toISOString(),
    updated_at: payload?.updated_at ?? new Date().toISOString(),
    tenants: Array.isArray(payload?.tenants) ? payload.tenants : [],
    role: payload?.role ?? 'learner',
    membership: payload?.membership,
  };
};

export const authApi = {
  login: async (credentials: { email: string; password?: string; remember?: boolean }) => {
    try {
      const { data } = await apiClient.post('/auth/login', credentials);
      const payload = data?.data ?? data;

      return {
        user: toUserDTO(payload?.user ?? payload),
        token: payload?.token ?? null,
        token_type: payload?.token_type ?? 'Bearer',
        mfa_required: Boolean(payload?.mfa_required),
        challenge_id: payload?.challenge_id ?? null,
        method: payload?.method ?? null,
        expires_in: payload?.expires_in ?? null,
        message: data?.message ?? 'Login successful.',
      } satisfies AuthApiResponse;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  me: async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      const payload = data?.data ?? data;
      return toUserDTO(payload);
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      return true;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  register: async (payload: RegisterPayload) => {
    try {
      const { data } = await apiClient.post('/auth/register', payload);
      const resource = data?.data ?? data;
      return {
        user: toUserDTO(resource),
        message: data?.message ?? 'Registration successful.',
      };
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    try {
      await apiClient.post('/auth/forgot-password', payload);
      return true;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    try {
      const { data } = await apiClient.post('/auth/reset-password', payload);
      const resource = data?.data ?? data;
      return {
        user: toUserDTO(resource),
        message: data?.message ?? 'Password reset successfully.',
      };
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  verifyEmail: async (payload: VerifyEmailPayload) => {
    try {
      const { data } = await apiClient.post('/auth/verify-email', payload);
      return {
        message: data?.message ?? 'Email verified successfully.',
      };
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  resendVerification: async () => {
    try {
      const { data } = await apiClient.post('/auth/resend-verification');
      return {
        message: data?.message ?? 'Verification email sent.',
      };
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  getSessions: async () => {
    try {
      const { data } = await apiClient.get('/auth/sessions');
      return Array.isArray(data) ? data as SessionDTO[] : (data?.data ?? []) as SessionDTO[];
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  revokeSession: async (sessionId: number) => {
    try {
      await apiClient.delete(`/auth/sessions/${sessionId}`);
      return true;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  loginWithGoogle: async () => {
    return authApi.login({ email: 'google-user@example.com', password: 'google' });
  },

  registerOrganization: async (data: RegisterPayload) => {
    return authApi.register(data);
  },
};
