import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AppIcon } from '../../../components/ui/AppIcon';
import { authApi } from '../../../services/api/auth.api';

const resetPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  token: z.string().min(1, 'A reset token is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
  password_confirmation: z.string().min(1, 'Please confirm your password.'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Passwords do not match.',
  path: ['password_confirmation'],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: searchParams.get('email') ?? '',
      token: searchParams.get('token') ?? '',
      password: '',
      password_confirmation: '',
    },
  });

  useEffect(() => {
    const email = searchParams.get('email') ?? '';
    const token = searchParams.get('token') ?? '';

    if (email) setValue('email', email);
    if (token) setValue('token', token);
  }, [searchParams, setValue]);

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      await authApi.resetPassword({
        email: data.email,
        token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      toast.success('Password reset successful. You can now sign in.');
      navigate('/auth/login');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to reset your password.';
      toast.error(message);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-10 hidden lg:block">
        <AppIcon name="book-open" className="w-10 h-10 text-indigo-600 mb-6" />
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Set a new password</h2>
        <p className="mt-2 text-slate-500 text-sm">Choose a strong password to finish resetting your account.</p>
      </div>

      <div className="mb-10 lg:hidden">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">New password</h2>
        <p className="mt-2 text-slate-500 text-sm">Choose a strong password to finish reset.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Reset token</label>
          <input
            {...register('token')}
            type="text"
            readOnly
            className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
          />
          {errors.token && <p className="mt-2 text-sm text-red-600">{errors.token.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
          <input
            {...register('password')}
            type="password"
            autoComplete="new-password"
            className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
          />
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm new password</label>
          <input
            {...register('password_confirmation')}
            type="password"
            autoComplete="new-password"
            className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
          />
          {errors.password_confirmation && (
            <p className="mt-2 text-sm text-red-600">{errors.password_confirmation.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <AppIcon name="spinner" className="w-4 h-4 mr-2 animate-spin" />
              Saving password...
            </span>
          ) : (
            'Save new password'
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm">
        <Link to="/auth/login" className="font-medium text-slate-600 hover:text-slate-900">
          Back to login
        </Link>
      </div>
    </div>
  );
}
