import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, activeTenant, user, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><LoadingSpinner size="lg" text="Authenticating..." /></div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const hasMultiTenantSelection = Array.isArray(user.tenants) && user.tenants.length > 1;
  const requiresTenantSelection = hasMultiTenantSelection && !activeTenant && location.pathname !== '/auth/select-organization';

  if (requiresTenantSelection) {
    return <Navigate to="/auth/select-organization" replace />;
  }

  return <>{children}</>;
}

export function RoleGuard({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) {
  const { user, activeTenant } = useAuthStore();
  const currentRole = activeTenant?.role ?? user?.role ?? null;

  if (!user || !currentRole || !allowedRoles.includes(currentRole)) {
    return <Navigate to="/auth/select-organization" replace />;
  }

  return <>{children}</>;
}
