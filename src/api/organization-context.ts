export const ACTIVE_ORGANIZATION_KEY =
  'active_organization_uuid';

export function getActiveOrganizationUuid(
  storage: Pick<Storage, 'getItem'> | undefined =
    typeof window !== 'undefined'
      ? window.localStorage
      : undefined,
): string | null {
  return (
    storage?.getItem(
      ACTIVE_ORGANIZATION_KEY,
    ) ?? null
  );
}

export function resolveOrganizationHeader(
  organizationUuid: string | null | undefined,
): Record<string, string> {
  if (!organizationUuid) {
    return {};
  }

  return {
    'X-Organization-ID': organizationUuid,
  };
}
