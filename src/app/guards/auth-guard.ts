export type AuthGuardStatus =
  | 'unauthenticated'
  | 'mfa_pending'
  | 'authenticated';

export interface AuthGuardDecisionInput {
  status: AuthGuardStatus;
  isLoading: boolean;
  hasUser: boolean;
  organizationCount: number;
  hasActiveOrganization: boolean;
  pathname: string;
}

export type AuthGuardDecision =
  | {
      type: 'loading';
    }
  | {
      type: 'redirect';
      to: string;
    }
  | {
      type: 'allow';
    };

export function resolveAuthGuardDecision(
  input: AuthGuardDecisionInput,
): AuthGuardDecision {
  if (input.isLoading) {
    return {
      type: 'loading',
    };
  }

  if (
    input.status === 'unauthenticated' ||
    !input.hasUser
  ) {
    return {
      type: 'redirect',
      to: '/auth/login',
    };
  }

  if (input.status === 'mfa_pending') {
    return {
      type: 'redirect',
      to: '/auth/mfa',
    };
  }

  if (
    input.organizationCount > 1 &&
    !input.hasActiveOrganization &&
    input.pathname !== '/auth/select-organization'
  ) {
    return {
      type: 'redirect',
      to: '/auth/select-organization',
    };
  }

  return {
    type: 'allow',
  };
}