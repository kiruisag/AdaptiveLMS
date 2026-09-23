import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { AppIcon } from '../../../components/ui/AppIcon';

import { useMfa } from '../hooks/useMfa';
import { MfaSetupCard } from '../components/MfaSetupCard';

export function MfaSetupPage() {
  const navigate = useNavigate();

  const {
    setup,
    setupLoading,
    verifyLoading,
    startSetup,
    cancelSetup,
    verify,
  } = useMfa();

  useEffect(() => {
    if (!setup) {
      void startSetup();
    }
  }, [setup, startSetup]);

  const handleVerify = async (
    code: string,
  ) => {
    try {
      await verify(code);

      toast.success(
        'Multi-factor authentication has been enabled.',
      );

      navigate('/profile/security', {
        replace: true,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to verify MFA.';

      toast.error(message);
    }
  };

  const handleCancel = () => {
    cancelSetup();

    navigate('/profile/security');
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          aria-label="Back to security"
        >
          <AppIcon
            name="arrow-left"
            className="h-4 w-4"
          />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Set up MFA
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Secure your account with an authenticator app.
          </p>
        </div>
      </div>

      {/* Introduction */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <AppIcon
              name="shield-alt"
              className="h-5 w-5 text-indigo-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Protect your account
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Multi-factor authentication adds an extra
              verification step when you sign in. Use an
              authenticator app to generate secure,
              time-based verification codes.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <span className="text-sm font-semibold text-indigo-600">
                1
              </span>
            </div>

            <p className="mt-3 text-sm font-medium text-slate-700">
              Scan the QR code
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Add the account to your authenticator app.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <span className="text-sm font-semibold text-indigo-600">
                2
              </span>
            </div>

            <p className="mt-3 text-sm font-medium text-slate-700">
              Get your code
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Your authenticator app generates a 6-digit code.
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
              <span className="text-sm font-semibold text-indigo-600">
                3
              </span>
            </div>

            <p className="mt-3 text-sm font-medium text-slate-700">
              Verify
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Enter the code to finish enabling MFA.
            </p>
          </div>
        </div>
      </section>

      {/* Setup */}
      {setupLoading || !setup ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex min-h-72 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                <AppIcon
                  name="sync-alt"
                  className="h-5 w-5 animate-spin text-indigo-600"
                />
              </div>

              <h2 className="mt-4 font-semibold text-slate-900">
                Preparing MFA setup
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Generating your secure authenticator setup.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <MfaSetupCard
          setup={setup}
          verifying={verifyLoading}
          onVerify={handleVerify}
          onCancel={handleCancel}
        />
      )}

      {/* Security notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <AppIcon
          name="exclamation-triangle"
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
        />

        <div>
          <p className="text-sm font-medium text-amber-800">
            Keep your authenticator accessible
          </p>

          <p className="mt-1 text-xs leading-5 text-amber-700">
            After MFA is enabled, you will need your
            authenticator code when signing in. Make sure
            you can access your authenticator before
            completing setup.
          </p>
        </div>
      </div>
    </div>
  );
}