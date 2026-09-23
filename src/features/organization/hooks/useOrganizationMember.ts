import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../../../services/api/organization.api';

export const organizationMemberDetailKeys = {
  all: ['organization-member'] as const,

  detail: (
    organizationId: string,
    userId: string | number,
  ) => [
    ...organizationMemberDetailKeys.all,
    organizationId,
    userId,
  ] as const,
};

export function useOrganizationMember(
  organizationId: string | null,
  userId: string | number | null,
) {
  return useQuery({
    queryKey:
      organizationId && userId
        ? organizationMemberDetailKeys.detail(
            organizationId,
            userId,
          )
        : ['organization-member', 'disabled'],

    queryFn: () => {
      if (!organizationId || !userId) {
        throw new Error(
          'Organization ID and user ID are required.',
        );
      }

      return organizationApi.getMember(
        organizationId,
        userId,
      );
    },

    enabled: Boolean(
      organizationId && userId,
    ),
  });
}
