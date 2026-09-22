import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppIcon } from '../../../components/ui/AppIcon';
import { authApi } from '../../../services/api/auth.api';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.'),
    password_confirmation: z
      .string()
      .min(8, 'Please confirm your password.'),
  })
  .refine(
    (data) => data.password === data.password_confirmation,
    {
      message: 'Passwords do not match.',
      path: ['password_confirmation'],
    },
  );

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token')?.trim() ?? '';
  const email = searchParams.get('email')?.trim() ?? '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const hasValidResetLink = useMemo(
    () => Boolean(token && email),
    [token, email],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    setServerError(null);

    if (!hasValidResetLink) {
      setServerError(
        'This password reset link is incomplete or invalid. Please request a new reset link.',
      );
      return;
    }

    try {
      await authApi.resetPassword({
        token,
        email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      setIsSuccess(true);
    } catch (error: unknown) {
      const apiError = error as {
        message?: string;
        errors?: Record<string, string[]>;
      };

      const validationMessage =
        apiError?.errors &&
        Object.values(apiError.errors)
          .flat()
          .find((message) => Boolean(message));

      setServerError(
        validationMessage ??
          apiError?.message ??
          (error instanceof Error
            ? error.message
            : 'Unable to reset your password. The link may have expired or already been used.'),
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <AppIcon name="check" className="h-7 w-7" />
        </div>

        <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">
          Password reset successful
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your password has been changed successfully. You can now sign in
          with your new password.
        </p>

        <button
          type="button"
          onClick={() => navigate('/auth/login', { replace: true })}
          className="mt-8 flex w-full justify-center rounded-xl border border-transparent bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Continue to sign in
        </button>
      </div>
    );
  }

  if (!hasValidResetLink) {
    return (
      <div className="w-full">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AppIcon name="alert-circle" className="h-7 w-7" />
        </div>

        <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">
          Invalid reset link
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          This password reset link is missing required information. Please
          request a new password reset link.
        </p>

        <Link
          to="/auth/forgot-password"
          className="mt-8 flex w-full justify-center rounded-xl border border-transparent bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Request a new link
        </Link>

        <div className="mt-5 text-center text-sm text-slate-600">
          <Link
            to="/auth/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 hidden lg:block">
        <AppIcon
          name="lock"
          className="mb-6 h-10 w-10 text-indigo-600"
        />

        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Set a new password
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Choose a strong password for your Adaptive LMS account.
        </p>
      </div>

      <div className="mb-8 lg:hidden">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Set a new password
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Choose a strong password for your account.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Account
        </p>
        <p className="mt-1 truncate text-sm font-medium text-slate-800">
          {email}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <div>
          <label
            htmlFor="reset-password"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            New password
          </label>

          <div className="relative">
            <input
              id="reset-password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              autoFocus
              placeholder="Enter your new password"
              className={`block w-full appearance-none rounded-xl border px-4 py-3 pr-12 text-sm shadow-sm placeholder-slate-400 transition-shadow focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />

            <button
              type="button"
              aria-label={
                showPassword ? 'Hide password' : 'Show password'
              }
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600"
            >
              <AppIcon
                name={showPassword ? 'eye-slash' : 'eye'}
                className="h-5 w-5"
              />
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}

          <p className="mt-2 text-xs text-slate-500">
            Use at least 8 characters.
          </p>
        </div>

        <div>
          <label
            htmlFor="reset-password-confirmation"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Confirm new password
          </label>

          <div className="relative">
            <input
              id="reset-password-confirmation"
              {...register('password_confirmation')}
              type={showConfirmation ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Confirm your new password"
              className={`block w-full appearance-none rounded-xl border px-4 py-3 pr-12 text-sm shadow-sm placeholder-slate-400 transition-shadow focus:outline-none focus:ring-2 ${
                errors.password_confirmation
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />

            <button
              type="button"
              aria-label={
                showConfirmation
                  ? 'Hide password confirmation'
                  : 'Show password confirmation'
              }
              onClick={() =>
                setShowConfirmation((visible) => !visible)
              }
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600"
            >
              <AppIcon
                name={showConfirmation ? 'eye-slash' : 'eye'}
                className="h-5 w-5"
              />
            </button>
          </div>

          {errors.password_confirmation && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        {serverError && (
          <div
            role="alert"
            className="flex items-start rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
          >
            <AppIcon
              name="alert-circle"
              className="mr-3 mt-0.5 h-5 w-5 shrink-0"
            />
            <div>{serverError}</div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-xl border border-transparent bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <AppIcon
                name="spinner"
                className="mr-2 h-4 w-4 animate-spin"
              />
              Resetting password...
            </span>
          ) : (
            'Reset password'
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        Remember your password?{' '}
        <Link
          to="/auth/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
