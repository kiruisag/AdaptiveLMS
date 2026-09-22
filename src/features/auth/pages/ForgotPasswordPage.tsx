import React, { useState } from 'react';
import {
  useForm,
} from 'react-hook-form';
import {
  zodResolver,
} from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { AppIcon } from '../../../components/ui/AppIcon';
import { authApi } from '../../../services/api/auth.api';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Enter a valid email address'),
});

type ForgotPasswordValues =
  z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] =
    useState(false);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(
      forgotPasswordSchema,
    ),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (
    data: ForgotPasswordValues,
  ) => {
    setServerError(null);

    try {
      await authApi.forgotPassword({
        email: data.email,
      });

      /*
       * Always show the same result regardless of whether
       * the email exists in the system.
       */
      setIsSubmitted(true);
    } catch (error: unknown) {
      const apiError =
        error as {
          message?: string;
        };

      setServerError(
        apiError?.message ??
          (error instanceof Error
            ? error.message
            : 'Unable to send the password reset link. Please try again.'),
      );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 hidden lg:block">
        <AppIcon
          name="book-open"
          className="mb-6 h-10 w-10 text-indigo-600"
        />

        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Reset your password
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Enter your email and we'll send you a secure
          password reset link.
        </p>
      </div>

      <div className="mb-10 lg:hidden">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Reset password
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Enter your email and we'll send you a secure
          reset link.
        </p>
      </div>

      {isSubmitted ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <AppIcon
                name="check"
                className="h-5 w-5 text-emerald-600"
              />
            </div>

            <h3 className="text-lg font-semibold text-emerald-900">
              Check your email
            </h3>

            <p className="mt-2 text-sm leading-6 text-emerald-700">
              If an account exists for that email address,
              we've sent a password reset link. Check your
              inbox and spam folder.
            </p>
          </div>

          <Link
            to="/auth/login"
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            <AppIcon
              name="arrow-left"
              className="mr-2 h-4 w-4"
            />
            Back to login
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div>
            <label
              htmlFor="forgot-password-email"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Email address
            </label>

            <input
              id="forgot-password-email"
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              autoFocus
              className={`block w-full appearance-none rounded-xl border px-4 py-3 text-sm shadow-sm placeholder-slate-400 transition-shadow focus:outline-none focus:ring-2 ${
                errors.email
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-600">
                {errors.email.message}
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

          <div className="pt-2">
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
                  Sending link...
                </span>
              ) : (
                'Send reset link'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              <AppIcon
                name="arrow-left"
                className="mr-2 h-4 w-4"
              />
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
