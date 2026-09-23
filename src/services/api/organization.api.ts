import { apiClient, normalizeApiError } from '../../api/client';

import type {
  AssignMemberRolePayload,
  AssignMemberRoleResponse,
  InviteMemberPayload,
  Organization,
  OrganizationListResponse,
  OrganizationMember,
  OrganizationMemberDetail,
  OrganizationMemberRolesResponse,
  OrganizationMembersResponse,
  OrganizationPayload,
  OrganizationRole,
  RemoveMemberRoleResponse,
} from '../../features/organization/types/organization.types';

function handleApiError(error: unknown): never {
  throw new Error(normalizeApiError(error).message);
}

export const organizationApi = {
  /**
   * List organizations.
   */
  list: async (
    params?: Record<string, string | number>,
  ): Promise<OrganizationListResponse> => {
    try {
      const { data } = await apiClient.get(
        '/organizations',
        { params },
      );

      return data as OrganizationListResponse;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get a single organization.
   */
  get: async (
    organizationId: string,
  ): Promise<Organization> => {
    try {
      const { data } = await apiClient.get(
        `/organizations/${organizationId}`,
      );

      return (data?.data ?? data) as Organization;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Create an organization.
   */
  create: async (
    payload: OrganizationPayload,
  ): Promise<Organization> => {
    try {
      const { data } = await apiClient.post(
        '/organizations',
        payload,
      );

      return (data?.data ?? data) as Organization;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Update an organization.
   */
  update: async (
    organizationId: string,
    payload: Partial<OrganizationPayload>,
  ): Promise<Organization> => {
    try {
      const { data } = await apiClient.patch(
        `/organizations/${organizationId}`,
        payload,
      );

      return (data?.data ?? data) as Organization;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Activate an organization.
   */
  activate: async (
    organizationId: string,
  ): Promise<Organization> => {
    try {
      const { data } = await apiClient.post(
        `/organizations/${organizationId}/activate`,
      );

      return (data?.data ?? data) as Organization;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Suspend an organization.
   */
  suspend: async (
    organizationId: string,
  ): Promise<Organization> => {
    try {
      const { data } = await apiClient.post(
        `/organizations/${organizationId}/suspend`,
      );

      return (data?.data ?? data) as Organization;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Restore an organization.
   */
  restore: async (
    organizationId: string,
  ): Promise<Organization> => {
    try {
      const { data } = await apiClient.post(
        `/organizations/${organizationId}/restore`,
      );

      return (data?.data ?? data) as Organization;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Delete an organization.
   */
  remove: async (
    organizationId: string,
  ): Promise<boolean> => {
    try {
      await apiClient.delete(
        `/organizations/${organizationId}`,
      );

      return true;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * List organization members.
   *
   * Important:
   * The backend returns a Laravel pagination envelope,
   * so the complete response must be returned.
   */
  getMembers: async (
    organizationId: string,
    params?: Record<string, string | number>,
  ): Promise<OrganizationMembersResponse> => {
    try {
      const { data } = await apiClient.get(
        `/organizations/${organizationId}/members`,
        { params },
      );

      return data as OrganizationMembersResponse;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
 * List roles available in an organization.
 */
getRoles: async (
  organizationId: string,
): Promise<{
  data: OrganizationRole[];
}> => {
  try {
    const { data } = await apiClient.get(
      `/organizations/${organizationId}/roles`,
    );

    return data as {
      data: OrganizationRole[];
    };
  } catch (error) {
    return handleApiError(error);
  }
},
  /**
   * Get one organization member.
   */
  getMember: async (
    organizationId: string,
    userId: string | number,
  ): Promise<OrganizationMemberDetail> => {
    try {
      const { data } = await apiClient.get(
        `/organizations/${organizationId}/members/${userId}`,
      );

      return (data?.data ?? data) as OrganizationMemberDetail;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Get roles assigned to an organization member.
   */
  getMemberRoles: async (
    organizationId: string,
    userId: string | number,
  ): Promise<OrganizationMemberRolesResponse> => {
    try {
      const { data } = await apiClient.get(
        `/organizations/${organizationId}/members/${userId}/roles`,
      );

      return data as OrganizationMemberRolesResponse;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Assign an organization role to a member.
   */
  assignMemberRole: async (
    organizationId: string,
    userId: string | number,
    payload: AssignMemberRolePayload,
  ): Promise<AssignMemberRoleResponse> => {
    try {
      const { data } = await apiClient.post(
        `/organizations/${organizationId}/members/${userId}/roles`,
        payload,
      );

      return (data?.data ?? data) as AssignMemberRoleResponse;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Remove an organization role from a member.
   */
  removeMemberRole: async (
    organizationId: string,
    userId: string | number,
    roleId: string | number,
  ): Promise<RemoveMemberRoleResponse> => {
    try {
      const { data } = await apiClient.delete(
        `/organizations/${organizationId}/members/${userId}/roles/${roleId}`,
      );

      return (data?.data ?? data) as RemoveMemberRoleResponse;
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Invite a member to an organization.
   */
  inviteMember: async (
    organizationId: string,
    payload: InviteMemberPayload,
  ): Promise<{
    membership: OrganizationMember;
    invitation_token: string;
  }> => {
    try {
      const { data } = await apiClient.post(
        `/organizations/${organizationId}/members/invitations`,
        payload,
      );

      return data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },
};