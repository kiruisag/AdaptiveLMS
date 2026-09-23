import { useAuth } from '../../../stores/auth.store';

import { ProfileOverviewCard } from '../components/ProfileOverviewCard';
import { ProfileForm } from '../components/ProfileForm';
import { SecurityCard } from '../components/SecurityCard';
import { OrganizationsCard } from '../components/OrganizationsCard';

export function ProfilePage() {
  const user = useAuth(
    (state) => state.user,
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your personal information and account preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <ProfileOverviewCard user={user} />

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="font-semibold text-slate-900">
                Personal information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update your personal account information.
              </p>
            </div>

            <div className="p-6">
              <ProfileForm />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <SecurityCard />

          <OrganizationsCard
            organizations={user?.organizations ?? []}
          />
        </div>
      </div>
    </div>
  );
}