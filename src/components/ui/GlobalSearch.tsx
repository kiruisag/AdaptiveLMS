import React, { useState, useEffect, useRef } from 'react';
import { AppIcon } from './AppIcon';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';

const mockResults = {
  courses: [
    { id: 'c1', title: 'Advanced Machine Learning', type: 'Course' },
    { id: 'c2', title: 'Introduction to React', type: 'Course' },
  ],
  admin: [
    { id: 'a1', title: 'User Management', type: 'Setting', path: '/admin/users' },
    { id: 'a2', title: 'Organization Billing', type: 'Setting', path: '/admin/billing' },
  ]
};

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleResultClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
    setIsOpen(false);
    setQuery('');
  };

  const isAdmin = user?.role === 'sys_admin' || user?.role === 'org_admin';

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className={`relative flex items-center w-full transition-all duration-200 ${isOpen ? 'ring-2 ring-indigo-500 rounded-lg' : ''}`}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AppIcon name="magnifying-glass" className="h-4 w-4 text-slate-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="block w-full pl-10 pr-12 py-2 border border-slate-300 rounded-lg leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 sm:text-sm transition-colors"
          placeholder="Search courses, users, or settings..."
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-slate-400 sm:text-xs text-[10px] font-medium border border-slate-200 rounded px-1.5 py-0.5 bg-white flex items-center gap-1 shadow-sm">
            <AppIcon name="keyboard" className="w-3 h-3" />K
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {!query ? (
              <div className="p-4 text-center text-sm text-slate-500">
                <AppIcon name="magnifying-glass" className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>Start typing to search across the platform...</p>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">React</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">Machine Learning</span>
                  {isAdmin && <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">Billing</span>}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Courses Section */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Courses & Content</h3>
                  <ul className="space-y-1">
                    {mockResults.courses.filter(c => c.title.toLowerCase().includes(query.toLowerCase())).map(course => (
                      <li key={course.id}>
                        <button 
                          onClick={() => handleResultClick('/courses')}
                          className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
                              <AppIcon name="book-open" className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{course.title}</span>
                          </div>
                          <AppIcon name="arrow-right" className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Admin Section */}
                {isAdmin && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Administration</h3>
                    <ul className="space-y-1">
                      {mockResults.admin.filter(s => s.title.toLowerCase().includes(query.toLowerCase())).map(setting => (
                        <li key={setting.id}>
                          <button 
                            onClick={() => handleResultClick(setting.path)}
                            className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-slate-100 text-slate-600 rounded-md">
                                {setting.title.includes('User') ? <AppIcon name="users" className="w-4 h-4" /> : <AppIcon name="gear" className="w-4 h-4" />}
                              </div>
                              <span className="font-medium">{setting.title}</span>
                            </div>
                            <AppIcon name="arrow-right" className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* No Results */}
                {mockResults.courses.filter(c => c.title.toLowerCase().includes(query.toLowerCase())).length === 0 &&
                 (!isAdmin || mockResults.admin.filter(s => s.title.toLowerCase().includes(query.toLowerCase())).length === 0) && (
                  <div className="p-4 text-center text-sm text-slate-500">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center rounded-b-xl">
            <span className="flex items-center gap-1">
              Navigate with <span className="inline-flex items-center justify-center p-1 border border-slate-200 bg-white rounded shadow-sm leading-none">&#8593;</span> <span className="inline-flex items-center justify-center p-1 border border-slate-200 bg-white rounded shadow-sm leading-none">&#8595;</span>
            </span>
            <span className="flex items-center gap-1">
              Select with <span className="inline-flex items-center justify-center px-1.5 py-1 border border-slate-200 bg-white rounded shadow-sm leading-none font-mono">↵</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
