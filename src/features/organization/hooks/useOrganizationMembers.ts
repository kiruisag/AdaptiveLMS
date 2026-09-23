import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../../../services/api/organization.api';

export const organizationMemberKeys = {
  all: ['organization-members'] as const,

  list: (
    organizationId: string,
    params?: Record<string, string | number>,
  ) => [
    ...organizationMemberKeys.all,
    organizationId,
    params ?? {},
  ] as const,
};

export function useOrganizationMembers(
  organizationId: string | null,
  params?: Record<string, string | number>,
) {
  return useQuery({
    queryKey: organizationId
      ? organizationMemberKeys.list(
          organizationId,
          params,
        )
      : ['organization-members', 'disabled'],

    queryFn: () => {
      if (!organizationId) {
        throw new Error(
          'Organization ID is required.',
        );
      }

      return organizationApi.getMembers(
        organizationId,
        params,
      );
    },

    enabled: Boolean(organizationId),
  });
}