import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../stores/auth.store';
import { authApi } from '../../../services/api/auth.api';
import type { ApiError } from '../../../types/api.types';

const codeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
});

type FormValues = z.infer<typeof codeSchema>;

export function MfaChallengePage() {
  const navigate = useNavigate();
  const { status, mfaChallenge } = useAuth.getState();
  const setAuth = useAuth.getState().setAuth;
  const clearMfaChallenge = useAuth.getState().clearMfaChallenge;

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(codeSchema),
  });

  React.useEffect(() => {
    if (status !== 'mfa_pending' || !mfaChallenge) {
      navigate('/auth/login');
    }
  }, [status, mfaChallenge, navigate]);

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await authApi.completeMfa({ challenge_id: mfaChallenge!.challengeId, code: data.code });
      const token = response.token ?? null;
      if (!token) throw new Error('Token missing from MFA response');

      setAuth(response.user, token);
      clearMfaChallenge();
      navigate('/');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      if (apiErr?.errors) {
        for (const [field, msgs] of Object.entries(apiErr.errors)) {
          setError(field as any, { type: 'server', message: msgs?.[0] ?? apiErr.message });
        }
        return;
      }

      setError('code' as any, { type: 'server', message: apiErr?.message ?? 'MFA verification failed' });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Multi-factor authentication</h2>
      <p className="text-sm text-slate-600 mb-4">Enter the 6-digit code from your authenticator app or your SMS message to complete sign in.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Authentication code</label>
          <input {...register('code')} type="text" inputMode="numeric" placeholder="123456" className="w-full px-4 py-3 border rounded-xl" />
          {errors.code && <p className="mt-2 text-sm text-red-600">{String(errors.code.message)}</p>}
        </div>

        <div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl">
            Verify
          </button>
        </div>
      </form>
    </div>
  );
}
