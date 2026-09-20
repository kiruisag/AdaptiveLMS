import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../../stores/auth.store';
import { useNavigate, Link } from 'react-router-dom';
import { AppIcon } from '../../../components/ui/AppIcon';
import { authApi } from '../../../services/api/auth.api';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  
  const { setAuth, setActiveTenant } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const response = await authApi.login(data);
      const token = response.token ?? localStorage.getItem('access_token');

      if (!token) {
        throw new Error('Authentication token missing from backend response');
      }

      setAuth(response.user, token);

      if (response.user.tenants && response.user.tenants.length > 1) {
        localStorage.setItem('temp_access_token', token);
        localStorage.setItem('temp_user', JSON.stringify(response.user));
        navigate('/auth/select-organization');
        return;
      }

      if (response.user.tenants?.[0]) {
        setActiveTenant(response.user.tenants[0]);
      }

      navigate('/');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'We couldn\'t sign you in with those details. Please check your email and password and try again.';
      setServerError(message);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 hidden lg:block">
        <AppIcon name="book-open" className="w-10 h-10 text-indigo-600 mb-6" />
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
        <p className="mt-2 text-slate-500 text-sm">Sign in to continue your personalized learning journey.</p>
      </div>

      <div className="mb-10 lg:hidden">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
        <p className="mt-2 text-slate-500 text-sm">Sign in to continue your personalized learning journey.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow pr-12"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AppIcon name="eye-slash" className="h-5 w-5" /> : <AppIcon name="eye" className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to="/auth/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
              Forgot password?
            </Link>
          </div>
        </div>

        {serverError && (
          <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 flex items-start">
            <div className="flex-1">{serverError}</div>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <AppIcon name="spinner" className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </div>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-500 font-medium">OR</span>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={async () => {
              try {
                const response = await authApi.loginWithGoogle();
                setAuth(response.user, response.token);
                if (response.user.tenants?.[0]) {
                  setActiveTenant(response.user.tenants[0]);
                }
                navigate('/');
              } catch (error) {
                toast.error('Google sign-in is unavailable right now. Please try again.');
              }
            }}
            className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-xl shadow-sm bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
        </div>
      </div>

      <div className="mt-10 text-center text-sm text-slate-600">
        New to Adaptive LMS?{' '}
        <Link to="/auth/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Create an organization
        </Link>
      </div>

      <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700 mb-2">Demo Accounts:</p>
        <p>Admin: admin@example.com / password</p>
        <p>Learner: learner@example.com / password</p>
      </div>
    </div>
  );
}
