import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';
import { useNavigation } from '../../features/navigation/hooks/useNavigation';
import { NavigationTree } from './NavigationTree';
import { NavigationIcon } from './NavigationIcon';

type AppSidebarProps = {
  mobile?: boolean;
  onClose?: () => void;
};

export function AppSidebar({ mobile = false, onClose }: AppSidebarProps) {
  const { user, activeOrganization, status } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed, setMobileNavOpen } = useUiStore();
  const containerRef = useRef<HTMLElement | null>(null);
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});
  const organizationId = activeOrganization?.uuid ?? null;
  const isAuthenticated = status === 'authenticated';
  const { data, isLoading, error, refetch } = useNavigation(
    organizationId,
    isAuthenticated && !!user,
  );

  const navNodes = useMemo(() => data ?? [], [data]);

  useEffect(() => {
    if (!mobile) return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current || containerRef.current.contains(event.target as Node)) {
        return;
      }
      setMobileNavOpen(false);
      onClose?.();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileNavOpen(false);
        onClose?.();
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobile, onClose, setMobileNavOpen]);

  useEffect(() => {
    if (!mobile) {
      const handleDocumentClick = (event: MouseEvent) => {
        const target = event.target as Node;
        if (containerRef.current && !containerRef.current.contains(target)) {
          setOpenKeys({});
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setOpenKeys({});
        }
      };

      document.addEventListener('mousedown', handleDocumentClick);
      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('mousedown', handleDocumentClick);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [mobile]);

  const handleClose = () => {
    setMobileNavOpen(false);
    onClose?.();
  };

  const body = (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-indigo-600 p-2 text-white">
            <NavigationIcon name="dashboard" className="h-4 w-4" />
          </div>
          {!mobile && !sidebarCollapsed && <div className="text-sm font-semibold text-slate-900">Adaptive LMS</div>}
        </div>
        {mobile ? (
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md border border-slate-200 p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Close navigation menu"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-md border border-slate-200 p-1 text-slate-500 hover:bg-slate-50"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {isLoading && (
          <div className="space-y-3">
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <div className="font-medium">Unable to load navigation</div>
            <button type="button" onClick={() => void refetch()} className="mt-2 text-red-700 underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && navNodes.length > 0 && (
          <NavigationTree
            nodes={navNodes}
            collapsed={sidebarCollapsed}
            mobile={mobile}
            openKeys={openKeys}
            setOpenKeys={setOpenKeys}
            onSelect={mobile ? handleClose : undefined}
          />
        )}
      </div>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {user?.name?.slice(0, 1) ?? 'U'}
          </div>
          {!sidebarCollapsed && !mobile && (
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-slate-900">{user?.name ?? 'User'}</div>
              <div className="truncate text-xs text-slate-500">{activeOrganization?.name ?? 'No organization'}</div>
            </div>
          )}
          {!mobile && !sidebarCollapsed && (
            <button type="button" aria-label="Expand account menu" className="rounded-md p-1 text-slate-500 hover:bg-slate-100">
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </>
  );

  if (mobile) {
    return (
      <aside
        ref={containerRef}
        className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-xl md:hidden"
      >
        {body}
      </aside>
    );
  }

  return (
    <aside
      ref={containerRef}
      className={`hidden h-full shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col ${sidebarCollapsed ? 'w-20' : 'w-72'}`}
    >
      {body}
    </aside>
  );
}
