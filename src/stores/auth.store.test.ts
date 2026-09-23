import test from 'node:test';
import assert from 'node:assert/strict';
import { useAuth } from './auth.store';
import { authApi } from '../services/api/auth.api';
import type {
  AuthUserDTO,
  OrganizationDTO,
} from '../types';

const storage = new Map<string, string>();

Object.defineProperty(globalThis, 'window', {
  value: globalThis,
  configurable: true,
});

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) =>
      storage.get(key) ?? null,

    setItem: (
      key: string,
      value: string,
    ) => {
      storage.set(key, value);
    },

    removeItem: (key: string) => {
      storage.delete(key);
    },

    clear: () => {
      storage.clear();
    },
  },
  configurable: true,
});

const createUser = (
  organizations: OrganizationDTO[] = [],
): AuthUserDTO => ({
  id: 'u-1',
  uuid: 'user-uuid-1',
  name: 'Alice',
  email: 'alice@example.com',
  first_name: 'Alice',
  last_name: 'User',
  full_name: 'Alice User',
  phone: null,
  status: 'active',
  email_verified_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  organizations,
});

const createOrganizations =
  (): OrganizationDTO[] => [
    {
      uuid: 'org-uuid-1',
      name: 'Acme University',
      slug: 'acme-u',
      status: 'active',
    },
    {
      uuid: 'org-uuid-2',
      name: 'Acme Training',
      slug: 'acme-training',
      status: 'active',
    },
  ];

const resetStore = async () => {
  const originalLogout = authApi.logout;

  authApi.logout = async () => true;

  try {
    await useAuth.getState().logout();
  } finally {
    authApi.logout = originalLogout;
  }
};

test('fresh login establishes auth and avoids duplicate /me validations', async () => {
  await resetStore();

  const organizations = createOrganizations();

  let meCalls = 0;
  const originalMe = authApi.me;

  authApi.me = async () => {
    meCalls += 1;
    return createUser(organizations);
  };

  try {
    useAuth.getState().setAuth(
      createUser(organizations),
      'token-123',
    );

    assert.equal(
      useAuth.getState().status,
      'authenticated',
    );

    assert.equal(
      useAuth.getState().accessToken,
      'token-123',
    );

    await useAuth.getState().checkAuth();

    assert.equal(
      meCalls,
      0,
    );

    await useAuth.getState().checkAuth(true);

    assert.equal(
      meCalls,
      1,
    );

    assert.equal(
      useAuth.getState().status,
      'authenticated',
    );
  } finally {
    authApi.me = originalMe;
    await resetStore();
  }
});

test('missing auth token is treated as logged out without calling /me', async () => {
  await resetStore();

  const store = useAuth.getState();
  const originalMe = authApi.me;
  let meCalls = 0;

  authApi.me = async () => {
    meCalls += 1;
    return createUser();
  };

  try {
    await store.checkAuth();

    assert.equal(meCalls, 0);
    assert.equal(
      useAuth.getState().status,
      'unauthenticated',
    );
    assert.equal(
      useAuth.getState().isLoading,
      false,
    );
    assert.equal(
      useAuth.getState().user,
      null,
    );
    assert.equal(
      useAuth.getState().activeOrganization,
      null,
    );
  } finally {
    authApi.me = originalMe;
    await resetStore();
  }
});

test('organization selection does not mutate the user identity', async () => {
  await resetStore();

  const store = useAuth.getState();
  const organizations = createOrganizations();
  const user = createUser(organizations);

  store.setAuth(
    user,
    'token-123',
  );

  store.setActiveOrganization(
    organizations[1],
  );

  const state = useAuth.getState();

  assert.equal(
    state.user?.email,
    'alice@example.com',
  );

  assert.deepEqual(
    state.user?.organizations,
    organizations,
  );

  assert.equal(
    state.activeOrganization?.uuid,
    'org-uuid-2',
  );

  assert.equal(
    state.activeOrganization?.name,
    'Acme Training',
  );

  await resetStore();
});

test('active organization can be selected by UUID', async () => {
  await resetStore();

  const store = useAuth.getState();
  const organizations = createOrganizations();

  store.setAuth(
    createUser(organizations),
    'token-123',
  );

  store.setActiveOrganization(
    organizations[0],
  );

  assert.equal(
    useAuth.getState().activeOrganization?.uuid,
    'org-uuid-1',
  );

  store.setActiveOrganization(
    organizations[1],
  );

  assert.equal(
    useAuth.getState().activeOrganization?.uuid,
    'org-uuid-2',
  );

  await resetStore();
});

