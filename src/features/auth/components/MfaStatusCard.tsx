import { AppIcon } from '../../../components/ui/AppIcon';
import type { MfaStatusDTO } from '../../../types';

interface MfaStatusCardProps {
  status: MfaStatusDTO | null;
  loading?: boolean;
  onSetup: () => void;
  onDisable: () => void;
}

export function MfaStatusCard({
  status,
  loading = false,
  onSetup,
  onDisable,
}: MfaStatusCardProps) {
  const enabled = status?.enabled ?? false;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <AppIcon
              name="shield-alt"
              className="h-4 w-4 text-indigo-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Multi-factor authentication
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add an additional layer of protection to your account.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                enabled
                  ? 'bg-emerald-50'
                  : 'bg-slate-100'
              }`}
            >
              <AppIcon
                name={
                  enabled
                    ? 'check-circle'
                    : 'lock'
                }
                className={`h-4 w-4 ${
                  enabled
                    ? 'text-emerald-600'
                    : 'text-slate-500'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-slate-900">
                  {enabled
                    ? 'MFA is enabled'
                    : 'MFA is disabled'}
                </h3>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    enabled
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {enabled
                    ? 'Enabled'
                    : 'Disabled'}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {enabled
                  ? 'Your account requires an additional verification code when signing in.'
                  : 'Enable MFA to protect your account with an additional verification step.'}
              </p>

              {enabled &&
                status?.method && (
                  <p className="mt-2 text-xs text-slate-400">
                    Method:{' '}
                    <span className="font-medium capitalize text-slate-600">
                      {status.method}
                    </span>
                  </p>
                )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {enabled ? (
            <button
              type="button"
              onClick={onDisable}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <AppIcon
                name="shield-alt"
                className="h-3.5 w-3.5"
              />
              Disable MFA
            </button>
          ) : (
            <button
              type="button"
              onClick={onSetup}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <AppIcon
                name="shield-alt"
                className="h-3.5 w-3.5"
              />
              Set up MFA
            </button>
          )}
        </div>
      </div>
    </section>
  );
}