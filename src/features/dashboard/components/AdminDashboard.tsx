import React from 'react';
import { AppIcon } from '../../../components/ui/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const revenueData = [
  { name: 'Jan', revenue: 4000, activeUsers: 2400 },
  { name: 'Feb', revenue: 5000, activeUsers: 3100 },
  { name: 'Mar', revenue: 6500, activeUsers: 4200 },
  { name: 'Apr', revenue: 8000, activeUsers: 5800 },
  { name: 'May', revenue: 9500, activeUsers: 7100 },
  { name: 'Jun', revenue: 11000, activeUsers: 8900 },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
          <p className="text-slate-500">Platform metrics, AI health, learning analytics, and real-time statistics.</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-sm font-medium text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">24,592</h3>
            </div>
            <div className="p-2 bg-indigo-50 rounded-lg">
              <AppIcon name="users" className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center font-medium">
            <AppIcon name="arrow-trend-up" className="w-4 h-4 mr-1" /> +12% this month
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Organizations</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">148</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <AppIcon name="building" className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center font-medium">
            <AppIcon name="arrow-trend-up" className="w-4 h-4 mr-1" /> +5 this week
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Monthly Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">$45,200</h3>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <AppIcon name="credit-card" className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center font-medium">
            <AppIcon name="arrow-trend-up" className="w-4 h-4 mr-1" /> +8.4% this month
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">AI Tutor Queries</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">1.2M</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <AppIcon name="microchip" className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-4 flex items-center font-medium">
            <AppIcon name="arrow-trend-up" className="w-4 h-4 mr-1" /> +24% this month
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Platform Analytics & Engagement</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} dx={10} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5', strokeWidth: 0}} activeDot={{r: 6, strokeWidth: 0}} name="Subscription Rev" />
                <Line yAxisId="right" type="monotone" dataKey="activeUsers" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#0ea5e9', strokeWidth: 0}} activeDot={{r: 6, strokeWidth: 0}} name="Active Learners" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sub-systems Health */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Infrastructure & AI Health</h3>
          <div className="space-y-3 flex-1">
            {[
              { name: 'Core API Services', status: 'Healthy', uptime: '99.99%', icon: 'wave-square', color: 'text-green-500' },
              { name: 'Real-time WebSockets', status: 'Healthy', uptime: '99.98%', icon: 'signal', color: 'text-green-500' },
              { name: 'Primary Database', status: 'Healthy', uptime: '100%', icon: 'database', color: 'text-green-500' },
              { name: 'RAG Vector Store', status: 'Degraded (High Load)', uptime: '98.50%', icon: 'microchip', color: 'text-orange-500' },
              { name: 'Video CDN', status: 'Healthy', uptime: '99.99%', icon: 'play-circle', color: 'text-green-500' },
              { name: 'Assessment Engine', status: 'Healthy', uptime: '100%', icon: 'clipboard-check', color: 'text-green-500' },
            ].map((sys, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <AppIcon name={sys.icon as string} className={`w-4 h-4 ${sys.color}`} />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{sys.name}</p>
                    <p className="text-xs text-slate-500">{sys.status} • {sys.uptime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
