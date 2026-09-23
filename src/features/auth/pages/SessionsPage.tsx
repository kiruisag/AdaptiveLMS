import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppIcon } from '../../../components/ui/AppIcon';
import { authApi } from '../../../services/api/auth.api';
import type { SessionDTO } from '../../../types/api.types';

export function SessionsPage() {
  const [sessions, setSessions] = useState<SessionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [revoking, setRevoking] = useState<number | null>(null);

  const loadSessions = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent ?? false;

      try {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await authApi.getSessions();
        setSessions(data);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to load active sessions.';

        toast.error(message);
      } finally {
        if (silent) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  const handleRevoke = async (sessionId: number) => {
    try {
      setRevoking(sessionId);

      await authApi.revokeSession(sessionId);

      setSessions((current) =>
        current.filter((session) => session.id !== sessionId),
      );

      toast.success('Session revoked successfully.');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to revoke this session.';

      toast.error(message);
    } finally {
      setRevoking(null);
    }
  };

  const formatLastActivity = (
    timestamp: number | null | undefined,
  ): string => {
    if (!timestamp) {
      return 'Unknown';
    }

    const date = new Date(timestamp * 1000);

    if (Number.isNaN(date.getTime())) {
      return 'Unknown';
    }

    return date.toLocaleString();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <AppIcon
              name="shield-alt"
              className="h-5 w-5 text-indigo-600"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Active sessions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage the devices currently signed in to your account.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void loadSessions({ silent: true })}
          disabled={refreshing || loading}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <AppIcon
            name="sync-alt"
            className={`h-3.5 w-3.5 ${
              refreshing ? 'animate-spin' : ''
            }`}
          />

          <span>
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </span>
        </button>
      </div>

      {/* Security notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <AppIcon
          name="exclamation-triangle"
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
        />

        <div>
          <p className="text-sm font-medium text-amber-900">
            Review your active sessions regularly
          </p>

          <p className="mt-1 text-sm text-amber-700">
            If you don't recognize a device, revoke its session and
            change your password.
          </p>
        </div>
      </div>

      {/* Sessions card */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Signed-in devices
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Devices that currently have access to your account.
            </p>
          </div>

          {!loading && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {sessions.length}{' '}
              {sessions.length === 1 ? 'session' : 'sessions'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-4 p-6">
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <AppIcon
                name="laptop"
                className="h-5 w-5 text-slate-400"
              />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No active sessions found
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              There are currently no active sessions associated
              with your account.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Device
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    IP address
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Last activity
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white">
                {sessions.map((session) => {
                  const isRevoking =
                    revoking === session.id;

                  return (
                    <tr
                      key={session.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            <AppIcon
                              name="laptop"
                              className="h-4 w-4 text-slate-500"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">
                              {session.device_name ??
                                'Unknown device'}
                            </p>

                            <p className="text-xs text-slate-400">
                              Active session
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {session.ip_address ?? 'Unknown'}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {formatLastActivity(
                          session.last_activity,
                        )}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            void handleRevoke(session.id)
                          }
                          disabled={isRevoking}
                          aria-label={
                            isRevoking
                              ? 'Revoking session'
                              : 'Revoke session'
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <AppIcon
                            name="sign-out-alt"
                            className={`h-3 w-3 ${
                              isRevoking
                                ? 'animate-pulse'
                                : ''
                            }`}
                          />

                          {isRevoking
                            ? 'Revoking...'
                            : 'Revoke'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Refresh indicator without replacing content */}
        {refreshing && !loading && (
          <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-6 py-2.5 text-xs text-slate-500">
            <AppIcon
              name="sync-alt"
              className="h-3 w-3 animate-spin"
            />
            Updating sessions...
          </div>
        )}
      </section>
    </div>
  );
}