import { apiClient, normalizeApiError } from '../../api/client';
import type { ApiEnvelope, PaginatedResponse, UserDTO, OrganizationDTO } from '../../types/api.types';

export interface OrganizationMemberDTO {
  user_id: number;
  organization_id: number;
  status: 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'LEFT';
  joined_at?: string | null;
  invitation_expires_at?: string | null;
  invitation_accepted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface OrganizationPayload {
  name: string;
  slug: string;
  settings?: Record<string, unknown> | null;
}

export const organizationApi = {
  list: async (params?: Record<string, string | number>) => {
    try {
      const { data } = await apiClient.get('/organizations', { params });
      return (data?.data ?? data) as PaginatedResponse<OrganizationDTO>;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  get: async (organizationId: string) => {
    try {
      const { data } = await apiClient.get(`/organizations/${organizationId}`);
      return (data?.data ?? data) as OrganizationDTO;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  create: async (payload: OrganizationPayload) => {
    try {
      const { data } = await apiClient.post('/organizations', payload);
      return (data?.data ?? data) as OrganizationDTO;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  update: async (organizationId: string, payload: Partial<OrganizationPayload>) => {
    try {
      const { data } = await apiClient.patch(`/organizations/${organizationId}`, payload);
      return (data?.data ?? data) as OrganizationDTO;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  activate: async (organizationId: string) => {
    try {
      const { data } = await apiClient.post(`/organizations/${organizationId}/activate`);
      return (data?.data ?? data) as OrganizationDTO;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  suspend: async (organizationId: string) => {
    try {
      const { data } = await apiClient.post(`/organizations/${organizationId}/suspend`);
      return (data?.data ?? data) as OrganizationDTO;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  restore: async (organizationId: string) => {
    try {
      const { data } = await apiClient.post(`/organizations/${organizationId}/restore`);
      return (data?.data ?? data) as OrganizationDTO;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  remove: async (organizationId: string) => {
    try {
      await apiClient.delete(`/organizations/${organizationId}`);
      return true;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  getMembers: async (organizationId: string, params?: Record<string, string | number>) => {
    try {
      const { data } = await apiClient.get(`/organizations/${organizationId}/members`, { params });
      return (data?.data ?? data) as PaginatedResponse<OrganizationMemberDTO>;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },

  inviteMember: async (organizationId: string, payload: { user_id: number; metadata?: Record<string, unknown> | null }) => {
    try {
      const { data } = await apiClient.post(`/organizations/${organizationId}/members/invitations`, payload);
      return (data?.data ?? data) as ApiEnvelope<{
        membership: OrganizationMemberDTO;
        invitation_token: string;
      }>;
    } catch (error) {
      throw new Error(normalizeApiError(error).message);
    }
  },
};
