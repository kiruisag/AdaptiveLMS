import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACTIVE_ORGANIZATION_KEY,
  getActiveOrganizationUuid,
  resolveOrganizationHeader,
} from './organization-context';

function createStorage(
  value: string | null,
): Pick<Storage, 'getItem'> {
  return {
    getItem: (key: string) =>
      key === ACTIVE_ORGANIZATION_KEY
        ? value
        : null,
  };
}

test('returns the active organization UUID from storage', () => {
  const storage = createStorage(
    'org-uuid-123',
  );

  assert.equal(
    getActiveOrganizationUuid(storage),
    'org-uuid-123',
  );
});

test('returns null when no organization is active', () => {
  const storage = createStorage(null);

  assert.equal(
    getActiveOrganizationUuid(storage),
    null,
  );
});

test('creates X-Organization-ID header for active organization', () => {
  assert.deepEqual(
    resolveOrganizationHeader(
      'org-uuid-123',
    ),
    {
      'X-Organization-ID': 'org-uuid-123',
    },
  );
});

test('does not create organization header without active organization', () => {
  assert.deepEqual(
    resolveOrganizationHeader(null),
    {},
  );

  assert.deepEqual(
    resolveOrganizationHeader(undefined),
    {},
  );

  assert.deepEqual(
    resolveOrganizationHeader(''),
    {},
  );
});

test('organization UUID is never converted into a query parameter', () => {
  const headers =
    resolveOrganizationHeader(
      'org-uuid-123',
    );

  assert.equal(
    headers['X-Organization-ID'],
    'org-uuid-123',
  );

  assert.equal(
    'organization' in headers,
    false,
  );

  assert.equal(
    'scope' in headers,
    false,
  );

  assert.equal(
    'X-Tenant-ID' in headers,
    false,
  );
});
