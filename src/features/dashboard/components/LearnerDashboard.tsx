import React from 'react';
import { useAuthStore } from '../../../stores/auth.store';
import { AppIcon } from '../../../components/ui/AppIcon';

export function LearnerDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}</h1>
          <p className="text-slate-500 mt-1">Here is what's happening with your learning today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric Cards */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-indigo-100 p-3 rounded-full">
            <AppIcon name="trophy" className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Learning Streak</p>
            <p className="text-2xl font-bold text-slate-900">12 Days</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <AppIcon name="bullseye" className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg. Mastery</p>
            <p className="text-2xl font-bold text-slate-900">76%</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <AppIcon name="book-open" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Courses Completed</p>
            <p className="text-2xl font-bold text-slate-900">4</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex items-center space-x-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <AppIcon name="clock" className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Learning Hours</p>
            <p className="text-2xl font-bold text-slate-900">32h</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Continue Learning</h2>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:border-indigo-300 transition-colors cursor-pointer flex flex-col sm:flex-row">
              <div className="w-full sm:w-48 h-32 bg-slate-100 flex items-center justify-center shrink-0 border-r border-slate-100">
                <AppIcon name="book-open" className="w-12 h-12 text-slate-300" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">Course</p>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">Introduction to Machine Learning</h3>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Progress
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">Module 4: Neural Networks Fundamentals</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                   <div className="flex-1 mr-4">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">45% Complete</p>
                   </div>
                   <button className="flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors">
                     <AppIcon name="play" className="w-4 h-4" />
                     <span>Resume</span>
                   </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar / Recommendations */}
        <div className="space-y-6">
          <section className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recommended Next</h2>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg shrink-0 mt-1">
                  <AppIcon name="bullseye" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Equivalent Fractions Practice</h4>
                  <p className="text-xs text-slate-600 mt-1">Based on your recent assessment, we recommend reviewing this topic.</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs font-medium text-slate-500">15 mins • Intermediate</span>
                    <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Start Activity &rarr;</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
