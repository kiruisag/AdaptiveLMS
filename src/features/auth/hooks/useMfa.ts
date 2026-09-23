import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';

import { authApi } from '../../../services/api/auth.api';
import type {
  MfaRecoveryCodeStatusDTO,
  MfaRecoveryCodesDTO,
  MfaSetupDTO,
  MfaStatusDTO,
} from '../../../types';

export function useMfa() {
  const [status, setStatus] =
    useState<MfaStatusDTO | null>(null);

  const [recoveryStatus, setRecoveryStatus] =
    useState<MfaRecoveryCodeStatusDTO | null>(null);

  const [setup, setSetup] =
    useState<MfaSetupDTO | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [setupLoading, setSetupLoading] =
    useState(false);

  const [verifyLoading, setVerifyLoading] =
    useState(false);

  const [disableLoading, setDisableLoading] =
    useState(false);

  const [recoveryLoading, setRecoveryLoading] =
    useState(false);

  const load = useCallback(
    async () => {
      try {
        setLoading(true);

        const [
          mfaStatus,
          recovery,
        ] = await Promise.all([
          authApi.getMfaStatus(),
          authApi.getMfaRecoveryCodeStatus(),
        ]);

        setStatus(mfaStatus);
        setRecoveryStatus(recovery);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to load MFA settings.';

        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const startSetup = useCallback(async () => {
  try {
    setSetupLoading(true);

    const result = await authApi.setupMfa();

    setSetup(result);

    return result;
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to start MFA setup.';

    toast.error(message);

    throw error;
  } finally {
    setSetupLoading(false);
  }
}, []);


  const verify = async (
    code: string,
  ) => {
    try {
      setVerifyLoading(true);

      const result =
        await authApi.verifyMfa({
          code,
        });

      toast.success(result.message);

      setSetup(null);

      await load();

      return result;
    } catch (error) {
      throw error;
    } finally {
      setVerifyLoading(false);
    }
  };

  const disable = async (
    payload: {
      code?: string;
      password?: string;
    },
  ) => {
    try {
      setDisableLoading(true);

      const result =
        await authApi.disableMfa(
          payload,
        );

      toast.success(result.message);

      setSetup(null);

      await load();

      return result;
    } catch (error) {
      throw error;
    } finally {
      setDisableLoading(false);
    }
  };

  const generateRecoveryCodes =
    async (): Promise<MfaRecoveryCodesDTO> => {
      try {
        setRecoveryLoading(true);

        const result =
          await authApi.generateMfaRecoveryCodes();

        await load();

        return result;
      } catch (error) {
        throw error;
      } finally {
        setRecoveryLoading(false);
      }
    };
    const cancelSetup = () => {
  setSetup(null);
};

  return {
    status,
    recoveryStatus,
    setup,
    loading,
    setupLoading,
    verifyLoading,
    disableLoading,
    recoveryLoading,
    cancelSetup,
    startSetup,
    verify,
    disable,
    generateRecoveryCodes,
    reload: load,
  };
}