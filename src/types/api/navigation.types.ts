export type NavigationScope = 'platform' | 'organization' | 'shared';
export type NavigationNodeType = 'group' | 'link';

export interface NavigationNode {
  key: string;
  name: string;
  icon?: string | null;
  url?: string | null;
  type?: NavigationNodeType | null;
  scope?: NavigationScope | null;
  status?: string | null;
  sort_order?: number | null;
  children?: NavigationNode[];
  metadata?: Record<string, unknown> | null;
}

export interface NavigationApiEnvelope {
  data: NavigationNode[];
  message?: string;
}
