import React from 'react';
import { ShieldAlert, Search, Filter, Clock, ArrowRight, User } from 'lucide-react';

const mockLogs = [
  { id: 'log_1', action: 'system.settings.update', resource: 'Global Auth Config', actor: 'Sarah Connor', ip: '192.168.1.1', time: '10 mins ago', status: 'success' },
  { id: 'log_2', action: 'user.login.failed', resource: 'Account: admin@example.com', actor: 'Unknown', ip: '45.33.22.1', time: '25 mins ago', status: 'failure' },
  { id: 'log_3', action: 'org.subscription.upgrade', resource: 'Acme Corp', actor: 'System Worker', ip: 'Internal', time: '1 hour ago', status: 'success' },
  { id: 'log_4', action: 'course.delete', resource: 'Legacy Python 101', actor: 'John Smith', ip: '10.0.0.4', time: '3 hours ago', status: 'success' },
  { id: 'log_5', action: 'user.role.grant', resource: 'Emma Davis -> instructor', actor: 'Sarah Connor', ip: '192.168.1.1', time: '5 hours ago', status: 'success' },
];

export function AuditLogs() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-slate-500">Track and monitor security events, configuration changes, and system access.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50">
          <div className="relative w-full sm:w-[500px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by action, resource, or IP address..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Advanced Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action & Resource</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="w-4 h-4 mr-2 text-slate-400" />
                      {log.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-mono font-semibold text-slate-900">{log.action}</p>
                      <div className="flex items-center mt-1 text-xs text-slate-500">
                        <ArrowRight className="w-3 h-3 mr-1" />
                        {log.resource}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm font-medium text-slate-700">
                      <User className="w-4 h-4 mr-2 text-slate-400" />
                      {log.actor}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">
                    {log.ip}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      log.status === 'success' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
