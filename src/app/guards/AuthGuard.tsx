import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { resolveAuthGuardDecision } from './auth-guard';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const {
    status,
    isLoading,
    activeOrganization,
    user,
  } = useAuthStore();

  const location = useLocation();

  const decision = resolveAuthGuardDecision({
    status,
    isLoading,
    hasUser: Boolean(user),
    organizationCount: user?.organizations?.length ?? 0,
    hasActiveOrganization: Boolean(activeOrganization),
    pathname: location.pathname,
  });

  if (decision.type === 'loading') {
    return null;
  }

  if (decision.type === 'redirect') {
    return (
      <Navigate
        to={decision.to}
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}