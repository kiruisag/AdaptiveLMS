import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store';
import { BookOpen, LogOut, LayoutDashboard, Settings } from 'lucide-react';

export function AppLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="absolute inset-0 bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span className="text-xl font-bold">AdaptiveLMS</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            <span>Dashboard</span>
          </Link>
          <Link to="/courses" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
            <BookOpen className="w-5 h-5 text-slate-400" />
            <span>Courses</span>
          </Link>
          <Link to="/ai-tutor" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>AI Tutor</span>
          </Link>
          <div className="pt-4 pb-2">
            <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</p>
          </div>
          <Link to="/assessments/a1/attempt" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Assessments</span>
          </Link>
          <Link to="/progress" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
            <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
            <span>Progress</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-sm">
                <p className="font-medium truncate max-w-[120px]">{user?.name}</p>
                <p className="text-xs text-slate-400">{user?.role}</p>
              </div>
            </div>
            <button onClick={logout} className="p-1 hover:text-red-400 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Top Header for Mobile & Actions */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center md:hidden">
             <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
             <span className="font-bold text-slate-900">AdaptiveLMS</span>
          </div>
          <div className="hidden md:block">
            {/* Page title or breadcrumbs could go here */}
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-500 hover:text-slate-700">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
