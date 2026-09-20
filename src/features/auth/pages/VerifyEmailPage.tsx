import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AppIcon } from '../../../components/ui/AppIcon';
import { authApi } from '../../../services/api/auth.api';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const email = searchParams.get('email') ?? '';
    const token = searchParams.get('token') ?? '';

    if (!email || !token) {
      setStatus('error');
      setMessage('This verification link is missing the required information.');
      return;
    }

    const verify = async () => {
      try {
        const result = await authApi.verifyEmail({ email, token });
        setStatus('success');
        setMessage(result.message ?? 'Your email address has been verified successfully.');
      } catch (error) {
        const display = error instanceof Error ? error.message : 'We could not verify your email address.';
        setStatus('error');
        setMessage(display);
        toast.error(display);
      }
    };

    void verify();
  }, [searchParams]);

  return (
    <div className="w-full">
      <div className="mb-10 hidden lg:block">
        <AppIcon name="book-open" className="w-10 h-10 text-indigo-600 mb-6" />
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Email verification</h2>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className={`flex items-center gap-3 rounded-xl p-4 ${status === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : status === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}>
          {status === 'success' ? (
            <AppIcon name="check-circle" className="w-5 h-5" />
          ) : status === 'error' ? (
            <AppIcon name="circle-xmark" className="w-5 h-5" />
          ) : (
            <AppIcon name="spinner" className="w-5 h-5 animate-spin" />
          )}
          <span className="text-sm font-medium">{message}</span>
        </div>

        <div className="mt-6 text-center">
          <Link to="/auth/login" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            <AppIcon name="arrow-left" className="w-4 h-4 mr-2" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
