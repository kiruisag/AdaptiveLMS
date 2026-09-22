import { apiClient, normalizeApiError } from '../../api/client';
import type { ApiEnvelope } from '../../types/api.types';
import type {
  InviteMemberPayload,
  Organization,
  OrganizationListResponse,
  OrganizationMember,
  OrganizationMembersResponse,
  OrganizationPayload,
} from '../../features/organization/types/organization.types';

function handleApiError(error: unknown): never {
  throw new Error(normalizeApiError(error).message);
}

export const organizationApi = {
  list: async (
    params?: Record<string, string | number>,
  ): Promise<OrganizationListResponse> => {
    try {
      const { data } = await apiClient.get('/organizations', { params });

      return data as OrganizationListResponse;
    } catch (error) {
      return handleApiError(error);
    }
  },

  get: async (organizationId: string): Promise<Organization> => {
    try {
      const { data } = await apiClient.get(
        `/organizations/${organizationId}`,
      );

      return (data?.data ?? data) as Organization;
    } catch (error) {
      return handleApiError(error);
    }
  },

  create: async (
    payload: OrganizationPayload,
  ): Promise<Organization> => {
    try {
      const { data } = await apiClient.post('/organizations', payload);

      return (data?.data ?? data) as Organization;
    } catch (error) {
      return handleApiError(error);
    }
  },

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

  activate: async (organizationId: string): Promise<Organization> => {
    try {
      const { data } = await apiClient.post(
        `/organizations/${organizationId}/activate`,
      );

      return (data?.data ?? data) as Organization;
    } catch (error) {
      return handleApiError(error);
    }
  },

  suspend: async (organizationId: string): Promise<Organization> => {
    try {
      const { data } = await apiClient.post(
        `/organizations/${organizationId}/suspend`,
      );

      return (data?.data ?? data) as Organization;
    } catch (error) {
      return handleApiError(error);
    }
  },

  restore: async (organizationId: string): Promise<Organization> => {
    try {
      const { data } = await apiClient.post(
        `/organizations/${organizationId}/restore`,
      );

      return (data?.data ?? data) as Organization;
    } catch (error) {
      return handleApiError(error);
    }
  },

  remove: async (organizationId: string): Promise<boolean> => {
    try {
      await apiClient.delete(`/organizations/${organizationId}`);

      return true;
    } catch (error) {
      return handleApiError(error);
    }
  },

  getMembers: async (
    organizationId: string,
    params?: Record<string, string | number>,
  ): Promise<OrganizationMembersResponse> => {
    try {
      const { data } = await apiClient.get(
        `/organizations/${organizationId}/members`,
        { params },
      );

      return (data?.data ?? data) as OrganizationMembersResponse;
    } catch (error) {
      return handleApiError(error);
    }
  },

  inviteMember: async (
    organizationId: string,
    payload: InviteMemberPayload,
  ): Promise<
    ApiEnvelope<{
      membership: OrganizationMember;
      invitation_token: string;
    }>
  > => {
    try {
      const { data } = await apiClient.post(
        `/organizations/${organizationId}/members/invitations`,
        payload,
      );

      return (data?.data ?? data) as ApiEnvelope<{
        membership: OrganizationMember;
        invitation_token: string;
      }>;
    } catch (error) {
      return handleApiError(error);
    }
  },
};
