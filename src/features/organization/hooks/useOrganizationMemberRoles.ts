import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../../../services/api/organization.api';

export const organizationMemberRoleKeys = {
  all: ['organization-member-roles'] as const,

  list: (
    organizationId: string,
    userId: string | number,
  ) => [
    ...organizationMemberRoleKeys.all,
    organizationId,
    userId,
  ] as const,
};

export function useOrganizationMemberRoles(
  organizationId: string | null,
  userId: string | number | null,
) {
  return useQuery({
    queryKey:
      organizationId && userId
        ? organizationMemberRoleKeys.list(
            organizationId,
            userId,
          )
        : ['organization-member-roles', 'disabled'],

    queryFn: () => {
      if (!organizationId || !userId) {
        throw new Error(
          'Organization ID and user ID are required.',
        );
      }

      return organizationApi.getMemberRoles(
        organizationId,
        userId,
      );
    },

    enabled: Boolean(
      organizationId && userId,
    ),
  });
}
