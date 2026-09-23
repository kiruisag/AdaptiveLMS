import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { AppIcon } from '../../../components/ui/AppIcon';
import { useAuth } from '../../../stores/auth.store';

const profileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required.'),

  middle_name: z
    .string()
    .optional(),

  last_name: z
    .string()
    .min(1, 'Last name is required.'),

  phone: z
    .string()
    .optional(),

  email: z
    .string()
    .email('Enter a valid email address.'),
});

type ProfileFormValues =
  z.infer<typeof profileSchema>;

export function ProfileForm() {
  const user = useAuth(
    (state) => state.user,
  );

  /*
   * Keep this form ready for the existing
   * profile mutation hook when the backend
   * update endpoint is available.
   *
   * If your useProfile hook already exposes
   * useUpdateProfile, import it here.
   */

  const {
    register,
    reset,
    handleSubmit,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name ?? '',
      middle_name: user?.middle_name ?? '',
      last_name: user?.last_name ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
    },
  });

  useEffect(() => {
    reset({
      first_name: user?.first_name ?? '',
      middle_name: user?.middle_name ?? '',
      last_name: user?.last_name ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
    });
  }, [user, reset]);

  const onSubmit = async (
    values: ProfileFormValues,
  ) => {
    /*
     * The current backend route list does not
     * expose a profile update endpoint.
     *
     * Do not make a fake API request here.
     */
    void values;

    toast.info(
      'Profile editing will be enabled when the profile update API is available.',
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            First name
          </label>

          <input
            {...register('first_name')}
            type="text"
            autoComplete="given-name"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {errors.first_name && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.first_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Middle name
          </label>

          <input
            {...register('middle_name')}
            type="text"
            autoComplete="additional-name"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {errors.middle_name && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.middle_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Last name
          </label>

          <input
            {...register('last_name')}
            type="text"
            autoComplete="family-name"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {errors.last_name && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.last_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone number
          </label>

          <input
            {...register('phone')}
            type="tel"
            autoComplete="tel"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          {errors.phone && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Email address
          </label>

          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Email changes may require verification.
          </p>

          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={!isDirty}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <AppIcon
            name="save"
            className="h-4 w-4"
          />

          Save changes
        </button>
      </div>
    </form>
  );
}