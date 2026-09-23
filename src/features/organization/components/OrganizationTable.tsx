import React, { useEffect, useRef, useState } from 'react';
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
  pendingOrganizationUuid: string | null;
  pendingOrganizationAction:
    | 'activate'
    | 'restore'
    | null;
  isLoading: boolean;
  onSelect: (organization: Organization) => void;
  onEdit: (organization: Organization) => void;
  onActivate: (organization: Organization) => void;
  onSuspend: (organization: Organization) => void;
  onRestore: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
}

export function OrganizationTable({
  organizations,
  selectedOrganizationUuid,
  pendingOrganizationUuid,
  pendingOrganizationAction,
  isLoading,
  onSelect,
  onEdit,
  onActivate,
  onSuspend,
  onRestore,
  onDelete,
}: OrganizationTableProps) {
  const [openMenuUuid, setOpenMenuUuid] =
    useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openMenuUuid) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpenMenuUuid(null);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, [openMenuUuid]);

  const handleAction = (
    action: () => void,
  ) => {
    setOpenMenuUuid(null);
    action();
  };

  const isOrganizationPending = (
    organization: Organization,
  ) =>
    pendingOrganizationUuid === organization.uuid;

  const isActionPending = (
    organization: Organization,
    action:
      | 'activate'
      | 'restore',
  ) =>
    isOrganizationPending(organization) &&
    pendingOrganizationAction === action;

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

            <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {isLoading ? (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-10 text-center text-sm text-slate-500"
              >
                Loading organizations...
              </td>
            </tr>
          ) : organizations.length === 0 ? (
            <tr>
              <td
                colSpan={5}
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
                    Create your first organization to get
                    started.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            organizations.map((organization) => {
              const selected =
                selectedOrganizationUuid ===
                organization.uuid;

              const menuOpen =
                openMenuUuid === organization.uuid;

              const activatePending =
                isActionPending(
                  organization,
                  'activate',
                );

              const restorePending =
                isActionPending(
                  organization,
                  'restore',
                );

              const organizationPending =
                isOrganizationPending(
                  organization,
                );

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

                  <td
                    className="px-6 py-4 text-right"
                    onClick={(event) =>
                      event.stopPropagation()
                    }
                  >
                    <div
                      className="relative inline-block"
                      ref={
                        menuOpen
                          ? menuRef
                          : undefined
                      }
                    >
                      <button
                        type="button"
                        aria-label={`Actions for ${organization.name}`}
                        aria-expanded={menuOpen}
                        disabled={organizationPending}
                        onClick={() =>
                          setOpenMenuUuid(
                            menuOpen
                              ? null
                              : organization.uuid,
                          )
                        }
                        className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors disabled:opacity-60"
                      >
                        {organizationPending ? (
                          <AppIcon
                            name="sync-alt"
                            className="w-4 h-4 animate-spin"
                          />
                        ) : (
                          <AppIcon
                            name="ellipsis-v"
                            className="w-4 h-4"
                          />
                        )}
                      </button>

                      {menuOpen && (
                        <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg py-1 text-left">
                          <button
                            type="button"
                            onClick={() =>
                              handleAction(() =>
                                onSelect(
                                  organization,
                                ),
                              )
                            }
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <AppIcon
                              name="users"
                              className="w-4 h-4 text-slate-400"
                            />
                            Manage Members
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleAction(() =>
                                onEdit(
                                  organization,
                                ),
                              )
                            }
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            <AppIcon
                              name="edit"
                              className="w-4 h-4 text-slate-400"
                            />
                            Edit Organization
                          </button>

                          <div className="my-1 border-t border-slate-100" />

                          {organization.status ===
                            'pending' && (
                            <button
                              type="button"
                              disabled={organizationPending}
                              onClick={() =>
                                handleAction(() =>
                                  onActivate(
                                    organization,
                                  ),
                                )
                              }
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-green-700 hover:bg-green-50 disabled:opacity-60"
                            >
                              {activatePending ? (
                                <AppIcon
                                  name="sync-alt"
                                  className="w-4 h-4 animate-spin"
                                />
                              ) : (
                                <AppIcon
                                  name="check-circle"
                                  className="w-4 h-4"
                                />
                              )}

                              Activate
                            </button>
                          )}

                          {organization.status ===
                            'active' && (
                            <button
                              type="button"
                              disabled={organizationPending}
                              onClick={() =>
                                handleAction(() =>
                                  onSuspend(
                                    organization,
                                  ),
                                )
                              }
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                            >
                              <AppIcon
                                name="pause"
                                className="w-4 h-4"
                              />
                              Suspend
                            </button>
                          )}

                          {(organization.status ===
                            'suspended' ||
                            organization.status ===
                              'archived') && (
                            <button
                              type="button"
                              disabled={organizationPending}
                              onClick={() =>
                                handleAction(() =>
                                  onRestore(
                                    organization,
                                  ),
                                )
                              }
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
                            >
                              {restorePending ? (
                                <AppIcon
                                  name="sync-alt"
                                  className="w-4 h-4 animate-spin"
                                />
                              ) : (
                                <AppIcon
                                  name="undo"
                                  className="w-4 h-4"
                                />
                              )}

                              Restore
                            </button>
                          )}

                          {organization.status !==
                            'archived' && (
                            <>
                              <div className="my-1 border-t border-slate-100" />

                              <button
                                type="button"
                                disabled={organizationPending}
                                onClick={() =>
                                  handleAction(() =>
                                    onDelete(
                                      organization,
                                    ),
                                  )
                                }
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                              >
                                <AppIcon
                                  name="trash"
                                  className="w-4 h-4"
                                />
                                Delete Organization
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
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