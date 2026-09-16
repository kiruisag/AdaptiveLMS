import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../../stores/auth.store';
import { TenantDTO } from '../../types/api.types';

interface TenantContextType {
  tenant: TenantDTO | null;
  setTenant: (tenant: TenantDTO) => void;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { activeTenant, setActiveTenant, isLoading } = useAuth();

  const value = {
    tenant: activeTenant,
    setTenant: setActiveTenant,
    isLoading
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
