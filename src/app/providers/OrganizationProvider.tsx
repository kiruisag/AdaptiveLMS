import React, {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import {
  useAuth,
} from '../../stores/auth.store';
import type {
  OrganizationDTO,
} from '../../types';

interface OrganizationContextType {
  organizations: OrganizationDTO[];
  activeOrganization: OrganizationDTO | null;
  hasOrganizations: boolean;
  isLoading: boolean;
  setActiveOrganization: (
    organization: OrganizationDTO,
  ) => void;
  clearActiveOrganization: () => void;
}

const OrganizationContext =
  createContext<OrganizationContextType | undefined>(
    undefined,
  );

export function OrganizationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    user,
    activeOrganization,
    setActiveOrganization,
    clearActiveOrganization,
    isLoading,
  } = useAuth();

  const organizations =
    user?.organizations ?? [];

  const value: OrganizationContextType = {
    organizations,
    activeOrganization,
    hasOrganizations:
      organizations.length > 0,
    isLoading,
    setActiveOrganization,
    clearActiveOrganization,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context =
    useContext(OrganizationContext);

  if (context === undefined) {
    throw new Error(
      'useOrganization must be used within an OrganizationProvider',
    );
  }

  return context;
}
