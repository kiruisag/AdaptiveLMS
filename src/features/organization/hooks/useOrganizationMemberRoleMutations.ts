import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { organizationApi } from '../../../services/api/organization.api';

import {
  organizationMemberRoleKeys,
} from './useOrganizationMemberRoles';

export function useAssignMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      userId,
      roleId,
    }: {
      organizationId: string;
      userId: string | number;
      roleId: number;
    }) =>
      organizationApi.assignMemberRole(
        organizationId,
        userId,
        {
          role_id: roleId,
        },
      ),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey:
          organizationMemberRoleKeys.list(
            variables.organizationId,
            variables.userId,
          ),
      });
    },
  });
}

export function useRemoveMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      organizationId,
      userId,
      roleId,
    }: {
      organizationId: string;
      userId: string | number;
      roleId: number;
    }) =>
      organizationApi.removeMemberRole(
        organizationId,
        userId,
        roleId,
      ),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey:
          organizationMemberRoleKeys.list(
            variables.organizationId,
            variables.userId,
          ),
      });
    },
  });
}
