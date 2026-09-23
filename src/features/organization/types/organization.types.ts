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

export type OrganizationListResponse =
  PaginatedResponse<Organization>;

export type OrganizationMemberStatus =
  | 'INVITED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'LEFT';

export interface OrganizationMemberUser {
  id: string | number;
  uuid: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  email: string | null;
}

export interface OrganizationMember {
  user_id: string | number;
  organization_id: string | number;
  status: OrganizationMemberStatus | string;
  user?: OrganizationMemberUser | null;
  joined_at?: string | null;
  invitation_expires_at?: string | null;
  invitation_accepted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export type OrganizationMemberDetail =
  OrganizationMember;

export type OrganizationMembersResponse =
  PaginatedResponse<OrganizationMember>;

export interface OrganizationRole {
  id: number;
  name: string;
  guard_name: string;
  team_id: number | null;
  permissions: string[];
}

export interface OrganizationMemberRolesResponse {
  data: OrganizationRole[];
}

export interface AssignMemberRolePayload {
  role_id: number;
}

export interface AssignMemberRoleResponse {
  role: OrganizationRole;
}

export interface RemoveMemberRoleResponse {
  role: OrganizationRole;
}

export interface CreateOrganizationAdministratorPayload {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  phone?: string | null;
}

export interface OrganizationPayload {
  name: string;
  slug: string;
  settings?: Record<string, unknown> | null;
  administrator: CreateOrganizationAdministratorPayload;
}

export interface InviteMemberPayload {
  user_id: number;
  metadata?: Record<string, unknown> | null;
}