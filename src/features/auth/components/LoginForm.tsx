import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../../../stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      // Mock API call
      // const response = await apiClient.post('/auth/login', data);
      // setAuth(response.data.user, response.data.token);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.email === 'admin@example.com' || data.email === 'learner@example.com') {
         setAuth({
            id: '1',
            name: 'Test User',
            email: data.email,
            role: data.email.includes('admin') ? 'sys_admin' : 'learner',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
         }, 'mock-jwt-token-123');
         toast.success('Logged in successfully');
         navigate('/');
      } else {
         throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      setServerError(error.response?.data?.message || error.message || 'An error occurred during login');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700">Email address</label>
        <div className="mt-1">
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Password</label>
        <div className="mt-1">
          <input
            {...register('password')}
            type="password"
            autoComplete="current-password"
            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
        </div>
      </div>

      {serverError && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
          {serverError}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
      
      <div className="text-sm text-center text-slate-500 mt-4">
        Try <span className="font-semibold text-slate-700">learner@example.com</span> / <span className="font-semibold text-slate-700">password</span>
      </div>
    </form>
  );
}
