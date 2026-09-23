import type { OrganizationDTO } from './organization.types';
import type { UserDTO } from './identity.types';

export interface AuthUserDTO extends UserDTO {
  organizations: OrganizationDTO[];
}

export interface AuthApiResponse {
  user: AuthUserDTO;
  token?: string | null;
  token_type?: string;
  mfa_required?: boolean;
  challenge_id?: string | null;
  method?: string | null;
  expires_in?: number | null;
  message?: string;
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
export interface MfaStatusDTO {
  enabled: boolean;
  method?: string | null;
}

export interface MfaSetupDTO {
  type: string;
  secret: string;
  provisioning_uri: string;
}
export interface MfaRecoveryCodeStatusDTO {
  total: number;
  used: number;
  remaining: number;
}

export interface MfaRecoveryCodesDTO {
  codes: string[];
}