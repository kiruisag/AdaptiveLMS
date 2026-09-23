import { AppIcon } from '../../../components/ui/AppIcon';
import type { AuthUserDTO } from '../../../types';

interface ProfileOverviewCardProps {
  user: AuthUserDTO | null;
}

export function ProfileOverviewCard({
  user,
}: ProfileOverviewCardProps) {
  const initials =
    [
      user?.first_name,
      user?.last_name,
    ]
      .filter(Boolean)
      .map((name) => name![0])
      .join('')
      .toUpperCase() || 'U';

  const displayName =
    user?.full_name ??
    user?.name ??
    'User';

  const status =
    user?.status ?? 'active';

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <AppIcon
              name="user"
              className="h-4 w-4 text-indigo-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Profile
            </h2>

            <p className="text-sm text-slate-500">
              Your account information.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50/70 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
            {initials}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold text-slate-900">
              {displayName}
            </h3>

            <p className="truncate text-sm text-slate-500">
              {user?.email ?? '—'}
            </p>

            <div className="mt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x border-t border-slate-100">
        <div className="px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Email
          </p>

          <div className="mt-1 flex items-center gap-2">
            <AppIcon
              name="envelope"
              className="h-3.5 w-3.5 text-slate-400"
            />

            <span className="truncate text-sm text-slate-600">
              {user?.email ?? '—'}
            </span>
          </div>
        </div>

        <div className="px-6 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Phone
          </p>

          <div className="mt-1 flex items-center gap-2">
            <AppIcon
              name="phone"
              className="h-3.5 w-3.5 text-slate-400"
            />

            <span className="truncate text-sm text-slate-600">
              {user?.phone ?? 'Not provided'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}