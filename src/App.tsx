import React from 'react';
import { AppProvider } from './app/providers/AppProvider';
import { AppRouter } from './app/router';

export default function App() {
  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-slate-50">
        {/* Global Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm shrink-0 z-50">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-inner">
                <span className="text-white font-bold text-lg leading-none">A</span>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">AdaptiveLMS Platform</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
              <a href="#" className="hidden sm:inline hover:text-indigo-600 transition-colors">Help Center</a>
              <a href="#" className="hidden sm:inline hover:text-indigo-600 transition-colors">System Status</a>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
          <AppRouter />
        </main>

        {/* Global Footer */}
        <footer className="bg-slate-900 text-slate-400 py-5 shrink-0 border-t border-slate-800">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium tracking-wide">
            <p>&copy; {new Date().getFullYear()} AdaptiveLMS Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
