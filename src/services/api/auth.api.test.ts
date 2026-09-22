import test from 'node:test';
import assert from 'node:assert/strict';
import { toAuthUserDTO } from './auth.api';

test('toAuthUserDTO preserves user data and organizations', () => {
  const user = toAuthUserDTO({
    id: 10,
    uuid: 'user-uuid',
    first_name: 'Kevin',
    last_name: 'Kirui',
    email: 'kevin@example.com',
    organizations: [
      {
        uuid: 'org-uuid-a',
        name: 'Adaptive LMS',
        slug: 'adaptive-lms',
        status: 'active',
      },
      {
        uuid: 'org-uuid-b',
        name: 'Demo Organization',
        slug: 'demo-organization',
        status: 'suspended',
      },
    ],
  });

  assert.equal(user.id, '10');
  assert.equal(user.name, 'Kevin Kirui');
  assert.equal(user.email, 'kevin@example.com');

  assert.deepEqual(
    user.organizations.map(
      (organization) => organization.uuid,
    ),
    [
      'org-uuid-a',
      'org-uuid-b',
    ],
  );
});

test('toAuthUserDTO returns an empty organization list when none is supplied', () => {
  const user = toAuthUserDTO({
    id: 10,
    first_name: 'Kevin',
    last_name: 'Kirui',
    email: 'kevin@example.com',
  });

  assert.deepEqual(
    user.organizations,
    [],
  );
});

test('toAuthUserDTO removes invalid organization records', () => {
  const user = toAuthUserDTO({
    id: 10,
    first_name: 'Kevin',
    last_name: 'Kirui',
    email: 'kevin@example.com',
    organizations: [
      {
        uuid: 'valid-org',
        name: 'Valid Organization',
        slug: 'valid-organization',
        status: 'active',
      },
      {
        name: 'Missing UUID',
        slug: 'missing-uuid',
        status: 'active',
      },
      {
        uuid: 'missing-name',
        slug: 'missing-name',
        status: 'active',
      },
      {
        uuid: 'missing-status',
        name: 'Missing Status',
        slug: 'missing-status',
      },
    ],
  });

  assert.equal(
    user.organizations.length,
    1,
  );

  assert.equal(
    user.organizations[0].uuid,
    'valid-org',
  );
});

test('toAuthUserDTO preserves organization membership data', () => {
  const user = toAuthUserDTO({
    id: 10,
    first_name: 'Kevin',
    last_name: 'Kirui',
    email: 'kevin@example.com',
    organizations: [
      {
        uuid: 'org-uuid',
        name: 'Adaptive LMS',
        slug: 'adaptive-lms',
        status: 'active',
        membership: {
          user_id: 10,
          organization_id: 20,
          status: 'active',
          joined_at: '2026-09-22T10:00:00Z',
        },
      },
    ],
  });

  assert.deepEqual(
    user.organizations[0].membership,
    {
      user_id: 10,
      organization_id: 20,
      status: 'active',
      joined_at: '2026-09-22T10:00:00Z',
    },
  );
});

test('toAuthUserDTO supports the backend data envelope shape', () => {
  const user = toAuthUserDTO({
    user: {
      id: 10,
      first_name: 'Kevin',
      last_name: 'Kirui',
      email: 'kevin@example.com',
      organizations: [
        {
          uuid: 'org-uuid',
          name: 'Adaptive LMS',
          slug: 'adaptive-lms',
          status: 'active',
        },
      ],
    },
  });

  assert.equal(
    user.email,
    'kevin@example.com',
  );

  assert.equal(
    user.organizations[0].uuid,
    'org-uuid',
  );
});
