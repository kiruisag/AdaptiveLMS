import React, { useEffect, useState } from 'react';
import { AppIcon } from '../../../components/ui/AppIcon';

interface OrganizationCreateDialogProps {
  open: boolean;
  isPending: boolean;
  error?: Error | null;
  onClose: () => void;
  onSubmit: (payload: {
    name: string;
    slug: string;
  }) => void;
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

  useEffect(() => {
    if (!open) {
      setName('');
      setSlug('');
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedSlug = slug.trim();

    if (!normalizedName || !normalizedSlug) {
      return;
    }

    onSubmit({
      name: normalizedName,
      slug: normalizedSlug,
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
        className="absolute inset-0 bg-slate-950/40"
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2
              id="create-organization-title"
              className="text-lg font-semibold text-slate-900"
            >
              Create organization
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Add a new tenant organization to Adaptive LMS.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <AppIcon name="xmark" className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error.message}
            </div>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Organization name
            </span>

            <input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Acme Learning"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">
              Slug
            </span>

            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="acme-learning"
              className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              isPending ||
              !name.trim() ||
              !slug.trim()
            }
            className="px-4 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {isPending ? 'Creating...' : 'Create organization'}
          </button>
        </div>
      </form>
    </div>
  );
}
