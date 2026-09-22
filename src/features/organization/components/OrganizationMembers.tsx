import React from 'react';
import { AppIcon } from '../../../components/ui/AppIcon';
import { useOrganizationMembers } from '../hooks/useOrganizationMembers';
import type { Organization } from '../types/organization.types';

interface OrganizationMembersProps {
  organization: Organization;
  onClose: () => void;
}

function statusClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-green-50 text-green-700 border-green-200';

    case 'INVITED':
      return 'bg-amber-50 text-amber-700 border-amber-200';

    case 'SUSPENDED':
      return 'bg-red-50 text-red-700 border-red-200';

    case 'LEFT':
      return 'bg-slate-100 text-slate-600 border-slate-200';

    default:
      return 'bg-slate-100 text-slate-600 border-slate-200';
  }
}

export function OrganizationMembers({
  organization,
  onClose,
}: OrganizationMembersProps) {
  const membersQuery = useOrganizationMembers(
    organization.uuid,
    { per_page: 20 },
  );

  const members = membersQuery.data?.data ?? [];

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AppIcon
              name="users"
              className="w-5 h-5 text-indigo-600"
            />

            <h2 className="text-lg font-semibold text-slate-900">
              Members
            </h2>
          </div>

          <p className="text-sm text-slate-500 mt-1">
            Members of {organization.name}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          Close
        </button>
      </div>

      {membersQuery.isError ? (
        <div className="p-6 text-sm text-red-600">
          {membersQuery.error instanceof Error
            ? membersQuery.error.message
            : 'Unable to load members.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                  User
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {membersQuery.isLoading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    Loading members...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-8 text-center"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      No members yet
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Organization members will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={`${member.user_id}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                          <AppIcon
                            name="user"
                            className="w-4 h-4 text-slate-500"
                          />
                        </div>

                        <span className="text-sm font-medium text-slate-800">
                          User #{member.user_id}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={[
                          'inline-flex px-2.5 py-1 rounded-full',
                          'border text-xs font-medium',
                          statusClass(member.status),
                        ].join(' ')}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {member.joined_at
                        ? new Date(
                            member.joined_at,
                          ).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
