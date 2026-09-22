import { apiClient, normalizeApiError } from '../../api/client';
import type {
  AuthApiResponse,
  AuthUserDTO,
  UserDTO,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  SessionDTO,
  OrganizationDTO,
} from '../../types';

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
  };
};

export const toOrganizationDTO = (
  payload: Partial<OrganizationDTO> | null | undefined,
): OrganizationDTO | null => {
  if (
    !payload?.uuid ||
    !payload.name ||
    !payload.slug ||
    !payload.status
  ) {
    return null;
  }

  return {
    uuid: String(payload.uuid),
    name: String(payload.name),
    slug: String(payload.slug),
    status: payload.status,
    membership: payload.membership,
    settings: payload.settings ?? null,
    created_at: payload.created_at ?? null,
    updated_at: payload.updated_at ?? null,
  };
};

export const toAuthUserDTO = (
  payload: Record<string, unknown> | null | undefined,
): AuthUserDTO => {
  const userPayload =
    (payload?.user as Record<string, unknown> | undefined) ??
    payload ??
    {};

  const user = toUserDTO(
    userPayload as Partial<UserDTO>,
  );

  const organizations = Array.isArray(
    userPayload.organizations,
  )
    ? userPayload.organizations
        .map((organization) =>
          toOrganizationDTO(
            organization as Partial<OrganizationDTO>,
          ),
        )
        .filter(
          (
            organization,
          ): organization is OrganizationDTO =>
            organization !== null,
        )
    : [];

  return {
    ...user,
    organizations,
  };
};

export const authApi = {
  login: async (credentials: { email: string; password?: string; remember?: boolean }) => {
    try {
      const { data } = await apiClient.post('/auth/login', credentials);
      const payload = data?.data ?? data;

      return {
        user: toAuthUserDTO(payload),
        token: payload?.token ?? null,
        token_type: payload?.token_type ?? 'Bearer',
        mfa_required: Boolean(payload?.mfa_required),
        challenge_id: payload?.challenge_id ?? null,
        method: payload?.method ?? null,
        expires_in: payload?.expires_in ?? null,
        message: data?.message ?? 'Login successful.',
      } satisfies AuthApiResponse;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  completeMfa: async (payload: { challenge_id: string; code: string }) => {
    try {
      const { data } = await apiClient.post('/auth/mfa/login', payload);
      const body = data?.data ?? data;

      return {
        user: toAuthUserDTO(body),
        token: body?.token ?? null,
        token_type: body?.token_type ?? 'Bearer',
        mfa_required: false,
        message: data?.message ?? 'Login successful.',
      } satisfies AuthApiResponse;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  me: async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      const payload = data?.data ?? data;
      return toAuthUserDTO(payload);
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      return true;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  register: async (payload: RegisterPayload) => {
    try {
      const { data } = await apiClient.post('/auth/register', payload);
      const resource = data?.data ?? data;
      return {
        user: toAuthUserDTO(resource),
        message: data?.message ?? 'Registration successful.',
      };
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  forgotPassword: async (payload: ForgotPasswordPayload) => {
    try {
      await apiClient.post('/auth/forgot-password', payload);
      return true;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  resetPassword: async (payload: ResetPasswordPayload) => {
    try {
      const { data } = await apiClient.post('/auth/reset-password', payload);
      const resource = data?.data ?? data;
      return {
        user: toAuthUserDTO(resource),
        message: data?.message ?? 'Password reset successfully.',
      };
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  verifyEmail: async (payload: VerifyEmailPayload) => {
    try {
      const { data } = await apiClient.post('/auth/verify-email', payload);
      return {
        message: data?.message ?? 'Email verified successfully.',
      };
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  resendVerification: async () => {
    try {
      const { data } = await apiClient.post('/auth/resend-verification');
      return {
        message: data?.message ?? 'Verification email sent.',
      };
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  getSessions: async () => {
    try {
      const { data } = await apiClient.get('/auth/sessions');
      return Array.isArray(data) ? data as SessionDTO[] : (data?.data ?? []) as SessionDTO[];
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  revokeSession: async (sessionId: number) => {
    try {
      await apiClient.delete(`/auth/sessions/${sessionId}`);
      return true;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  loginWithGoogle: async () => {
    return authApi.login({ email: 'google-user@example.com', password: 'google' });
  },

  registerOrganization: async (data: RegisterPayload) => {
    return authApi.register(data);
  },
};
