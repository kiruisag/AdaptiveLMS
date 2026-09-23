import { useNavigate } from 'react-router-dom';
import { AppIcon } from '../../../components/ui/AppIcon';

export function SecurityCard() {
  const navigate = useNavigate();

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <AppIcon
              name="shield-alt"
              className="h-4 w-4 text-slate-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Security
            </h2>

            <p className="text-sm text-slate-500">
              Protect your account and manage sign-in security.
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        <button
          type="button"
          onClick={() =>
            navigate('/profile/security')
          }
          className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-slate-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <AppIcon
              name="shield-alt"
              className="h-4 w-4 text-emerald-600"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-medium text-slate-900">
                Multi-factor authentication
              </h3>

              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                Manage
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Add an additional layer of protection.
            </p>
          </div>

          <AppIcon
            name="chevron-right"
            className="h-3.5 w-3.5 shrink-0 text-slate-400"
          />
        </button>

        <button
          type="button"
          onClick={() =>
            navigate('/profile/security#password')
          }
          className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-slate-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <AppIcon
              name="lock"
              className="h-4 w-4 text-slate-600"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-slate-900">
              Password
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Change your account password.
            </p>
          </div>

          <AppIcon
            name="chevron-right"
            className="h-3.5 w-3.5 shrink-0 text-slate-400"
          />
        </button>

        <button
          type="button"
          onClick={() =>
            navigate('/profile/sessions')
          }
          className="flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-slate-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <AppIcon
              name="laptop"
              className="h-4 w-4 text-slate-600"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-medium text-slate-900">
              Active sessions
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Manage devices currently signed in.
            </p>
          </div>

          <AppIcon
            name="chevron-right"
            className="h-3.5 w-3.5 shrink-0 text-slate-400"
          />
        </button>
      </div>
    </section>
  );
}