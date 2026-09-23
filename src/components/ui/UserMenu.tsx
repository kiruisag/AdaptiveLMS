import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { AppIcon } from './AppIcon';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';

export function UserMenu() {
  const [isOpen, setIsOpen] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { user, logout } =
    useAuthStore();

  const { theme, toggleTheme } =
    useUiStore();

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener(
        'mousedown',
        handleClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, [isOpen]);

  if (!user) {
    return null;
  }
  const displayName =
  user.full_name ??
  user.name ??
  (
    [
      user.first_name,
      user.last_name,
    ]
      .filter(Boolean)
      .join(' ') || 'User'
  );

  const initials =
    [
      user.first_name,
      user.last_name,
    ]
      .filter(Boolean)
      .map(
        (name) => name?.charAt(0),
      )
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'U';

  const handleProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleSessions = () => {
    setIsOpen(false);
    navigate('/auth/sessions');
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/auth/login', {
      replace: true,
    });
  };

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      <button
        type="button"
        onClick={() =>
          setIsOpen((current) => !current)
        }
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open user menu"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 font-bold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-200">
          <span className="text-sm tracking-tighter">
            {initials}
          </span>
        </div>

        <AppIcon
          name={
            isOpen
              ? 'chevron-up'
              : 'chevron-down'
          }
          className="h-3 w-3 text-slate-400"
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          role="menu"
        >
          {/* User information */}
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                {initials}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {displayName}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Account */}
          <div className="p-1.5">
            <button
              type="button"
              onClick={handleProfile}
              role="menuitem"
              className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <AppIcon
                name="user"
                className="mr-3 h-4 w-4 text-slate-400"
              />

              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={handleSessions}
              role="menuitem"
              className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <AppIcon
                name="laptop"
                className="mr-3 h-4 w-4 text-slate-400"
              />

              <span>Active Sessions</span>
            </button>
          </div>

          {/* Preferences */}
          <div className="border-t border-slate-100 p-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              role="menuitem"
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <div className="flex items-center">
                {theme === 'dark' ? (
                  <AppIcon
                    name="moon"
                    className="mr-3 h-4 w-4 text-slate-400"
                  />
                ) : (
                  <AppIcon
                    name="sun"
                    className="mr-3 h-4 w-4 text-slate-400"
                  />
                )}

                <span>
                  {theme === 'dark'
                    ? 'Dark Mode'
                    : 'Light Mode'}
                </span>
              </div>

              <div
                className={`flex h-4 w-8 items-center rounded-full p-0.5 transition-colors ${
                  theme === 'dark'
                    ? 'bg-indigo-600'
                    : 'bg-slate-300'
                }`}
              >
                <div
                  className={`h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${
                    theme === 'dark'
                      ? 'translate-x-4'
                      : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Sign out */}
          <div className="border-t border-slate-100 p-1.5">
            <button
              type="button"
              onClick={() => {
                void handleLogout();
              }}
              role="menuitem"
              className="flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <AppIcon
                name="sign-out-alt"
                className="mr-3 h-4 w-4 text-red-500"
              />

              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}