import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

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

  if (isLoading) {
    return null;
  }

  if (status === 'unauthenticated' || !user) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (status === 'mfa_pending') {
    return (
      <Navigate
        to="/auth/mfa"
        replace
      />
    );
  }

  const organizations = user.organizations ?? [];

  const hasMultipleOrganizations =
    organizations.length > 1;

  if (
    hasMultipleOrganizations &&
    !activeOrganization &&
    location.pathname !== '/auth/select-organization'
  ) {
    return (
      <Navigate
        to="/auth/select-organization"
        replace
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}
