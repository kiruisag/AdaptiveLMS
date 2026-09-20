import test from 'node:test';
import assert from 'node:assert/strict';
import { useAuth } from './auth.store';
import { authApi } from '../services/api/auth.api';
import type { UserDTO, TenantDTO } from '../types/api.types';

test('fresh login establishes auth and avoids duplicate /me validations', async () => {
  const store = useAuth.getState();
  await store.logout();

  let meCalls = 0;
  const originalMe = authApi.me;
  authApi.me = async () => {
    meCalls += 1;
    return {
      id: 'u-1',
      name: 'Alice',
      email: 'alice@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tenants: [
        { id: 'tenant-1', name: 'Acme University', slug: 'acme-u', type: 'university', role: 'learner' },
      ],
      role: 'learner',
    } satisfies UserDTO;
  };

  try {
    store.setAuth({
      id: 'u-1',
      name: 'Alice',
      email: 'alice@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tenants: [
        { id: 'tenant-1', name: 'Acme University', slug: 'acme-u', type: 'university', role: 'learner' },
      ],
      role: 'learner',
    } satisfies UserDTO, 'token-123');

    await store.checkAuth();
    assert.equal(meCalls, 0);

    await store.checkAuth(true);
    assert.equal(meCalls, 1);
  } finally {
    authApi.me = originalMe;
    await store.logout();
  }
});

test('missing auth token is treated as logged out without calling /me', async () => {
  const store = useAuth.getState();
  await store.logout();

  const originalMe = authApi.me;
  let meCalls = 0;
  authApi.me = async () => {
    meCalls += 1;
    return {
      id: 'u-1',
      name: 'Alice',
      email: 'alice@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tenants: [],
      role: 'learner',
    } satisfies UserDTO;
  };

  try {
    await store.checkAuth();

    assert.equal(meCalls, 0);
    assert.equal(store.isAuthenticated, false);
    assert.equal(store.isLoading, false);
    assert.equal(store.user, null);
  } finally {
    authApi.me = originalMe;
    await store.logout();
  }
});

test('tenant selection does not mutate the user identity', async () => {
  const store = useAuth.getState();
  await store.logout();

  const user: UserDTO = {
    id: 'u-1',
    name: 'Alice',
    email: 'alice@example.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tenants: [
      { id: 'tenant-1', name: 'Acme University', slug: 'acme-u', type: 'university', role: 'learner' },
      { id: 'tenant-2', name: 'Acme Training', slug: 'acme-training', type: 'corporate', role: 'instructor' },
    ] satisfies TenantDTO[],
    role: 'learner',
  };

  store.setAuth(user, 'token-123');
  store.setActiveTenant(user.tenants[1]);

  assert.equal(store.user?.role, 'learner');
  assert.equal(store.activeTenant?.id, 'tenant-2');
  assert.equal(store.activeTenant?.role, 'instructor');

  await store.logout();
});
