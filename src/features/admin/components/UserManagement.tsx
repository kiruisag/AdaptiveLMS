import React from 'react';
import { Search, Plus, Filter, MoreVertical, Shield, User, Mail, CheckCircle, XCircle } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Sarah Connor', email: 'sarah@example.com', role: 'sys_admin', status: 'active', lastActive: '2 mins ago' },
  { id: '2', name: 'John Smith', email: 'john@example.com', role: 'instructor', status: 'active', lastActive: '1 hour ago' },
  { id: '3', name: 'Emma Davis', email: 'emma@example.com', role: 'learner', status: 'active', lastActive: '5 hours ago' },
  { id: '4', name: 'Michael Chang', email: 'michael@example.com', role: 'org_admin', status: 'inactive', lastActive: '2 weeks ago' },
  { id: '5', name: 'Jessica Taylor', email: 'jessica@example.com', role: 'learner', status: 'active', lastActive: '1 day ago' },
];

export function UserManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500">Manage platform users, roles, and access controls.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            <span>Invite User</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
            <Filter className="w-4 h-4 text-slate-500" />
            <span>Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-indigo-700">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Shield className={`w-4 h-4 mr-2 ${user.role === 'sys_admin' ? 'text-red-500' : 'text-slate-400'}`} />
                      <span className="text-sm font-medium text-slate-700">
                        {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        <XCircle className="w-3 h-3" />
                        <span>Inactive</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
          <p>Showing 1 to 5 of 24,592 entries</p>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-700 hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
