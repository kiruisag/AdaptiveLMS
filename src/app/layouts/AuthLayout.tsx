import React from 'react';
import { Outlet } from 'react-router-dom';
import { BookOpen, Sparkles, Network, TrendingUp, Cpu } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Hidden on mobile, visible on lg screens */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600 blur-[150px]"></div>
        </div>

        {/* Top Content */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl backdrop-blur-sm border border-indigo-500/30">
            <BookOpen className="w-8 h-8 text-indigo-400" />
          </div>
          <span className="text-2xl font-bold tracking-tight">AdaptiveLMS</span>
        </div>

        {/* Middle Visual/Abstract Experience */}
        <div className="relative z-10 flex-1 flex items-center justify-center py-12">
          <div className="w-full max-w-lg relative">
            {/* Abstract floating UI representations */}
            <div className="absolute top-0 left-4 w-64 h-32 bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 p-4 transform -rotate-6 animate-pulse shadow-2xl">
              <div className="flex items-center space-x-3 mb-3">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <div className="h-4 bg-slate-700 rounded w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-slate-700/50 rounded w-full"></div>
                <div className="h-2 bg-slate-700/50 rounded w-4/5"></div>
              </div>
            </div>

            <div className="absolute top-24 right-0 w-72 h-40 bg-indigo-900/40 backdrop-blur-md rounded-2xl border border-indigo-500/30 p-5 transform rotate-3 shadow-2xl z-20">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-medium text-slate-300">Learning Path</span>
                 </div>
                 <span className="text-xs font-bold text-emerald-400">+24%</span>
               </div>
               <div className="space-y-3">
                 <div className="flex items-center space-x-3">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><Cpu className="w-4 h-4 text-slate-400"/></div>
                   <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 w-3/4 rounded-full"></div>
                   </div>
                 </div>
                 <div className="flex items-center space-x-3">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center"><Network className="w-4 h-4 text-slate-400"/></div>
                   <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 w-1/2 rounded-full"></div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            Learning that adapts to you.
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Personalized learning paths powered by AI, intelligent assessments, and real-time learner insights for modern organizations.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 relative bg-white">
        {/* Mobile Logo */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center space-x-2">
           <BookOpen className="w-6 h-6 text-indigo-600" />
           <span className="text-xl font-bold text-slate-900">AdaptiveLMS</span>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
