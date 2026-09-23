import test from 'node:test';
import assert from 'node:assert/strict';

import {
  resolveAuthGuardDecision,
} from './auth-guard';

const authenticated = {
  status: 'authenticated' as const,
  isLoading: false,
  hasUser: true,
  organizationCount: 0,
  hasActiveOrganization: false,
  pathname: '/',
};

test('AuthGuard shows loading while authentication state is loading', () => {
  const result = resolveAuthGuardDecision({
    ...authenticated,
    isLoading: true,
  });

  assert.deepEqual(result, {
    type: 'loading',
  });
});

test('AuthGuard redirects unauthenticated users to login', () => {
  const result = resolveAuthGuardDecision({
    ...authenticated,
    status: 'unauthenticated',
    hasUser: false,
  });

  assert.deepEqual(result, {
    type: 'redirect',
    to: '/auth/login',
  });
});

test('AuthGuard redirects MFA-pending users to MFA', () => {
  const result = resolveAuthGuardDecision({
    ...authenticated,
    status: 'mfa_pending',
  });

  assert.deepEqual(result, {
    type: 'redirect',
    to: '/auth/mfa',
  });
});

test('AuthGuard requires organization selection for multiple organizations', () => {
  const result = resolveAuthGuardDecision({
    ...authenticated,
    organizationCount: 2,
    hasActiveOrganization: false,
    pathname: '/dashboard',
  });

  assert.deepEqual(result, {
    type: 'redirect',
    to: '/auth/select-organization',
  });
});

test('AuthGuard allows the organization selection page itself', () => {
  const result = resolveAuthGuardDecision({
    ...authenticated,
    organizationCount: 2,
    hasActiveOrganization: false,
    pathname: '/auth/select-organization',
  });

  assert.deepEqual(result, {
    type: 'allow',
  });
});

test('AuthGuard allows authenticated users with an active organization', () => {
  const result = resolveAuthGuardDecision({
    ...authenticated,
    organizationCount: 2,
    hasActiveOrganization: true,
    pathname: '/dashboard',
  });

  assert.deepEqual(result, {
    type: 'allow',
  });
});

test('AuthGuard allows authenticated users with one organization', () => {
  const result = resolveAuthGuardDecision({
    ...authenticated,
    organizationCount: 1,
    hasActiveOrganization: false,
    pathname: '/dashboard',
  });

  assert.deepEqual(result, {
    type: 'allow',
  });
});

test('AuthGuard allows authenticated platform users with no organizations', () => {
  const result = resolveAuthGuardDecision({
    ...authenticated,
    organizationCount: 0,
    hasActiveOrganization: false,
    pathname: '/dashboard',
  });

  assert.deepEqual(result, {
    type: 'allow',
  });
});