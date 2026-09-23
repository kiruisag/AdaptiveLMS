import React, { useMemo, useState } from 'react';

import { AppIcon } from '../../../components/ui/AppIcon';
import { useOrganizationMembers } from '../hooks/useOrganizationMembers';
import { useOrganizationMember } from '../hooks/useOrganizationMember';
import { useOrganizationMemberRoles } from '../hooks/useOrganizationMemberRoles';
import {
  useAssignMemberRole,
  useRemoveMemberRole,
} from '../hooks/useOrganizationMemberRoleMutations';
import { useOrganizationRoles } from '../hooks/useOrganizationRoles';

import type {
  Organization,
  OrganizationMember,
  OrganizationRole,
} from '../types/organization.types';

interface OrganizationMembersProps {
  organization: Organization;
  onClose: () => void;
}

function statusClass(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';

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

function getUserName(member: {
  user?: {
    first_name?: string | null;
    middle_name?: string | null;
    last_name?: string | null;
  } | null;
  user_id: string | number;
}): string {
  const name = [
    member.user?.first_name,
    member.user?.middle_name,
    member.user?.last_name,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  return name || 'Unnamed member';
}

function formatDate(value?: string | null): string {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(value?: string | null): string {
  if (!value) {
    return '—';
  }

  return new Date(value).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRoleName(name: string): string {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatPermissionName(permission: string): string {
  return permission
    .split('.')
    .map((part) =>
      part
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase()),
    )
    .join(' / ');
}

function getRoleAccent(role: OrganizationRole): string {
  const name = role.name.toLowerCase();

  if (name.includes('admin')) {
    return 'indigo';
  }

  if (name.includes('learner') || name.includes('student')) {
    return 'emerald';
  }

  if (name.includes('teacher') || name.includes('instructor')) {
    return 'violet';
  }

  return 'slate';
}

function roleIcon(role: OrganizationRole): string {
  const name = role.name.toLowerCase();

  if (name.includes('admin')) {
    return 'shield-alt';
  }

  if (name.includes('learner') || name.includes('student')) {
    return 'graduation-cap';
  }

  if (name.includes('teacher') || name.includes('instructor')) {
    return 'chalkboard-teacher';
  }

  return 'user-tag';
}

function RoleCard({
  role,
  onRemove,
  removing,
}: {
  role: OrganizationRole;
  onRemove: () => void;
  removing: boolean;
}) {
  const [permissionsExpanded, setPermissionsExpanded] = useState(false);

  const accent = getRoleAccent(role);

  const accentClasses = {
    indigo: {
      container: 'border-indigo-200 bg-indigo-50/40',
      icon: 'bg-indigo-100 border-indigo-200 text-indigo-600',
      badge: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      count: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },

    emerald: {
      container: 'border-emerald-200 bg-emerald-50/40',
      icon: 'bg-emerald-100 border-emerald-200 text-emerald-600',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      count: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },

    violet: {
      container: 'border-violet-200 bg-violet-50/40',
      icon: 'bg-violet-100 border-violet-200 text-violet-600',
      badge: 'bg-violet-100 text-violet-700 border-violet-200',
      count: 'bg-violet-50 text-violet-700 border-violet-200',
    },

    slate: {
      container: 'border-slate-200 bg-slate-50/60',
      icon: 'bg-slate-100 border-slate-200 text-slate-600',
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      count: 'bg-white text-slate-700 border-slate-200',
    },
  }[accent];

  return (
    <div
      className={[
        'rounded-2xl border overflow-hidden',
        'transition-shadow hover:shadow-sm',
        accentClasses.container,
      ].join(' ')}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={[
                'w-11 h-11 rounded-xl border',
                'flex items-center justify-center shrink-0',
                accentClasses.icon,
              ].join(' ')}
            >
              <AppIcon
                name={roleIcon(role)}
                className="w-5 h-5"
              />
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {formatRoleName(role.name)}
              </h4>

              <p className="text-xs text-slate-500 mt-1">
                {role.permissions.length}{' '}
                {role.permissions.length === 1
                  ? 'permission'
                  : 'permissions'}
              </p>
            </div>
          </div>

          <span
            className={[
              'shrink-0 inline-flex items-center gap-1.5',
              'px-2.5 py-1 rounded-lg border',
              'text-xs font-semibold',
              accentClasses.count,
            ].join(' ')}
          >
            <AppIcon
              name="key"
              className="w-3 h-3"
            />
            {role.permissions.length}
          </span>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() =>
              setPermissionsExpanded((current) => !current)
            }
            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <AppIcon
                name="key"
                className="w-3.5 h-3.5 text-slate-500"
              />

              <span className="text-xs font-semibold text-slate-700">
                Permissions
              </span>

              <span className="text-[10px] font-medium text-slate-400">
                {role.permissions.length}
              </span>
            </span>

            <AppIcon
              name={
                permissionsExpanded
                  ? 'chevron-up'
                  : 'chevron-down'
              }
              className="w-3.5 h-3.5 text-slate-400"
            />
          </button>

          {permissionsExpanded && (
            <div className="mt-2 p-3 rounded-xl bg-white border border-slate-200">
              {role.permissions.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No permissions assigned to this role.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <span
                      key={permission}
                      title={permission}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600"
                    >
                      <AppIcon
                        name="check-circle"
                        className="w-3 h-3 text-emerald-500"
                      />

                      {formatPermissionName(permission)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-4 pt-4 border-t border-slate-200/70">
          <button
            type="button"
            onClick={onRemove}
            disabled={removing}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 bg-white text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {removing ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-red-200 border-t-red-600 rounded-full animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <AppIcon
                  name="trash"
                  className="w-3.5 h-3.5"
                />
                Remove Role
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MemberSummary({
  member,
  organization,
}: {
  member: OrganizationMember;
  organization: Organization;
}) {
  const name = getUserName(member);
  const status = member.status.toUpperCase();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="p-5 bg-gradient-to-br from-indigo-50 via-white to-slate-50 border-b border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center shrink-0">
            <AppIcon
              name="user"
              className="w-7 h-7 text-indigo-600"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900">
                {name}
              </h3>

              <span
                className={[
                  'inline-flex items-center gap-1.5',
                  'px-2.5 py-1 rounded-full border',
                  'text-[10px] font-bold',
                  statusClass(member.status),
                ].join(' ')}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {status}
              </span>
            </div>

            {member.user?.email && (
              <p className="text-sm text-slate-500 mt-1">
                {member.user.email}
              </p>
            )}

            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
              <AppIcon
                name="building"
                className="w-3.5 h-3.5"
              />
              {organization.name}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            Joined
          </p>

          <p className="text-sm font-semibold text-slate-700 mt-1">
            {formatDateTime(member.joined_at)}
          </p>
        </div>

        <div className="p-4">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            Invitation Accepted
          </p>

          <p className="text-sm font-semibold text-slate-700 mt-1">
            {formatDateTime(member.invitation_accepted_at)}
          </p>
        </div>

        <div className="p-4">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
            Invitation Expires
          </p>

          <p className="text-sm font-semibold text-slate-700 mt-1">
            {formatDateTime(member.invitation_expires_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function OrganizationMembers({
  organization,
  onClose,
}: OrganizationMembersProps) {
  const [selectedUserId, setSelectedUserId] =
    useState<string | number | null>(null);

  const [showAssignRole, setShowAssignRole] =
    useState(false);

  const [roleToRemove, setRoleToRemove] =
    useState<OrganizationRole | null>(null);

  const [selectedRoleId, setSelectedRoleId] =
    useState<number | ''>('');

  const membersQuery = useOrganizationMembers(
    organization.uuid,
    { per_page: 20 },
  );

  const memberDetailQuery = useOrganizationMember(
    organization.uuid,
    selectedUserId,
  );

  const memberRolesQuery =
    useOrganizationMemberRoles(
      organization.uuid,
      selectedUserId,
    );

  const organizationRolesQuery =
    useOrganizationRoles(organization.uuid);

  const assignRoleMutation =
    useAssignMemberRole();

  const removeRoleMutation =
    useRemoveMemberRole();

  const members = membersQuery.data?.data ?? [];

  const selectedMember =
    memberDetailQuery.data ??
    members.find(
      (member) =>
        String(member.user_id) ===
        String(selectedUserId),
    ) ??
    null;

  const roles = useMemo<OrganizationRole[]>(
    () => memberRolesQuery.data?.data ?? [],
    [memberRolesQuery.data],
  );

  const availableRoles = useMemo(() => {
    const assignedRoleIds = new Set(
      roles.map((role) => role.id),
    );

    return (
      organizationRolesQuery.data?.data ?? []
    ).filter((role) => !assignedRoleIds.has(role.id));
  }, [
    organizationRolesQuery.data,
    roles,
  ]);

  const uniquePermissionCount = useMemo(() => {
    const permissions = new Set<string>();

    roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissions.add(permission);
      });
    });

    return permissions.size;
  }, [roles]);

  const handleOpenMember = (
    userId: string | number,
  ) => {
    const isCurrentlySelected =
      String(selectedUserId) === String(userId);

    setSelectedUserId(
      isCurrentlySelected ? null : userId,
    );

    setShowAssignRole(false);
    setRoleToRemove(null);
    setSelectedRoleId('');
  };

  const handleAssignRole = async () => {
    if (
      !selectedUserId ||
      selectedRoleId === ''
    ) {
      return;
    }

    try {
      await assignRoleMutation.mutateAsync({
        organizationId: organization.uuid,
        userId: selectedUserId,
        roleId: Number(selectedRoleId),
      });

      setSelectedRoleId('');
      setShowAssignRole(false);
    } catch {
      // The mutation error is rendered below.
    }
  };

  const handleRemoveRole = async () => {
    if (
      !selectedUserId ||
      !roleToRemove
    ) {
      return;
    }

    try {
      await removeRoleMutation.mutateAsync({
        organizationId: organization.uuid,
        userId: selectedUserId,
        roleId: roleToRemove.id,
      });

      setRoleToRemove(null);
    } catch {
      // The mutation error is rendered below.
    }
  };

  return (
    <>
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <AppIcon
                    name="users"
                    className="w-5 h-5 text-indigo-600"
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Members
                  </h2>

                  <p className="text-xs text-slate-500">
                    {members.length}{' '}
                    {members.length === 1
                      ? 'member'
                      : 'members'}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-500 mt-3">
                Members of{' '}
                <span className="font-medium text-slate-700">
                  {organization.name}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <AppIcon
                name="x"
                className="w-4 h-4"
              />
              Close
            </button>
          </div>
        </div>

        {membersQuery.isError && (
          <div className="p-6">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex gap-3">
                <AppIcon
                  name="alert-circle"
                  className="w-5 h-5 text-red-600 shrink-0"
                />

                <div>
                  <p className="text-sm font-medium text-red-800">
                    Unable to load members
                  </p>

                  <p className="text-xs text-red-700 mt-1">
                    {membersQuery.error instanceof Error
                      ? membersQuery.error.message
                      : 'An unexpected error occurred.'}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      membersQuery.refetch()
                    }
                    className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-red-200 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    <AppIcon
                      name="sync-alt"
                      className="w-3.5 h-3.5"
                    />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!membersQuery.isError && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Member
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Joined
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {membersQuery.isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />

                        <p className="mt-3 text-sm text-slate-500">
                          Loading members...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                          <AppIcon
                            name="users"
                            className="w-6 h-6 text-slate-400"
                          />
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          No members yet
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Invite people to join this
                          organization.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  members.map((member) => {
                    const name =
                      getUserName(member);
                    const status =
                      member.status.toUpperCase();

                    const isSelected =
                      String(selectedUserId) ===
                      String(member.user_id);

                    return (
                      <React.Fragment
                        key={`${member.organization_id}-${member.user_id}`}
                      >
                        <tr
                          className={[
                            'transition-colors',
                            isSelected
                              ? 'bg-indigo-50/60'
                              : 'hover:bg-slate-50',
                          ].join(' ')}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                                <AppIcon
                                  name="user"
                                  className="w-5 h-5 text-indigo-600"
                                />
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">
                                  {name}
                                </p>

                                {member.user?.email && (
                                  <p className="text-xs text-slate-500 truncate mt-0.5">
                                    {member.user.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={[
                                'inline-flex items-center gap-1.5',
                                'px-2.5 py-1 rounded-full',
                                'border text-xs font-medium',
                                statusClass(member.status),
                              ].join(' ')}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {status}
                            </span>

                            {status === 'INVITED' &&
                              member.invitation_expires_at && (
                                <p className="text-[11px] text-slate-400 mt-1">
                                  Expires{' '}
                                  {formatDate(
                                    member.invitation_expires_at,
                                  )}
                                </p>
                              )}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-500">
                            {member.joined_at
                              ? formatDate(
                                  member.joined_at,
                                )
                              : status === 'INVITED'
                                ? 'Invitation pending'
                                : '—'}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenMember(
                                  member.user_id,
                                )
                              }
                              className={[
                                'inline-flex items-center gap-2',
                                'px-3 py-2 rounded-lg',
                                'border text-xs font-semibold',
                                'transition-colors',
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300',
                              ].join(' ')}
                            >
                              <AppIcon
                                name={
                                  isSelected
                                    ? 'chevron-up'
                                    : 'shield-alt'
                                }
                                className="w-3.5 h-3.5"
                              />

                              {isSelected
                                ? 'Hide Details'
                                : 'Manage Roles'}
                            </button>
                          </td>
                        </tr>

                        {isSelected && (
                          <tr className="bg-slate-50/70">
                            <td
                              colSpan={4}
                              className="px-5 py-5"
                            >
                              <div className="space-y-5">
                                {memberDetailQuery.isLoading ? (
                                  <div className="rounded-2xl border border-slate-200 bg-white p-8">
                                    <div className="flex items-center justify-center gap-3">
                                      <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />

                                      <span className="text-sm text-slate-500">
                                        Loading member details...
                                      </span>
                                    </div>
                                  </div>
                                ) : memberDetailQuery.isError ? (
                                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                                    <div className="flex gap-3">
                                      <AppIcon
                                        name="alert-circle"
                                        className="w-5 h-5 text-red-600"
                                      />

                                      <div>
                                        <p className="text-sm font-semibold text-red-800">
                                          Unable to load member
                                          details
                                        </p>

                                        <p className="text-xs text-red-700 mt-1">
                                          {memberDetailQuery.error instanceof
                                          Error
                                            ? memberDetailQuery.error.message
                                            : 'An unexpected error occurred.'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ) : selectedMember ? (
                                  <MemberSummary
                                    member={selectedMember}
                                    organization={
                                      organization
                                    }
                                  />
                                ) : null}

                                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                                  <div className="p-5 border-b border-slate-200">
                                    <div className="flex items-start justify-between gap-4">
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                                            <AppIcon
                                              name="shield-alt"
                                              className="w-4 h-4 text-violet-600"
                                            />
                                          </div>

                                          <div>
                                            <h3 className="text-base font-bold text-slate-900">
                                              Assigned Roles
                                            </h3>

                                            <p className="text-xs text-slate-500 mt-0.5">
                                              Manage this member&apos;s
                                              access to the
                                              organization.
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-50 border border-violet-100 text-xs font-semibold text-violet-700">
                                          <AppIcon
                                            name="shield-alt"
                                            className="w-3 h-3"
                                          />
                                          {roles.length}{' '}
                                          {roles.length === 1
                                            ? 'role'
                                            : 'roles'}
                                        </span>

                                        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700">
                                          <AppIcon
                                            name="key"
                                            className="w-3 h-3"
                                          />
                                          {
                                            uniquePermissionCount
                                          }{' '}
                                          permissions
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {memberRolesQuery.isLoading ? (
                                    <div className="p-8">
                                      <div className="flex flex-col items-center">
                                        <div className="w-7 h-7 border-2 border-slate-200 border-t-violet-600 rounded-full animate-spin" />

                                        <p className="mt-3 text-sm text-slate-500">
                                          Loading roles and
                                          permissions...
                                        </p>
                                      </div>
                                    </div>
                                  ) : memberRolesQuery.isError ? (
                                    <div className="p-5">
                                      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                                        <div className="flex gap-3">
                                          <AppIcon
                                            name="alert-circle"
                                            className="w-5 h-5 text-red-600"
                                          />

                                          <div>
                                            <p className="text-sm font-semibold text-red-800">
                                              Unable to load roles
                                            </p>

                                            <p className="text-xs text-red-700 mt-1">
                                              {memberRolesQuery.error instanceof
                                              Error
                                                ? memberRolesQuery.error.message
                                                : 'An unexpected error occurred.'}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="p-5 space-y-4">
                                      {roles.length === 0 && (
                                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                                          <div className="mx-auto w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                                            <AppIcon
                                              name="shield-alt"
                                              className="w-5 h-5 text-slate-400"
                                            />
                                          </div>

                                          <p className="mt-3 text-sm font-semibold text-slate-700">
                                            No roles assigned
                                          </p>

                                          <p className="mt-1 text-xs text-slate-500">
                                            Assign a role to
                                            give this member
                                            access to
                                            organization
                                            features.
                                          </p>
                                        </div>
                                      )}

                                      {roles.map((role) => (
                                        <RoleCard
                                          key={role.id}
                                          role={role}
                                          removing={
                                            removeRoleMutation.isPending &&
                                            removeRoleMutation.variables?.roleId ===
                                              role.id
                                          }
                                          onRemove={() =>
                                            setRoleToRemove(
                                              role,
                                            )
                                          }
                                        />
                                      ))}

                                      {assignRoleMutation.isError && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                                          <div className="flex gap-2">
                                            <AppIcon
                                              name="alert-circle"
                                              className="w-4 h-4 text-red-600 shrink-0"
                                            />

                                            <p className="text-xs text-red-700">
                                              {assignRoleMutation.error instanceof
                                              Error
                                                ? assignRoleMutation.error.message
                                                : 'Unable to assign the role.'}
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      {removeRoleMutation.isError && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                                          <div className="flex gap-2">
                                            <AppIcon
                                              name="alert-circle"
                                              className="w-4 h-4 text-red-600 shrink-0"
                                            />

                                            <p className="text-xs text-red-700">
                                              {removeRoleMutation.error instanceof
                                              Error
                                                ? removeRoleMutation.error.message
                                                : 'Unable to remove the role.'}
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      {showAssignRole ? (
                                        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4">
                                          <div className="flex items-start justify-between gap-4">
                                            <div>
                                              <h4 className="text-sm font-bold text-slate-900">
                                                Assign Role
                                              </h4>

                                              <p className="text-xs text-slate-500 mt-1">
                                                Choose a role to
                                                grant this member.
                                              </p>
                                            </div>

                                            <button
                                              type="button"
                                              onClick={() => {
                                                setShowAssignRole(
                                                  false,
                                                );
                                                setSelectedRoleId(
                                                  '',
                                                );
                                              }}
                                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
                                            >
                                              <AppIcon
                                                name="x"
                                                className="w-4 h-4"
                                              />
                                            </button>
                                          </div>

                                          {organizationRolesQuery.isLoading ? (
                                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                              <span className="w-4 h-4 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
                                              Loading available roles...
                                            </div>
                                          ) : organizationRolesQuery.isError ? (
                                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3">
                                              <p className="text-xs text-red-700">
                                                {organizationRolesQuery.error instanceof
                                                Error
                                                  ? organizationRolesQuery.error.message
                                                  : 'Unable to load available roles.'}
                                              </p>
                                            </div>
                                          ) : availableRoles.length === 0 ? (
                                            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                                              <p className="text-xs text-slate-500">
                                                All available
                                                organization roles
                                                are already assigned
                                                to this member.
                                              </p>
                                            </div>
                                          ) : (
                                            <>
                                              <div className="mt-4">
                                                <label
                                                  htmlFor="organization-role"
                                                  className="block text-xs font-semibold text-slate-700 mb-2"
                                                >
                                                  Select role
                                                </label>

                                                <select
                                                  id="organization-role"
                                                  value={
                                                    selectedRoleId
                                                  }
                                                  onChange={(event) =>
                                                    setSelectedRoleId(
                                                      event.target.value
                                                        ? Number(
                                                            event
                                                              .target
                                                              .value,
                                                          )
                                                        : '',
                                                    )
                                                  }
                                                  disabled={
                                                    assignRoleMutation.isPending
                                                  }
                                                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
                                                >
                                                  <option value="">
                                                    Select a role...
                                                  </option>

                                                  {availableRoles.map(
                                                    (role) => (
                                                      <option
                                                        key={
                                                          role.id
                                                        }
                                                        value={
                                                          role.id
                                                        }
                                                      >
                                                        {formatRoleName(
                                                          role.name,
                                                        )}{' '}
                                                        (
                                                        {
                                                          role
                                                            .permissions
                                                            .length
                                                        }{' '}
                                                        permissions)
                                                      </option>
                                                    ),
                                                  )}
                                                </select>
                                              </div>

                                              {selectedRoleId !==
                                                '' &&
                                                (() => {
                                                  const selectedRole =
                                                    availableRoles.find(
                                                      (role) =>
                                                        role.id ===
                                                        Number(
                                                          selectedRoleId,
                                                        ),
                                                    );

                                                  if (
                                                    !selectedRole
                                                  ) {
                                                    return null;
                                                  }

                                                  return (
                                                    <div className="mt-3 rounded-xl bg-white border border-slate-200 p-3">
                                                      <p className="text-xs font-semibold text-slate-700">
                                                        This role
                                                        provides:
                                                      </p>

                                                      <div className="flex flex-wrap gap-2 mt-2">
                                                        {selectedRole.permissions.map(
                                                          (
                                                            permission,
                                                          ) => (
                                                            <span
                                                              key={
                                                                permission
                                                              }
                                                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-medium text-slate-600"
                                                            >
                                                              <AppIcon
                                                                name="check-circle"
                                                                className="w-3 h-3 text-emerald-500"
                                                              />

                                                              {formatPermissionName(
                                                                permission,
                                                              )}
                                                            </span>
                                                          ),
                                                        )}
                                                      </div>
                                                    </div>
                                                  );
                                                })()}

                                              <div className="flex justify-end gap-2 mt-4">
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setShowAssignRole(
                                                      false,
                                                    );
                                                    setSelectedRoleId(
                                                      '',
                                                    );
                                                  }}
                                                  disabled={
                                                    assignRoleMutation.isPending
                                                  }
                                                  className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                                                >
                                                  Cancel
                                                </button>

                                                <button
                                                  type="button"
                                                  onClick={
                                                    handleAssignRole
                                                  }
                                                  disabled={
                                                    selectedRoleId ===
                                                      '' ||
                                                    assignRoleMutation.isPending
                                                  }
                                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                  {assignRoleMutation.isPending ? (
                                                    <>
                                                      <span className="w-3.5 h-3.5 border-2 border-indigo-300 border-t-white rounded-full animate-spin" />
                                                      Assigning...
                                                    </>
                                                  ) : (
                                                    <>
                                                      <AppIcon
                                                        name="plus"
                                                        className="w-3.5 h-3.5"
                                                      />
                                                      Assign Role
                                                    </>
                                                  )}
                                                </button>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setShowAssignRole(
                                              true,
                                            );
                                            setSelectedRoleId(
                                              '',
                                            );
                                          }}
                                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/40 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-400 transition-colors"
                                        >
                                          <AppIcon
                                            name="plus"
                                            className="w-4 h-4"
                                          />
                                          Assign Role
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {roleToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close confirmation"
            onClick={() =>
              removeRoleMutation.isPending
                ? undefined
                : setRoleToRemove(null)
            }
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <AppIcon
                    name="trash"
                    className="w-5 h-5 text-red-600"
                  />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Remove role?
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    This will remove the{' '}
                    <span className="font-semibold text-slate-700">
                      {formatRoleName(
                        roleToRemove.name,
                      )}
                    </span>{' '}
                    role from this member.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                <div className="flex gap-2">
                  <AppIcon
                    name="exclamation-triangle"
                    className="w-4 h-4 text-amber-600 shrink-0 mt-0.5"
                  />

                  <p className="text-xs text-amber-700">
                    The member will lose the permissions
                    provided by this role.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() =>
                    setRoleToRemove(null)
                  }
                  disabled={
                    removeRoleMutation.isPending
                  }
                  className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleRemoveRole}
                  disabled={
                    removeRoleMutation.isPending
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {removeRoleMutation.isPending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-red-300 border-t-white rounded-full animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <AppIcon
                        name="trash"
                        className="w-4 h-4"
                      />
                      Remove Role
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}