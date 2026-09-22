import { apiClient } from '../../api/client';
import type { NavigationApiEnvelope, NavigationNode } from '../../types/api/navigation.types';

export function normalizeNavigationTree(nodes: NavigationNode[] | null | undefined): NavigationNode[] {
  if (!Array.isArray(nodes)) return [];

  return nodes
    .filter(Boolean)
    .map((node) => ({
      key: node.key ?? 'unnamed',
      name: node.name ?? 'Untitled',
      icon: node.icon ?? null,
      url: node.url ?? '#',
      type: node.type ?? (node.url && node.url !== '#' ? 'link' : 'group'),
      scope: node.scope ?? 'shared',
      status: node.status ?? 'active',
      sort_order: node.sort_order ?? 0,
      metadata: node.metadata ?? null,
      children: normalizeNavigationTree(node.children ?? []),
    }))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export async function fetchNavigation(
  organizationId?: string | null,
): Promise<NavigationNode[]> {
  const { data } = await apiClient.get<NavigationApiEnvelope>(
    '/navigation',
  );

  return normalizeNavigationTree(
    data?.data ?? (Array.isArray(data) ? data : []),
  );
}
