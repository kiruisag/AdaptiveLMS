import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../../../services/api/organization.api';

export const organizationRoleKeys = {
  all: ['organization-roles'] as const,

  list: (organizationId: string) =>
    [
      ...organizationRoleKeys.all,
      organizationId,
    ] as const,
};

export function useOrganizationRoles(
  organizationId: string | null,
) {
  return useQuery({
    queryKey: organizationId
      ? organizationRoleKeys.list(organizationId)
      : ['organization-roles', 'disabled'],

    queryFn: () => {
      if (!organizationId) {
        throw new Error(
          'Organization ID is required.',
        );
      }

      return organizationApi.getRoles(
        organizationId,
      );
    },

    enabled: Boolean(organizationId),
  });
}
