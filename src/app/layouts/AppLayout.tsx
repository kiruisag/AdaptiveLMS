import React, { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Menu } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { GlobalSearch } from '../../components/ui/GlobalSearch';
import { NotificationBell } from '../../components/ui/NotificationBell';
import { UserMenu } from '../../components/ui/UserMenu';
import { AppSidebar } from '../../components/navigation/AppSidebar';
import { useAuth } from '../../stores/auth.store';
import { useOrganization } from '../providers/OrganizationProvider';
import { useUiStore } from '../../stores/ui.store';

export function AppLayout() {
  const { user } = useAuth();

  const {
    organizations,
    activeOrganization,
    setActiveOrganization,
  } = useOrganization();

  const { mobileNavOpen, setMobileNavOpen } = useUiStore();

  const queryClient = useQueryClient();

  const [showOrganizationMenu, setShowOrganizationMenu] =
    useState(false);

  const organizationMenuRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        organizationMenuRef.current &&
        !organizationMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setShowOrganizationMenu(false);
      }
    }

    if (showOrganizationMenu) {
      document.addEventListener(
        'mousedown',
        handleClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, [showOrganizationMenu]);

  return (
    <div className="absolute inset-0 bg-slate-50 flex flex-col md:flex-row">
      <AppSidebar />

      {mobileNavOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/30 md:hidden"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />

          <AppSidebar
            mobile
            onClose={() => setMobileNavOpen(false)}
          />
        </>
      )}

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 gap-4 z-50 relative">
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden md:block overflow-hidden min-w-max mr-4">
            <Breadcrumbs />
          </div>

          <div className="flex-1 max-w-xl">
            <GlobalSearch />
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            {organizations.length > 1 && (
              <div
                className="relative"
                ref={organizationMenuRef}
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowOrganizationMenu(
                      (value) => !value,
                    )
                  }
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="max-w-[140px] truncate">
                    {activeOrganization?.name ??
                      'Select organization'}
                  </span>
                </button>

                {showOrganizationMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg z-50 overflow-hidden">
                    <div className="border-b border-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Switch organization
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {organizations.map(
                        (organization) => (
                          <button
                            key={organization.uuid}
                            type="button"
                            onClick={() => {
                              if (
                                activeOrganization?.uuid !==
                                organization.uuid
                              ) {
                                setActiveOrganization(
                                  organization,
                                );

                                queryClient.invalidateQueries({
                                  queryKey: ['navigation'],
                                });
                              }

                              setShowOrganizationMenu(false);
                            }}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                              activeOrganization?.uuid ===
                              organization.uuid
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="truncate">
                              {organization.name}
                            </span>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <NotificationBell />
            <UserMenu />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
