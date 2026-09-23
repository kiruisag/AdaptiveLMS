import { AppIcon } from '../../../components/ui/AppIcon';
import type {
  MfaRecoveryCodeStatusDTO,
} from '../../../types';

interface RecoveryCodesCardProps {
  status: MfaRecoveryCodeStatusDTO | null;
  loading?: boolean;
  onGenerate: () => void;
}

export function RecoveryCodesCard({
  status,
  loading = false,
  onGenerate,
}: RecoveryCodesCardProps) {
  const remaining =
    status?.remaining ?? 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <AppIcon
              name="key"
              className="h-4 w-4 text-amber-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Recovery codes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Backup codes for accessing your account if you lose your MFA device.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Available recovery codes
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Unused backup codes remaining.
            </p>
          </div>

          <span
            className={`text-2xl font-bold ${
              remaining <= 2
                ? 'text-amber-600'
                : 'text-slate-900'
            }`}
          >
            {remaining}
          </span>
        </div>

        {remaining <= 2 && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AppIcon
              name="exclamation-triangle"
              className="mt-0.5 h-3.5 w-3.5 text-amber-600"
            />

            <p className="text-xs text-amber-700">
              You have few recovery codes remaining. Generate a new set to maintain backup access.
            </p>
          </div>
        )}

        <div className="mt-5">
          <button
            type="button"
            onClick={onGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <AppIcon
                name="sync-alt"
                className="h-3.5 w-3.5 animate-spin"
              />
            ) : (
              <AppIcon
                name="sync-alt"
                className="h-3.5 w-3.5"
              />
            )}

            {loading
              ? 'Generating...'
              : 'Generate new codes'}
          </button>
        </div>
      </div>
    </section>
  );
}