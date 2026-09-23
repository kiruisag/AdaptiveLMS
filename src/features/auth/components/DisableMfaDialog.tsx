import { useState } from 'react';
import { toast } from 'sonner';

import { AppIcon } from '../../../components/ui/AppIcon';

interface DisableMfaDialogProps {
  loading?: boolean;
  onConfirm: (code: string) => Promise<void>;
  onClose: () => void;
}

export function DisableMfaDialog({
  loading = false,
  onConfirm,
  onClose,
}: DisableMfaDialogProps) {
  const [code, setCode] =
    useState('');

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      toast.error(
        'Enter your current 6-digit MFA code.',
      );

      return;
    }

    await onConfirm(code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <AppIcon
                name="shield-alt"
                className="h-4 w-4 text-red-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Disable MFA
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                This will remove the additional verification requirement from your account.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700">
              Disabling MFA reduces the protection on your account.
            </p>
          </div>

          <div>
            <label
              htmlFor="disable-mfa-code"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Current authentication code
            </label>

            <input
              id="disable-mfa-code"
              value={code}
              onChange={(event) =>
                setCode(
                  event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 6),
                )
              }
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center font-semibold tracking-[0.35em] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 disabled:bg-slate-50"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                code.length !== 6
              }
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <AppIcon
                  name="sync-alt"
                  className="h-3.5 w-3.5 animate-spin"
                />
              )}

              {loading
                ? 'Disabling...'
                : 'Disable MFA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}