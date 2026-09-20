export type UserRole =
  | 'learner'
  | 'instructor'
  | 'org_admin'
  | 'sys_admin';

export type UserStatus = 'active' | 'pending' | 'suspended' | 'inactive' | 'locked';

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface TenantMembershipDTO {
  id?: string;
  tenant_id?: string;
  role: UserRole;
  permissions?: string[];
}

export interface TenantDTO {
  id: string;
  name: string;
  slug: string;
  type: string;
  logo_url?: string;
  role: UserRole;
  membership?: TenantMembershipDTO;
}

export interface UserDTO {
  id: string;
  uuid?: string;
  name: string;
  email: string;
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  full_name?: string;
  phone?: string | null;
  avatar_url?: string;
  status?: UserStatus;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  tenants: TenantDTO[];
  role?: UserRole;
  membership?: TenantMembershipDTO;
}

export interface AuthApiResponse {
  user: UserDTO;
  token?: string | null;
  token_type?: string;
  mfa_required?: boolean;
  challenge_id?: string | null;
  method?: string | null;
  expires_in?: number | null;
  message?: string;
}

export interface SessionDTO {
  id: number;
  user_id?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  last_activity?: number | null;
  device_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface RegisterPayload {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  email: string;
  phone?: string | null;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyEmailPayload {
  token: string;
  email?: string;
}

export interface OrganizationDTO {
  uuid: string;
  name: string;
  slug: string;
  status: 'pending' | 'active' | 'suspended' | 'archived';
  settings?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
}
