import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { toast } from 'sonner';

import { AppIcon } from '../../../components/ui/AppIcon';
import type { MfaSetupDTO } from '../../../types';

interface MfaSetupCardProps {
  setup: MfaSetupDTO;
  verifying: boolean;
  onVerify: (code: string) => Promise<void>;
  onCancel: () => void;
}

export function MfaSetupCard({
  setup,
  verifying,
  onVerify,
  onCancel,
}: MfaSetupCardProps) {
  const [code, setCode] = useState('');
  const [qrImage, setQrImage] =
    useState<string | null>(null);
  const [qrLoading, setQrLoading] =
    useState(false);

  useEffect(() => {
    let cancelled = false;

    const generateQrCode = async () => {
      if (!setup.provisioning_uri) {
        setQrImage(null);
        return;
      }

      try {
        setQrLoading(true);

        const dataUrl =
          await QRCode.toDataURL(
            setup.provisioning_uri,
            {
              width: 240,
              margin: 2,
              errorCorrectionLevel: 'M',
            },
          );

        if (!cancelled) {
          setQrImage(dataUrl);
        }
      } catch (error) {
        if (!cancelled) {
          setQrImage(null);
        }

        toast.error(
          'Unable to generate the MFA QR code.',
        );
      } finally {
        if (!cancelled) {
          setQrLoading(false);
        }
      }
    };

    void generateQrCode();

    return () => {
      cancelled = true;
    };
  }, [setup.provisioning_uri]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(code)) {
      toast.error(
        'Enter a valid 6-digit authentication code.',
      );

      return;
    }

    await onVerify(code);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-indigo-100 bg-indigo-50/50 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
            <AppIcon
              name="mobile-alt"
              className="h-4 w-4 text-indigo-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Set up authenticator
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Connect your authenticator app to your account.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Step 1 */}
        <div>
          <p className="text-sm font-medium text-slate-800">
            1. Add your account to your authenticator app
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Scan the QR code using Google Authenticator,
            Microsoft Authenticator, Authy, or another
            compatible authenticator app.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="flex h-64 w-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            {qrLoading ? (
              <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                  <AppIcon
                    name="sync-alt"
                    className="h-5 w-5 animate-spin text-indigo-600"
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Generating QR code...
                </p>
              </div>
            ) : qrImage ? (
              <img
                src={qrImage}
                alt="MFA setup QR code"
                className="h-56 w-56 object-contain"
              />
            ) : (
              <div className="px-5 text-center">
                <AppIcon
                  name="qrcode"
                  className="mx-auto h-10 w-10 text-slate-400"
                />

                <p className="mt-3 text-sm font-medium text-slate-600">
                  QR code unavailable
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Use the setup key below to configure your
                  authenticator manually.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Manual setup */}
        {setup.secret && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Manual setup key
                </p>

                <p className="mt-2 break-all font-mono text-sm font-semibold tracking-wide text-slate-700">
                  {setup.secret}
                </p>
              </div>

              <AppIcon
                name="key"
                className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
              />
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              If you cannot scan the QR code, enter this key
              manually in your authenticator app.
            </p>
          </div>
        )}

        {/* Step 2 */}
        <div>
          <p className="text-sm font-medium text-slate-800">
            2. Verify your authenticator
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Enter the 6-digit code currently displayed by
            your authenticator app.
          </p>
        </div>

        {/* Verification form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="mfa-setup-code"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Authentication code
            </label>

            <input
              id="mfa-setup-code"
              value={code}
              onChange={(event) => {
                setCode(
                  event.target.value
                    .replace(/\D/g, '')
                    .slice(0, 6),
                );
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              disabled={verifying}
              aria-describedby="mfa-code-help"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-xl font-semibold tracking-[0.4em] outline-none transition placeholder:tracking-[0.4em] placeholder:text-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />

            <p
              id="mfa-code-help"
              className="mt-2 text-xs text-slate-500"
            >
              The code changes automatically every 30 seconds.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={verifying}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                verifying ||
                code.length !== 6
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {verifying && (
                <AppIcon
                  name="sync-alt"
                  className="h-4 w-4 animate-spin"
                />
              )}

              {verifying
                ? 'Verifying...'
                : 'Verify and enable'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}