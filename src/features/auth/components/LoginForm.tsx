import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/auth.store';
import { AppIcon } from '../../../components/ui/AppIcon';
import { authApi } from '../../../services/api/auth.api';

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().default(false),
});

type LoginFormInput = z.input<typeof loginSchema>;
type LoginFormValues = z.output<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormInput, unknown, LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const {
    setAuth,
    setActiveOrganization,
    setMfaPending,
  } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as {
      from?: {
        pathname?: string;
        search?: string;
        hash?: string;
      };
    } | null)?.from;

  const getDestination = () => {
    if (!from?.pathname) {
      return '/';
    }

    return `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`;
  };

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);

    try {
      const response = await authApi.login(data);

      /*
       * MFA is a separate authentication state.
       * Do not establish a normal authenticated session until
       * the MFA challenge has been completed.
       */
      if (response.mfa_required) {
        if (!response.challenge_id) {
          throw new Error(
            'The server requested MFA but did not provide a challenge.',
          );
        }

        setMfaPending(response.user, {
          challengeId: response.challenge_id,
          method: response.method ?? null,
          expiresIn: response.expires_in ?? null,
        });

        navigate('/auth/mfa', { replace: true });
        return;
      }

      const token =
        response.token ??
        localStorage.getItem('access_token');

      if (!token) {
        throw new Error(
          'Authentication token missing from backend response.',
        );
      }

      setAuth(response.user, token);

      const organizations =
        response.user.organizations ?? [];

      /*
       * Multiple organizations require an explicit
       * organization selection before entering the app.
       */
      if (organizations.length > 1) {
        navigate('/auth/select-organization', {
          replace: true,
          state: {
            from: {
              pathname: getDestination(),
            },
          },
        });

        return;
      }

      /*
       * A single organization becomes the active context.
       */
      if (organizations.length === 1) {
        setActiveOrganization(organizations[0]);
      }

      navigate(getDestination(), {
        replace: true,
      });
    } catch (error: unknown) {
      const apiError =
        error as {
          message?: string;
          errors?: Record<string, string[]>;
        };

      if (apiError?.errors) {
        for (const [field, messages] of Object.entries(
          apiError.errors,
        )) {
          if (
            field === 'email' ||
            field === 'password'
          ) {
            setError(field, {
              type: 'server',
              message:
                messages?.[0] ??
                apiError.message ??
                'Invalid value.',
            });
          }
        }

        if (
          Object.keys(apiError.errors).some(
            (field) =>
              field !== 'email' &&
              field !== 'password',
          )
        ) {
          setServerError(
            apiError.message ??
              'Unable to sign you in. Please try again.',
          );
        }

        return;
      }

      setServerError(
        apiError?.message ??
          (error instanceof Error
            ? error.message
            : 'We could not sign you in. Please check your email and password and try again.'),
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
          Welcome back
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Sign in to continue your personalized learning journey.
        </p>
      </div>

      <div className="mb-10 lg:hidden">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Welcome back
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Sign in to continue your personalized learning journey.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <div>
          <label
            htmlFor="login-email"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email address
          </label>

          <input
            id="login-email"
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

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-slate-700"
            >
              Password
            </label>
          </div>

          <div className="relative">
            <input
              id="login-password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`block w-full appearance-none rounded-xl border px-4 py-3 pr-12 text-sm shadow-sm placeholder-slate-400 transition-shadow focus:outline-none focus:ring-2 ${
                errors.password
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />

            <button
              type="button"
              aria-label={
                showPassword
                  ? 'Hide password'
                  : 'Show password'
              }
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition-colors hover:text-slate-600"
              onClick={() =>
                setShowPassword((visible) => !visible)
              }
            >
              <AppIcon
                name={
                  showPassword
                    ? 'eye-slash'
                    : 'eye'
                }
                className="h-5 w-5"
              />
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer items-center">
            <input
              id="remember-me"
              {...register('remember')}
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />

            <span className="ml-2 text-sm text-slate-700">
              Remember me
            </span>
          </label>

          <Link
            to="/auth/forgot-password"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </Link>
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
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </div>
      </form>

      <div className="mt-10">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 font-medium text-slate-500">
              OR
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled
          className="mt-8 flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-400"
          title="Google authentication will be enabled when OAuth is configured."
        >
          <svg
            className="mr-2 h-5 w-5 opacity-60"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>

          Continue with Google
        </button>

        <p className="mt-2 text-center text-xs text-slate-400">
          Google sign-in will be available once OAuth is configured.
        </p>
      </div>

      <div className="mt-10 text-center text-sm text-slate-600">
        New to Adaptive LMS?{' '}
        <Link
          to="/auth/register"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Create an organization
        </Link>
      </div>
    </div>
  );
}