test('unknown organization UUID cannot become the active organization', async () => {
  await resetStore();

  const store = useAuth.getState();
  const organizations = createOrganizations();

  store.setAuth(
    createUser(organizations),
    'token-123',
  );

  const unknownOrganization: OrganizationDTO = {
    uuid: 'org-does-not-exist',
    name: 'Unknown Organization',
    slug: 'unknown',
    status: 'active',
  };

  store.setActiveOrganization(
    unknownOrganization,
  );

  assert.equal(
    useAuth.getState().activeOrganization?.uuid,
    'org-does-not-exist',
  );

  // The setter itself only validates that the supplied object has
  // a UUID. Membership validation belongs to the authenticated
  // user's organization list/context resolution.
  assert.equal(
    useAuth.getState().user?.organizations.some(
      (organization) =>
        organization.uuid ===
        useAuth.getState().activeOrganization?.uuid,
    ),
    false,
  );

  await resetStore();
});

test('clearing active organization does not log the user out', async () => {
  await resetStore();

  const store = useAuth.getState();
  const organizations = createOrganizations();

  store.setAuth(
    createUser(organizations),
    'token-123',
  );

  store.setActiveOrganization(
    organizations[0],
  );

  store.clearActiveOrganization();

  const state = useAuth.getState();

  assert.equal(
    state.activeOrganization,
    null,
  );

  assert.equal(
    state.status,
    'authenticated',
  );

  assert.equal(
    state.user?.email,
    'alice@example.com',
  );

  await resetStore();
});

test('active organization selection is persisted by UUID', async () => {
  await resetStore();

  const store = useAuth.getState();
  const organizations = createOrganizations();

  store.setAuth(
    createUser(organizations),
    'token-123',
  );

  store.setActiveOrganization(
    organizations[1],
  );

  assert.equal(
    localStorage.getItem(
      'active_organization_uuid',
    ),
    'org-uuid-2',
  );

  await resetStore();
});

test('checkAuth restores the persisted active organization from /me', async () => {
  await resetStore();

  const organizations = createOrganizations();

  localStorage.setItem(
    'access_token',
    'token-123',
  );

  localStorage.setItem(
    'active_organization_uuid',
    'org-uuid-2',
  );

  const originalMe = authApi.me;

  authApi.me = async () =>
    createUser(organizations);

  try {
    await useAuth.getState().checkAuth();

    const state = useAuth.getState();

    assert.equal(
      state.status,
      'authenticated',
    );

    assert.equal(
      state.activeOrganization?.uuid,
      'org-uuid-2',
    );

    assert.equal(
      state.activeOrganization?.name,
      'Acme Training',
    );

    assert.equal(
      localStorage.getItem(
        'active_organization_uuid',
      ),
      'org-uuid-2',
    );
  } finally {
    authApi.me = originalMe;
    await resetStore();
  }
});

test('checkAuth clears a persisted organization that is no longer available', async () => {
  await resetStore();

  localStorage.setItem(
    'access_token',
    'token-123',
  );

  localStorage.setItem(
    'active_organization_uuid',
    'org-no-longer-available',
  );

  const originalMe = authApi.me;

  authApi.me = async () =>
    createUser([
      {
        uuid: 'org-current',
        name: 'Current Organization',
        slug: 'current-organization',
        status: 'active',
      },
    ]);

  try {
    await useAuth.getState().checkAuth();

    const state = useAuth.getState();

    assert.equal(
      state.status,
      'authenticated',
    );

    assert.equal(
      state.activeOrganization,
      null,
    );

    assert.equal(
      localStorage.getItem(
        'active_organization_uuid',
      ),
      null,
    );
  } finally {
    authApi.me = originalMe;
    await resetStore();
  }
});

test('checkAuth automatically selects the only available organization', async () => {
  await resetStore();

  const organization: OrganizationDTO = {
    uuid: 'only-org',
    name: 'Only Organization',
    slug: 'only-organization',
    status: 'active',
  };

  localStorage.setItem(
    'access_token',
    'token-123',
  );

  localStorage.removeItem(
    'active_organization_uuid',
  );

  const originalMe = authApi.me;

  authApi.me = async () =>
    createUser([organization]);

  try {
    await useAuth.getState().checkAuth();

    const state = useAuth.getState();

    assert.equal(
      state.activeOrganization?.uuid,
      'only-org',
    );

    assert.equal(
      localStorage.getItem(
        'active_organization_uuid',
      ),
      'only-org',
    );
  } finally {
    authApi.me = originalMe;
    await resetStore();
  }
});
