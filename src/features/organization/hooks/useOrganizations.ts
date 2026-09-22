import { useQuery } from '@tanstack/react-query';
import { organizationApi } from '../../../services/api/organization.api';

export const organizationKeys = {
  all: ['organizations'] as const,
  list: (params?: Record<string, string | number>) =>
    [...organizationKeys.all, 'list', params ?? {}] as const,
  detail: (uuid: string) =>
    [...organizationKeys.all, 'detail', uuid] as const,
};

export function useOrganizations(
  params?: Record<string, string | number>,
) {
  return useQuery({
    queryKey: organizationKeys.list(params),
    queryFn: () => organizationApi.list(params),
  });
}
