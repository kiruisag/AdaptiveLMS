import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { AppIcon } from '../../../components/ui/AppIcon';

import { useMfa } from '../hooks/useMfa';
import { MfaStatusCard } from '../components/MfaStatusCard';
import { RecoveryCodesCard } from '../components/RecoveryCodesCard';
import { RecoveryCodesModal } from '../components/RecoveryCodesModal';
import { DisableMfaDialog } from '../components/DisableMfaDialog';
import { ChangePasswordForm } from '../components/ChangePasswordForm';

export function SecurityPage() {
  const navigate = useNavigate();

  const {
    status,
    recoveryStatus,
    loading,
    setupLoading,
    disableLoading,
    recoveryLoading,
    disable,
    generateRecoveryCodes,
  } = useMfa();

  const [
    showDisable,
    setShowDisable,
  ] = useState(false);

  const [
    recoveryCodes,
    setRecoveryCodes,
  ] = useState<string[] | null>(
    null,
  );

  const handleSetup = () => {
    navigate(
      '/profile/security/mfa/setup',
    );
  };

  const handleDisable = async (
    code: string,
  ) => {
    try {
      await disable({
        code,
      });

      setShowDisable(false);

      toast.success(
        'MFA has been disabled.',
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to disable MFA.';

      toast.error(message);
    }
  };

  const handleGenerateCodes =
    async () => {
      try {
        const result =
          await generateRecoveryCodes();

        setRecoveryCodes(
          result.codes,
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to generate recovery codes.';

        toast.error(message);
      }
    };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
          <AppIcon
            name="shield-alt"
            className="h-5 w-5 text-indigo-600"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Security
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your password, multi-factor authentication,
            recovery codes, and active sessions.
          </p>
        </div>
      </div>

      {/* MFA */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />

          <div className="h-44 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      ) : (
        <>
          <MfaStatusCard
            status={status}
            loading={setupLoading}
            onSetup={handleSetup}
            onDisable={() =>
              setShowDisable(true)
            }
          />

          <RecoveryCodesCard
            status={recoveryStatus}
            loading={recoveryLoading}
            onGenerate={
              handleGenerateCodes
            }
          />
        </>
      )}

      {/* Password */}
      <section
        id="password"
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <AppIcon
                name="lock"
                className="h-4 w-4 text-slate-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Password
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Change your account password.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <ChangePasswordForm />
        </div>
      </section>

      {/* Sessions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
              <AppIcon
                name="laptop"
                className="h-4 w-4 text-slate-600"
              />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Active sessions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review and revoke devices currently signed in
                to your account.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                '/profile/sessions',
              )
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Manage
            <AppIcon
              name="chevron-right"
              className="h-3 w-3"
            />
          </button>
        </div>
      </section>

      {/* Disable MFA */}
      {showDisable && (
        <DisableMfaDialog
          loading={disableLoading}
          onConfirm={
            handleDisable
          }
          onClose={() =>
            setShowDisable(false)
          }
        />
      )}

      {/* Recovery codes */}
      {recoveryCodes && (
        <RecoveryCodesModal
          codes={recoveryCodes}
          onClose={() =>
            setRecoveryCodes(null)
          }
        />
      )}
    </div>
  );
}