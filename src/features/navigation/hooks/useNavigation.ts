import { useQuery } from '@tanstack/react-query';
import { fetchNavigation } from '../../../services/api/navigation.api';
import type { NavigationNode } from '../../../types/api/navigation.types';

export function useNavigation(
  organizationId?: string | null,
  enabled = true,
) {
  const contextKey = organizationId
    ? `organization:${organizationId}`
    : 'platform';

  return useQuery<NavigationNode[]>({
    queryKey: ['navigation', contextKey],
    queryFn: () => fetchNavigation(organizationId),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
