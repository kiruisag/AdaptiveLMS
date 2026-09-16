import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../stores/auth.store';
import { 
  BookOpen, LogOut, LayoutDashboard, Settings, Users, Building2, ShieldAlert,
  Bot, TrendingUp, CheckSquare, Award, BookMarked, FileQuestion, PieChart, CreditCard, Activity
} from 'lucide-react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { GlobalSearch } from '../../components/ui/GlobalSearch';
import { NotificationBell } from '../../components/ui/NotificationBell';
import { UserMenu } from '../../components/ui/UserMenu';

export function AppLayout() {
  const { user, logout } = useAuth();
  
  return (
    <div className="absolute inset-0 bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-2">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span className="text-xl font-bold">AdaptiveLMS</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Link to="/" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            <span>Dashboard</span>
          </Link>
          
          <div className="pt-4 pb-2">
            <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Learning</p>
          </div>
          <Link to="/courses" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
            <BookOpen className="w-5 h-5 text-slate-400" />
            <span>Courses</span>
          </Link>
          <Link to="/ai-tutor" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
            <Bot className="w-5 h-5 text-slate-400" />
            <span>AI Tutor</span>
          </Link>
          <Link to="/progress" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            <span>My Progress</span>
          </Link>
          <Link to="/assessments/a1/attempt" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
            <CheckSquare className="w-5 h-5 text-slate-400" />
            <span>Assessments</span>
          </Link>
          <Link to="/certificates" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
            <Award className="w-5 h-5 text-slate-400" />
            <span>Certificates</span>
          </Link>

          {(user?.role === 'sys_admin' || user?.role === 'org_admin' || user?.role === 'instructor') && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Teaching & Content</p>
              </div>
              <Link to="/instructor/courses" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
                <BookMarked className="w-5 h-5 text-slate-400" />
                <span>Course Management</span>
              </Link>
              <Link to="/instructor/question-bank" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
                <FileQuestion className="w-5 h-5 text-slate-400" />
                <span>Question Bank</span>
              </Link>
              <Link to="/instructor/analytics" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
                <PieChart className="w-5 h-5 text-slate-400" />
                <span>Instructor Analytics</span>
              </Link>
            </>
          )}

          {(user?.role === 'sys_admin' || user?.role === 'org_admin') && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</p>
              </div>
              <Link to="/admin/users" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
                <Users className="w-5 h-5 text-slate-400" />
                <span>Users & Roles</span>
              </Link>
              <Link to="/admin/organizations" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
                <Building2 className="w-5 h-5 text-slate-400" />
                <span>Organizations</span>
              </Link>
              <Link to="/admin/billing" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <span>Billing & Subscriptions</span>
              </Link>

              {user?.role === 'sys_admin' && (
                <>
                  <Link to="/admin/analytics" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
                    <Activity className="w-5 h-5 text-slate-400" />
                    <span>System Analytics</span>
                  </Link>
                  <Link to="/admin/audit-logs" className="flex items-center space-x-3 p-2 rounded hover:bg-slate-800 transition-colors">
                    <ShieldAlert className="w-5 h-5 text-slate-400" />
                    <span>Audit Logs</span>
                  </Link>
                </>
              )}
            </>
          )}
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
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 gap-4 z-50 relative">
          <div className="flex items-center md:hidden shrink-0">
             <BookOpen className="w-6 h-6 text-indigo-600 mr-2" />
             <span className="font-bold text-slate-900">AdaptiveLMS</span>
          </div>
          
          <div className="hidden md:block overflow-hidden min-w-max mr-4">
            <Breadcrumbs />
          </div>

          <div className="flex-1 max-w-xl">
            <GlobalSearch />
          </div>

          <div className="flex items-center space-x-4 shrink-0">
            <NotificationBell />
            <UserMenu />
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
