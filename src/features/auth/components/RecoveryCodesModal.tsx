import { useState } from 'react';
import { toast } from 'sonner';

import { AppIcon } from '../../../components/ui/AppIcon';

interface RecoveryCodesModalProps {
  codes: string[];
  onClose: () => void;
}

export function RecoveryCodesModal({
  codes,
  onClose,
}: RecoveryCodesModalProps) {
  const [copied, setCopied] =
    useState(false);

  const copyCodes = async () => {
    await navigator.clipboard.writeText(
      codes.join('\n'),
    );

    setCopied(true);

    toast.success(
      'Recovery codes copied to clipboard.',
    );

    window.setTimeout(
      () => setCopied(false),
      2000,
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <AppIcon
                  name="key"
                  className="h-4 w-4 text-amber-600"
                />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Your recovery codes
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Save these codes somewhere secure.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <AppIcon
              name="times"
              className="h-4 w-4"
            />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-800">
              These codes may be shown only once. Store them securely before closing this window.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
            {codes.map((code) => (
              <div
                key={code}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-center font-mono text-sm font-semibold tracking-wider text-slate-700"
              >
                {code}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void copyCodes()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <AppIcon
                name={
                  copied
                    ? 'check'
                    : 'copy'
                }
                className="h-3.5 w-3.5"
              />

              {copied
                ? 'Copied'
                : 'Copy codes'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              I've saved them
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}