import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { AppIcon } from '../../../components/ui/AppIcon';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    // MOCK API
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitted(true);
  };

  return (
    <div className="w-full">
      <div className="mb-10 hidden lg:block">
        <AppIcon name="book-open" className="w-10 h-10 text-indigo-600 mb-6" />
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reset your password</h2>
        <p className="mt-2 text-slate-500 text-sm">Enter your email and we'll send you a link to reset your password.</p>
      </div>

      <div className="mb-10 lg:hidden">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset password</h2>
        <p className="mt-2 text-slate-500 text-sm">Enter your email and we'll send you a link.</p>
      </div>

      {isSubmitted ? (
        <div className="text-center space-y-6">
          <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl border border-emerald-100">
            <h3 className="text-lg font-semibold mb-2">Check your email</h3>
            <p className="text-sm">We've sent a password reset link to your email address. Please check your inbox and spam folder.</p>
          </div>
          
          <Link to="/auth/login" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            <AppIcon name="arrow-left" className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <AppIcon name="spinner" className="w-4 h-4 mr-2 animate-spin" />
                  Sending link...
                </span>
              ) : (
                'Send reset link'
              )}
            </button>
          </div>
          
          <div className="text-center mt-6">
            <Link to="/auth/login" className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-slate-900">
              <AppIcon name="arrow-left" className="w-4 h-4 mr-2" />
              Back to login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
