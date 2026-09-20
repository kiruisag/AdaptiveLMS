import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AppIcon } from '../../../components/ui/AppIcon';
import { organizationApi } from '../../../services/api/organization.api';
import type { OrganizationDTO } from '../../../types/api.types';

const statusClasses: Record<OrganizationDTO['status'], string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  active: 'bg-green-50 text-green-700 border-green-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
};

export function OrgManagement() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [selectedOrgUuid, setSelectedOrgUuid] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState({ user_id: '', metadata: '' });

  const { data, isLoading, error } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationApi.list({ per_page: 20 }),
  });

  const organizations = useMemo(() => {
    const payload = data as { data?: OrganizationDTO[] } | undefined;
    return Array.isArray(payload?.data) ? payload.data : [];
  }, [data]);

  useEffect(() => {
    if (!selectedOrgUuid && organizations.length > 0) {
      setSelectedOrgUuid(organizations[0].uuid);
    }
  }, [organizations, selectedOrgUuid]);

  const selectedOrganization = useMemo(
    () => organizations.find((organization) => organization.uuid === selectedOrgUuid) ?? null,
    [organizations, selectedOrgUuid]
  );

  const membersQuery = useQuery({
    enabled: Boolean(selectedOrgUuid),
    queryKey: ['organization-members', selectedOrgUuid],
    queryFn: async () => {
      if (!selectedOrgUuid) {
        return { data: [] };
      }
      return organizationApi.getMembers(selectedOrgUuid, { per_page: 20 });
    },
  });

  const createOrganization = useMutation({
    mutationFn: (payload: { name: string; slug: string }) => organizationApi.create(payload),
    onSuccess: () => {
      setForm({ name: '', slug: '' });
      setShowCreateForm(false);
      void queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  const inviteMember = useMutation({
    mutationFn: ({ organizationId, userId }: { organizationId: string; userId: number }) =>
      organizationApi.inviteMember(organizationId, {
        user_id: userId,
        metadata: inviteForm.metadata ? { note: inviteForm.metadata } : null,
      }),
    onSuccess: () => {
      setInviteForm({ user_id: '', metadata: '' });
      void queryClient.invalidateQueries({ queryKey: ['organization-members', selectedOrgUuid] });
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.slug.trim()) {
      return;
    }

    createOrganization.mutate({
      name: form.name.trim(),
      slug: form.slug.trim(),
    });
  };

  const handleInviteSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedOrgUuid) {
      return;
    }

    const userId = Number(inviteForm.user_id);
    if (!userId) {
      return;
    }

    inviteMember.mutate({ organizationId: selectedOrgUuid, userId });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
          <p className="text-slate-500">Manage tenant organizations, memberships, and status.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowCreateForm((value) => !value)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <AppIcon name="plus" className="w-4 h-4" />
            <span>{showCreateForm ? 'Close' : 'Create Organization'}</span>
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2 text-sm text-slate-600">
              <span>Organization name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Acme Learning"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span>Slug</span>
              <input
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="acme-learning"
              />
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createOrganization.isPending || !form.name.trim() || !form.slug.trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {createOrganization.isPending ? 'Creating...' : 'Save organization'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50">
          <div className="relative w-full sm:w-96">
            <AppIcon name="magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
            <AppIcon name="filter" className="w-4 h-4 text-slate-500" />
            <span>Filters</span>
          </button>
        </div>

        {error ? (
          <div className="p-6 text-sm text-red-600">{error instanceof Error ? error.message : 'Unable to load organizations.'}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Organization</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-sm text-slate-500 text-center">Loading organizations...</td>
                  </tr>
                ) : organizations.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-sm text-slate-500 text-center">No organizations found.</td>
                  </tr>
                ) : (
                  organizations.map((org) => (
                    <tr
                      key={org.uuid}
                      className={`cursor-pointer transition-colors group ${selectedOrgUuid === org.uuid ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                      onClick={() => setSelectedOrgUuid(org.uuid)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                            <AppIcon name="building" className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{org.name}</p>
                            <p className="text-xs text-slate-500 flex items-center mt-0.5">
                              <AppIcon name="link" className="w-3 h-3 mr-1" />
                              {org.uuid.slice(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{org.slug}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusClasses[org.status]}`}>
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {org.created_at ? new Date(org.created_at).toLocaleDateString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrganization && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Members for {selectedOrganization.name}</h2>
              <p className="text-sm text-slate-500">Organization membership and invites</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedOrgUuid(null)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleInviteSubmit} className="grid gap-3 md:grid-cols-[1fr_1.5fr_auto]">
            <input
              type="number"
              min="1"
              value={inviteForm.user_id}
              onChange={(event) => setInviteForm((current) => ({ ...current, user_id: event.target.value }))}
              placeholder="User ID"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              value={inviteForm.metadata}
              onChange={(event) => setInviteForm((current) => ({ ...current, metadata: event.target.value }))}
              placeholder="Optional invite note"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={inviteMember.isPending || !inviteForm.user_id}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {inviteMember.isPending ? 'Inviting...' : 'Invite'}
            </button>
          </form>

          {membersQuery.isLoading ? (
            <div className="text-sm text-slate-500">Loading members...</div>
          ) : membersQuery.isError ? (
            <div className="text-sm text-red-600">Unable to load members.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">User ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {((membersQuery.data as { data?: Array<{ user_id: number; status: string; joined_at?: string | null }> } | undefined)?.data ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500">No members found.</td>
                    </tr>
                  ) : (
                    ((membersQuery.data as { data?: Array<{ user_id: number; status: string; joined_at?: string | null }> } | undefined)?.data ?? []).map((member) => (
                      <tr key={member.user_id}>
                        <td className="px-4 py-3 text-sm text-slate-700">{member.user_id}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusClasses[(member.status as OrganizationDTO['status']) ?? 'pending'] ?? statusClasses.pending}`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {member.joined_at ? new Date(member.joined_at).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
