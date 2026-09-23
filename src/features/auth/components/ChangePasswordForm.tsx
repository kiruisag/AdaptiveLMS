import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { AppIcon } from '../../../components/ui/AppIcon';
import { useChangePassword } from '../hooks/useProfile';

const passwordSchema = z
  .object({
    current_password: z
      .string()
      .min(1, 'Current password is required.'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.'),

    password_confirmation: z
      .string()
      .min(1, 'Please confirm your password.'),
  })
  .refine(
    (values) =>
      values.password ===
      values.password_confirmation,
    {
      message: 'Passwords do not match.',
      path: ['password_confirmation'],
    },
  );

type PasswordFormValues =
  z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const changePassword =
    useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (
    values: PasswordFormValues,
  ) => {
    try {
      await changePassword.mutateAsync(values);

      reset();

      toast.success(
        'Password changed successfully.',
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to change your password.',
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Change password
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Use a strong password that you do not reuse on other services.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Current password
        </label>

        <input
          {...register('current_password')}
          type="password"
          autoComplete="current-password"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        {errors.current_password && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.current_password.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          New password
        </label>

        <input
          {...register('password')}
          type="password"
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        {errors.password && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Confirm new password
        </label>

        <input
          {...register('password_confirmation')}
          type="password"
          autoComplete="new-password"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />

        {errors.password_confirmation && (
          <p className="mt-1.5 text-xs text-red-600">
            {errors.password_confirmation.message}
          </p>
        )}
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={changePassword.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {changePassword.isPending && (
            <AppIcon
              name="sync-alt"
              className="h-4 w-4 animate-spin"
            />
          )}

          {changePassword.isPending
            ? 'Changing...'
            : 'Change password'}
        </button>
      </div>
    </form>
  );
}