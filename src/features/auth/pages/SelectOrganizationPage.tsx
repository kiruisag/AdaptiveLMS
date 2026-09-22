import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrganization } from '../../../app/providers/OrganizationProvider';

export function SelectOrganizationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    organizations,
    activeOrganization,
    setActiveOrganization,
  } = useOrganization();

  const from =
    (location.state as {
      from?: {
        pathname?: string;
        search?: string;
        hash?: string;
      };
    } | null)?.from;

  const handleSelect = (
    organization: typeof organizations[number],
  ) => {
    setActiveOrganization(organization);

    navigate(
      from?.pathname
        ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
        : '/',
      { replace: true },
    );
  };

  if (organizations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            No organizations available
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Your account is not currently a member of any organization.
          </p>

          <button
            type="button"
            onClick={() => navigate('/', { replace: true })}
            className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Select organization
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Choose the organization you want to work in.
          </p>
        </div>

        <div className="space-y-3">
          {organizations.map((organization) => {
            const selected =
              activeOrganization?.uuid === organization.uuid;

            return (
              <button
                key={organization.uuid}
                type="button"
                onClick={() => handleSelect(organization)}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-4 text-left transition-colors ${
                  selected
                    ? 'border-indigo-300 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {organization.name}
                  </div>

                  <div className="mt-1 truncate text-xs text-slate-500">
                    {organization.slug}
                  </div>
                </div>

                {selected && (
                  <span className="ml-4 shrink-0 text-xs font-medium text-indigo-600">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
