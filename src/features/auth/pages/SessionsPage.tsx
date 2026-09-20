import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AppIcon } from '../../../components/ui/AppIcon';
import { authApi } from '../../../services/api/auth.api';
import type { SessionDTO } from '../../../types/api.types';

export function SessionsPage() {
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState<number | null>(null);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await authApi.getSessions();
      setSessions(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load active sessions.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSessions();
  }, []);

  const handleRevoke = async (sessionId: number) => {
    try {
      setRevoking(sessionId);
      await authApi.revokeSession(sessionId);
      toast.success('Session revoked successfully.');
      await loadSessions();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to revoke this session.';
      toast.error(message);
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Active sessions</h1>
          <p className="text-sm text-slate-500">Manage the devices currently signed in to your account.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No active sessions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">IP address</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Last activity</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {sessions.map((session) => (
                  <tr key={session.id}>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <div className="flex items-center gap-2">
                        <AppIcon name="monitor" className="w-4 h-4 text-slate-400" />
                        <span>{session.device_name ?? 'Unknown device'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{session.ip_address ?? 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {session.last_activity ? new Date(session.last_activity * 1000).toLocaleString() : 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRevoke(session.id)}
                        disabled={revoking === session.id}
                        className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-60"
                      >
                        {revoking === session.id ? 'Revoking...' : 'Revoke'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
