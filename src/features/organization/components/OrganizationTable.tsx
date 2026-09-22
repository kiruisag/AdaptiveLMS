import React from 'react';
import { AppIcon } from '../../../components/ui/AppIcon';
import type { Organization } from '../types/organization.types';

const statusClasses: Record<
  Organization['status'],
  string
> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
};

interface OrganizationTableProps {
  organizations: Organization[];
  selectedOrganizationUuid: string | null;
  isLoading: boolean;
  onSelect: (organization: Organization) => void;
}

export function OrganizationTable({
  organizations,
  selectedOrganizationUuid,
  isLoading,
  onSelect,
}: OrganizationTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white border-b border-slate-200">
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Organization
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Created
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-10 text-center text-sm text-slate-500"
              >
                Loading organizations...
              </td>
            </tr>
          ) : organizations.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-10 text-center"
              >
                <div className="flex flex-col items-center gap-2">
                  <AppIcon
                    name="building"
                    className="w-8 h-8 text-slate-300"
                  />
                  <p className="text-sm font-medium text-slate-700">
                    No organizations found
                  </p>
                  <p className="text-xs text-slate-500">
                    Create your first organization to get started.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            organizations.map((organization) => {
              const selected =
                selectedOrganizationUuid === organization.uuid;

              return (
                <tr
                  key={organization.uuid}
                  onClick={() => onSelect(organization)}
                  className={[
                    'cursor-pointer transition-colors',
                    selected
                      ? 'bg-indigo-50'
                      : 'hover:bg-slate-50',
                  ].join(' ')}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <AppIcon
                          name="building"
                          className="w-5 h-5 text-slate-600"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {organization.name}
                        </p>

                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                          <AppIcon
                            name="link"
                            className="w-3 h-3 mr-1"
                          />
                          {organization.uuid.slice(0, 8)}…
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-700">
                    {organization.slug}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={[
                        'inline-flex items-center px-2.5 py-1',
                        'rounded-full text-xs font-medium border',
                        statusClasses[organization.status],
                      ].join(' ')}
                    >
                      {organization.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-500">
                    {organization.created_at
                      ? new Date(
                          organization.created_at,
                        ).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
