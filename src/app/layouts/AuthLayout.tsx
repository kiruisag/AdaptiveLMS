import React from 'react';
import { Outlet } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="absolute inset-0 bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <BookOpen className="w-12 h-12 text-indigo-600 mb-4" />
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
          AdaptiveLMS
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Intelligent Learning Management System
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
