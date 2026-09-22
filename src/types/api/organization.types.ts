export type OrganizationMembershipStatus =
  | 'invited'
  | 'active'
  | 'suspended'
  | 'left';

export type OrganizationStatus =
  | 'pending'
  | 'active'
  | 'suspended'
  | 'archived';

export interface OrganizationMembershipDTO {
  id?: string | number;
  user_id?: string | number;
  organization_id?: string | number;
  status: OrganizationMembershipStatus;
  joined_at?: string | null;
  invitation_expires_at?: string | null;
  invitation_accepted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface OrganizationDTO {
  uuid: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  membership?: OrganizationMembershipDTO;
  settings?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface OrganizationMembershipResourceDTO {
  user_id: string | number;
  organization_id: string | number;
  status: string;
  joined_at?: string | null;
  invitation_expires_at?: string | null;
  invitation_accepted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}
