export interface UpdateProfilePayload {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  phone?: string | null;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileFormValues {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  phone: string;
}