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
import type { Organization } from '../types/organization.types';

export function OrganizationManagementPage() {
  const queryClient = useQueryClient();

  const [createOpen, setCreateOpen] = useState(false);
  const [selectedOrganizationUuid, setSelectedOrganizationUuid] =
    useState<string | null>(null);

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

  const createOrganization = useMutation({
    mutationFn: organizationApi.create,

    onSuccess: async () => {
      setCreateOpen(false);

      await queryClient.invalidateQueries({
        queryKey: organizationKeys.all,
      });
    },
  });

  const handleSelectOrganization = (
    organization: Organization,
  ) => {
    setSelectedOrganizationUuid(organization.uuid);
  };

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
                name="arrows-rotate"
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
            </div>
          </div>
        ) : (
          <OrganizationTable
            organizations={organizations}
            selectedOrganizationUuid={
              selectedOrganizationUuid
            }
            isLoading={organizationsQuery.isLoading}
            onSelect={handleSelectOrganization}
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
        error={
          createOrganization.error instanceof Error
            ? createOrganization.error
            : null
        }
        onClose={() => setCreateOpen(false)}
        onSubmit={(payload) =>
          createOrganization.mutate(payload)
        }
      />
    </div>
  );
}
