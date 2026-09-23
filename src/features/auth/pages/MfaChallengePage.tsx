import React from 'react';
import {
  useForm,
} from 'react-hook-form';
import * as z from 'zod';
import {
  zodResolver,
} from '@hookform/resolvers/zod';
import {
  useNavigate,
} from 'react-router-dom';
import { toast } from 'sonner';

import {
  AppIcon,
} from '../../../components/ui/AppIcon';
import {
  authApi,
} from '../../../services/api/auth.api';
import {
  useAuth,
} from '../../../stores/auth.store';
import type {
  ApiError,
} from '../../../types/api.types';

const codeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(
      /^\d{6}$/,
      'Code must be 6 digits',
    ),
});

type FormValues = z.infer<
  typeof codeSchema
>;

export function MfaChallengePage() {
  const navigate = useNavigate();

  const status = useAuth(
    (state) => state.status,
  );

  const mfaChallenge = useAuth(
    (state) => state.mfaChallenge,
  );

  const setAuth = useAuth(
    (state) => state.setAuth,
  );

  const clearMfaChallenge = useAuth(
    (state) => state.clearMfaChallenge,
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<FormValues>({
    resolver: zodResolver(
      codeSchema,
    ),
    defaultValues: {
      code: '',
    },
  });

  React.useEffect(() => {
    if (
      status !== 'mfa_pending' ||
      !mfaChallenge
    ) {
      navigate(
        '/auth/login',
        { replace: true },
      );
    }
  }, [
    status,
    mfaChallenge,
    navigate,
  ]);

  const onSubmit = async (
    data: FormValues,
  ) => {
    if (!mfaChallenge) {
      toast.error(
        'Your MFA challenge has expired. Please sign in again.',
      );

      navigate(
        '/auth/login',
        { replace: true },
      );

      return;
    }

    try {
      const response =
        await authApi.completeMfa({
          challenge_id:
            mfaChallenge.challengeId,
          code: data.code,
        });

      const token =
        response.token ?? null;

      if (!token) {
        throw new Error(
          'Authentication token was not returned.',
        );
      }

      setAuth(
        response.user,
        token,
      );

      clearMfaChallenge();

      toast.success(
        'Authentication successful.',
      );

      navigate(
        '/',
        { replace: true },
      );
    } catch (error: unknown) {
      const apiError =
        error as ApiError;

      if (apiError?.errors) {
        const codeErrors =
          apiError.errors.code;

        if (
          Array.isArray(codeErrors) &&
          codeErrors.length > 0
        ) {
          setError(
            'code',
            {
              type: 'server',
              message: codeErrors[0],
            },
          );

          return;
        }
      }

      setError(
        'code',
        {
          type: 'server',
          message:
            apiError?.message ??
            'MFA verification failed. Please check your code and try again.',
        },
      );
    }
  };

  const handleBackToLogin =
    () => {
      clearMfaChallenge();

      navigate(
        '/auth/login',
        { replace: true },
      );
    };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
            <AppIcon
              name="shield-alt"
              className="h-5 w-5 text-indigo-600"
            />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Verify your identity
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter the 6-digit authentication
            code from your authenticator app or
            registered MFA method to continue.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(
            onSubmit,
          )}
          className="space-y-5 p-6"
        >
          <div>
            <label
              htmlFor="mfa-code"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Authentication code
            </label>

            <input
              id="mfa-code"
              {...register('code')}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="123456"
              autoFocus
              disabled={isSubmitting}
              aria-invalid={
                errors.code
                  ? 'true'
                  : 'false'
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-lg font-semibold tracking-[0.35em] text-slate-900 outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50"
            />

            {errors.code && (
              <p className="mt-2 text-sm text-red-600">
                {errors.code.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <AppIcon
                  name="sync-alt"
                  className="h-4 w-4 animate-spin"
                />
                Verifying...
              </>
            ) : (
              <>
                <AppIcon
                  name="shield-alt"
                  className="h-4 w-4"
                />
                Verify code
              </>
            )}
          </button>

          <button
            type="button"
            onClick={
              handleBackToLogin
            }
            disabled={isSubmitting}
            className="w-full rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Back to sign in
          </button>
        </form>

        {/* Challenge information */}
        {mfaChallenge?.method && (
          <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center">
            <p className="text-xs text-slate-500">
              Verification method:{' '}
              <span className="font-medium capitalize text-slate-700">
                {mfaChallenge.method}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}