import React, { useMemo, useState } from 'react';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { AppIcon } from '../../../components/ui/AppIcon';
import { organizationApi } from '../../../services/api/organization.api';
import { OrganizationCreateDialog } from '../components/OrganizationCreateDialog';
import { OrganizationMembers } from '../components/OrganizationMembers';
import { OrganizationTable } from '../components/OrganizationTable';
import {
  organizationKeys,
  useOrganizations,
} from '../hooks/useOrganizations';
import type {
  Organization,
  OrganizationPayload,
} from '../types/organization.types';

type OrganizationAction =
  | 'suspend'
  | 'delete'
  | null;

type OrganizationMutationAction =
  | 'activate'
  | 'restore'
  | null;

export function OrganizationManagementPage() {
  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);

  const [selectedOrganizationUuid, setSelectedOrganizationUuid] =
    useState<string | null>(null);

  const [pendingAction, setPendingAction] =
    useState<OrganizationAction>(null);

  const [actionOrganization, setActionOrganization] =
    useState<Organization | null>(null);

  const [pendingOrganizationUuid, setPendingOrganizationUuid] =
    useState<string | null>(null);

  const [
    pendingOrganizationAction,
    setPendingOrganizationAction,
  ] = useState<OrganizationMutationAction>(null);

  const organizationsQuery = useOrganizations({
    per_page: 20,
  });

  const organizations = organizationsQuery.data?.data ?? [];

  const selectedOrganization = useMemo(
    () =>
      organizations.find(
        (organization) =>
          organization.uuid === selectedOrganizationUuid,
      ) ?? null,
    [organizations, selectedOrganizationUuid],
  );

  const refreshOrganizations = async () => {
    await queryClient.invalidateQueries({
      queryKey: organizationKeys.all,
    });
  };

  const createOrganization = useMutation({
    mutationFn: organizationApi.create,

    onSuccess: async () => {
      setCreateOpen(false);
      await refreshOrganizations();
    },
  });

  const activateOrganization = useMutation({
    mutationFn: (organizationId: string) =>
      organizationApi.activate(organizationId),

    onMutate: (organizationId) => {
      setPendingOrganizationUuid(organizationId);
      setPendingOrganizationAction('activate');
    },

    onSettled: async () => {
      setPendingOrganizationUuid(null);
      setPendingOrganizationAction(null);

      await refreshOrganizations();
    },
  });

  const suspendOrganization = useMutation({
    mutationFn: (organizationId: string) =>
      organizationApi.suspend(organizationId),

    onSuccess: async () => {
      setPendingAction(null);
      setActionOrganization(null);

      await refreshOrganizations();
    },
  });

  const restoreOrganization = useMutation({
    mutationFn: (organizationId: string) =>
      organizationApi.restore(organizationId),

    onMutate: (organizationId) => {
      setPendingOrganizationUuid(organizationId);
      setPendingOrganizationAction('restore');
    },

    onSettled: async () => {
      setPendingOrganizationUuid(null);
      setPendingOrganizationAction(null);

      await refreshOrganizations();
    },
  });

  const deleteOrganization = useMutation({
    mutationFn: (organizationId: string) =>
      organizationApi.remove(organizationId),

    onSuccess: async () => {
      setPendingAction(null);
      setActionOrganization(null);
      setSelectedOrganizationUuid(null);

      await refreshOrganizations();
    },
  });

  const handleCreateOrganization = (
    payload: OrganizationPayload,
  ) => {
    createOrganization.mutate(payload);
  };

  const handleSelectOrganization = (
    organization: Organization,
  ) => {
    setSelectedOrganizationUuid(organization.uuid);
  };

  const handleEditOrganization = (
    organization: Organization,
  ) => {
    /*
     * The edit dialog will be implemented in the next stage.
     */
    setSelectedOrganizationUuid(organization.uuid);
  };

  const handleActivateOrganization = (
    organization: Organization,
  ) => {
    activateOrganization.mutate(organization.uuid);
  };

  const handleSuspendOrganization = (
    organization: Organization,
  ) => {
    setActionOrganization(organization);
    setPendingAction('suspend');
  };

  const handleRestoreOrganization = (
    organization: Organization,
  ) => {
    restoreOrganization.mutate(organization.uuid);
  };

  const handleDeleteOrganization = (
    organization: Organization,
  ) => {
    setActionOrganization(organization);
    setPendingAction('delete');
  };

  const closeActionDialog = () => {
    if (
      suspendOrganization.isPending ||
      deleteOrganization.isPending
    ) {
      return;
    }

    setPendingAction(null);
    setActionOrganization(null);
  };

  const confirmAction = () => {
    if (!actionOrganization) {
      return;
    }

    if (pendingAction === 'suspend') {
      suspendOrganization.mutate(
        actionOrganization.uuid,
      );

      return;
    }

    if (pendingAction === 'delete') {
      deleteOrganization.mutate(
        actionOrganization.uuid,
      );
    }
  };

  const actionIsPending =
    suspendOrganization.isPending ||
    deleteOrganization.isPending;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AppIcon
              name="building"
              className="w-6 h-6 text-indigo-600"
            />

            <h1 className="text-2xl font-bold text-slate-900">
              Organizations
            </h1>
          </div>

          <p className="text-sm text-slate-500 mt-1">
            Manage tenant organizations, memberships, and status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <AppIcon name="plus" className="w-4 h-4" />
          Create Organization
        </button>
      </header>

      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Organization directory
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                {organizationsQuery.data?.meta.total ?? 0}{' '}
                organization
                {(organizationsQuery.data?.meta.total ?? 0) === 1
                  ? ''
                  : 's'}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void organizationsQuery.refetch()
              }
              disabled={organizationsQuery.isFetching}
              className="inline-flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <AppIcon
                name="sync-alt"
                className={[
                  'w-4 h-4',
                  organizationsQuery.isFetching
                    ? 'animate-spin'
                    : '',
                ].join(' ')}
              />

              Refresh
            </button>
          </div>
        </div>

        {organizationsQuery.isError ? (
          <div className="p-6">
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-800">
                Unable to load organizations.
              </p>

              <p className="text-sm text-red-700 mt-1">
                {organizationsQuery.error instanceof Error
                  ? organizationsQuery.error.message
                  : 'An unexpected error occurred.'}
              </p>

              <button
                type="button"
                onClick={() =>
                  void organizationsQuery.refetch()
                }
                className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-red-200 text-sm font-medium text-red-700 hover:bg-red-100"
              >
                <AppIcon
                  name="sync-alt"
                  className="w-4 h-4"
                />

                Try Again
              </button>
            </div>
          </div>
        ) : (
          <OrganizationTable
            organizations={organizations}
            selectedOrganizationUuid={
              selectedOrganizationUuid
            }
            pendingOrganizationUuid={
              pendingOrganizationUuid
            }
            pendingOrganizationAction={
              pendingOrganizationAction
            }
            isLoading={organizationsQuery.isLoading}
            onSelect={handleSelectOrganization}
            onEdit={handleEditOrganization}
            onActivate={handleActivateOrganization}
            onSuspend={handleSuspendOrganization}
            onRestore={handleRestoreOrganization}
            onDelete={handleDeleteOrganization}
          />
        )}
      </section>

      {selectedOrganization && (
        <OrganizationMembers
          organization={selectedOrganization}
          onClose={() =>
            setSelectedOrganizationUuid(null)
          }
        />
      )}

      <OrganizationCreateDialog
        open={createOpen}
        isPending={createOrganization.isPending}
        error={createOrganization.error}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateOrganization}
      />

      {pendingAction && actionOrganization && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="organization-action-title"
        >
          <div
            className="absolute inset-0 bg-slate-950/40"
            onClick={closeActionDialog}
          />

          <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-xl">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={[
                    'w-11 h-11 rounded-xl flex items-center',
                    'justify-center shrink-0',
                    pendingAction === 'delete'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-amber-50 text-amber-600',
                  ].join(' ')}
                >
                  <AppIcon
                    name={
                      pendingAction === 'delete'
                        ? 'trash'
                        : 'pause'
                    }
                    className="w-5 h-5"
                  />
                </div>

                <div className="min-w-0">
                  <h2
                    id="organization-action-title"
                    className="text-lg font-semibold text-slate-900"
                  >
                    {pendingAction === 'delete'
                      ? 'Delete organization?'
                      : 'Suspend organization?'}
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    {pendingAction === 'delete' ? (
                      <>
                        This will delete{' '}
                        <span className="font-semibold text-slate-800">
                          {actionOrganization.name}
                        </span>
                        . This action cannot be undone from
                        this screen.
                      </>
                    ) : (
                      <>
                        This will suspend{' '}
                        <span className="font-semibold text-slate-800">
                          {actionOrganization.name}
                        </span>
                        . Users may no longer be able to use
                        the organization while it is suspended.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {(suspendOrganization.isError ||
                deleteOrganization.isError) && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-800">
                    Action failed.
                  </p>

                  <p className="text-xs text-red-700 mt-1">
                    {(
                      suspendOrganization.isError
                        ? suspendOrganization.error
                        : deleteOrganization.error
                    ) instanceof Error
                      ? (
                          suspendOrganization.isError
                            ? suspendOrganization.error
                            : deleteOrganization.error
                        )?.message
                      : 'An unexpected error occurred.'}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeActionDialog}
                  disabled={actionIsPending}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmAction}
                  disabled={actionIsPending}
                  className={[
                    'inline-flex items-center justify-center gap-2',
                    'px-4 py-2.5 rounded-lg text-sm font-medium',
                    'text-white disabled:opacity-60',
                    pendingAction === 'delete'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-amber-600 hover:bg-amber-700',
                  ].join(' ')}
                >
                  {actionIsPending && (
                    <AppIcon
                      name="sync-alt"
                      className="w-4 h-4 animate-spin"
                    />
                  )}

                  {pendingAction === 'delete'
                    ? 'Delete Organization'
                    : 'Suspend Organization'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}