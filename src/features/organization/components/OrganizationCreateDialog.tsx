import React, { useEffect, useState } from 'react';
import { AppIcon } from '../../../components/ui/AppIcon';
import type { OrganizationPayload } from '../types/organization.types';

interface OrganizationCreateDialogProps {
  open: boolean;
  isPending: boolean;
  error?: Error | null;
  onClose: () => void;
  onSubmit: (payload: OrganizationPayload) => void;
}

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function OrganizationCreateDialog({
  open,
  isPending,
  error,
  onClose,
  onSubmit,
}: OrganizationCreateDialogProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false);

  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (!open) {
      setName('');
      setSlug('');
      setSlugManuallyEdited(false);
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setEmail('');
      setPhone('');
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    setName(value);

    if (!slugManuallyEdited) {
      setSlug(createSlug(value));
    }
  };

  const handleSlugChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSlugManuallyEdited(true);
    setSlug(createSlug(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedSlug = slug.trim();
    const normalizedFirstName = firstName.trim();
    const normalizedMiddleName = middleName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedEmail = email.trim();
    const normalizedPhone = phone.trim();

    if (
      !normalizedName ||
      !normalizedSlug ||
      !normalizedFirstName ||
      !normalizedLastName ||
      !normalizedEmail
    ) {
      return;
    }

    onSubmit({
      name: normalizedName,
      slug: normalizedSlug,
      administrator: {
        firstName: normalizedFirstName,
        middleName: normalizedMiddleName || null,
        lastName: normalizedLastName,
        email: normalizedEmail,
        phone: normalizedPhone || null,
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-organization-title"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        disabled={isPending}
        className="absolute inset-0 bg-slate-950/40"
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div className="flex items-start gap-3">
            <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <AppIcon
                name="building"
                className="h-5 w-5"
              />
            </div>

            <div>
              <h2
                id="create-organization-title"
                className="text-lg font-semibold text-slate-900"
              >
                Create organization
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Set up the organization and its initial administrator.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Close"
          >
            <AppIcon
              name="xmark"
              className="h-4 w-4"
            />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {error && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AppIcon
                name="circle-exclamation"
                className="mt-0.5 h-4 w-4 shrink-0"
              />

              <span>
                {error.message}
              </span>
            </div>
          )}

          <div className="space-y-8">
            <section>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Organization details
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Enter the basic information for the new organization.
                </p>
              </div>

              <div className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Organization name
                  </span>

                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Acme Learning"
                    disabled={isPending}
                    autoComplete="organization"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Slug
                  </span>

                  <input
                    type="text"
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="acme-learning"
                    disabled={isPending}
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                  />

                  <p className="text-xs text-slate-500">
                    Used as the organization identifier in URLs and
                    integrations.
                  </p>
                </label>
              </div>
            </section>

            <section className="border-t border-slate-200 pt-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Initial administrator
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  This person will become the initial administrator of
                  the organization.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">
                      First name
                    </span>

                    <input
                      type="text"
                      value={firstName}
                      onChange={(event) =>
                        setFirstName(event.target.value)
                      }
                      placeholder="John"
                      disabled={isPending}
                      autoComplete="given-name"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">
                      Middle name
                      <span className="ml-1 font-normal text-slate-400">
                        (optional)
                      </span>
                    </span>

                    <input
                      type="text"
                      value={middleName}
                      onChange={(event) =>
                        setMiddleName(event.target.value)
                      }
                      placeholder="Michael"
                      disabled={isPending}
                      autoComplete="additional-name"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Last name
                  </span>

                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(event.target.value)
                    }
                    placeholder="Doe"
                    disabled={isPending}
                    autoComplete="family-name"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Email address
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="john@example.com"
                    disabled={isPending}
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">
                    Phone
                    <span className="ml-1 font-normal text-slate-400">
                      (optional)
                    </span>
                  </span>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="+254 700 000 000"
                    disabled={isPending}
                    autoComplete="tel"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </label>
              </div>
            </section>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              isPending ||
              !name.trim() ||
              !slug.trim() ||
              !firstName.trim() ||
              !lastName.trim() ||
              !email.trim()
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && (
              <AppIcon
                name="arrows-rotate"
                className="h-4 w-4 animate-spin"
              />
            )}

            {isPending
              ? 'Creating organization...'
              : 'Create organization'}
          </button>
        </div>
      </form>
    </div>
  );
}