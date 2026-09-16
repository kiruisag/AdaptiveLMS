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

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: "learner" | "instructor" | "org_admin" | "sys_admin";
  organization_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
