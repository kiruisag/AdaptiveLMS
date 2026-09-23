import { AppIcon } from '../../../components/ui/AppIcon';
import type { OrganizationDTO } from '../../../types';

interface OrganizationsCardProps {
  organizations: OrganizationDTO[];
}

export function OrganizationsCard({
  organizations,
}: OrganizationsCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <AppIcon
              name="building"
              className="h-4 w-4 text-indigo-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Organizations
            </h2>

            <p className="text-sm text-slate-500">
              Organizations you belong to.
            </p>
          </div>
        </div>
      </div>

      {organizations.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <AppIcon
            name="building"
            className="mx-auto h-8 w-8 text-slate-300"
          />

          <p className="mt-3 text-sm text-slate-500">
            You are not currently a member of any organization.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {organizations.map((organization) => {
            const membership =
              organization.membership as
                | Record<string, unknown>
                | null
                | undefined;

            const role =
              typeof membership?.role_name === 'string'
                ? membership.role_name
                : typeof membership?.role === 'string'
                  ? membership.role
                  : 'Member';

            return (
              <div
                key={organization.uuid}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <AppIcon
                    name="building"
                    className="h-4 w-4 text-slate-500"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-medium text-slate-900">
                    {organization.name}
                  </h3>

                  <p className="mt-1 text-xs capitalize text-slate-500">
                    {role}
                  </p>
                </div>

                <AppIcon
                  name="chevron-right"
                  className="h-3.5 w-3.5 shrink-0 text-slate-400"
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}