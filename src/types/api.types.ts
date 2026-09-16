export type UserRole =
  | 'learner'
  | 'instructor'
  | 'org_admin'
  | 'sys_admin';

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
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  tenants: TenantDTO[];
  role?: UserRole;
  membership?: TenantMembershipDTO;
}
