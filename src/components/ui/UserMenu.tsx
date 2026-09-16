import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Settings, User as UserIcon, Moon, Sun } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useUiStore } from '../../stores/ui.store';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUiStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) return null;

  // Get user initials for the avatar
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center rounded-full border border-indigo-200 shadow-sm hover:bg-indigo-200 transition-colors">
          <span className="text-sm tracking-tighter">{initials}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-50 overflow-hidden transform origin-top-right transition-all">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          
          <div className="p-1">
            <button
              onClick={() => {
                setIsOpen(false);
                // Handle navigation to profile in a real app
                // navigate('/profile')
              }}
              className="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <UserIcon className="w-4 h-4 mr-2 text-slate-400" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                // Handle navigation to settings
              }}
              className="w-full text-left flex items-center px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2 text-slate-400" />
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center">
                {theme === 'dark' ? (
                  <Moon className="w-4 h-4 mr-2 text-slate-400" />
                ) : (
                  <Sun className="w-4 h-4 mr-2 text-slate-400" />
                )}
                <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <div className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
          
          <div className="p-1 border-t border-slate-100">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2 text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
