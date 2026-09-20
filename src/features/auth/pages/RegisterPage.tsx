import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { AppIcon } from '../../../components/ui/AppIcon';
import { authApi } from '../../../services/api/auth.api';

const registerSchema = z.object({
  orgName: z.string().min(2, 'Organization name is required'),
  orgType: z.string().min(1, 'Organization type is required'),
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });
  
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      const [first_name, ...rest] = data.name.trim().split(/\s+/);
      const last_name = rest.join(' ') || 'User';

      await authApi.register({
        first_name,
        last_name,
        email: data.email,
        phone: null,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      navigate('/auth/login?registered=true');
    } catch (error: any) {
      setServerError('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 hidden lg:block">
        <AppIcon name="book-open" className="w-10 h-10 text-indigo-600 mb-6" />
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your learning organization</h2>
        <p className="mt-2 text-slate-500 text-sm">Set up your organization and start delivering personalized learning with Adaptive LMS.</p>
      </div>

      <div className="mb-8 lg:hidden">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create organization</h2>
        <p className="mt-2 text-slate-500 text-sm">Set up your organization and start delivering personalized learning.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">Organization Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Organization name</label>
            <input
              {...register('orgName')}
              type="text"
              placeholder="Acme University"
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
            />
            {errors.orgName && <p className="mt-2 text-sm text-red-600">{errors.orgName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Organization type</label>
            <select
              {...register('orgType')}
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow bg-white"
            >
              <option value="">Select a type...</option>
              <option value="university">University / Higher Education</option>
              <option value="school">K-12 School</option>
              <option value="corporate">Corporate Training</option>
              <option value="independent">Independent Academy</option>
            </select>
            {errors.orgType && <p className="mt-2 text-sm text-red-600">{errors.orgType.message}</p>}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">Administrator Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
            <input
              {...register('name')}
              type="text"
              placeholder="Jane Doe"
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
            />
            {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="jane@example.com"
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                {...register('password')}
                type="password"
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
              />
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm password</label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
              />
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
            </div>
          </div>
        </div>

        <div className="flex items-center pt-2">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-slate-700">
            I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
          </label>
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
                Creating...
              </span>
            ) : (
              'Create organization'
            )}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Sign in instead
        </Link>
      </div>
    </div>
  );
}
