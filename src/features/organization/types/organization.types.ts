import type { PaginatedResponse } from '../../../types/api.types';

export type OrganizationStatus =
  | 'pending'
  | 'active'
  | 'suspended'
  | 'archived';

export interface Organization {
  uuid: string;
  name: string;
  slug: string;
  status: OrganizationStatus;
  settings?: Record<string, unknown> | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export type OrganizationListResponse = PaginatedResponse<Organization>;

export type OrganizationMemberStatus =
  | 'INVITED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'LEFT';

export interface OrganizationMember {
  user_id: string | number;
  organization_id: string | number;
  status: OrganizationMemberStatus | string;
  joined_at?: string | null;
  invitation_expires_at?: string | null;
  invitation_accepted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export type OrganizationMembersResponse =
  PaginatedResponse<OrganizationMember>;

export interface OrganizationPayload {
  name: string;
  slug: string;
  settings?: Record<string, unknown> | null;
}

export interface InviteMemberPayload {
  user_id: number;
  metadata?: Record<string, unknown> | null;
}
