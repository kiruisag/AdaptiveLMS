export type UserStatus =
  | 'active'
  | 'pending'
  | 'suspended'
  | 'inactive'
  | 'locked';

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
}

export interface BackendUser {
  uuid: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  full_name?: string;
  email: string;
  phone?: string | null;
  status: string;
  email_verified_at?: string | null;
  created_at?: string | null;
}

export interface UserSessionResourceDTO {
  id: number;
  name: string;
  abilities: string[];
  created_at?: string | null;
  last_used_at?: string | null;
  expires_at?: string | null;
}

export interface SessionDTO {
  id: number;
  device_name?: string | null;
  ip_address?: string | null;
  last_activity?: number | null;
}
