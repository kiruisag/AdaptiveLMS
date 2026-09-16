import React from 'react';
import { AppIcon } from '../../../components/ui/AppIcon';

const mockOrgs = [
  { id: 'org_1', name: 'Acme Corp', domain: 'acme.com', plan: 'Enterprise', users: 1250, status: 'active', joined: 'Oct 2023' },
  { id: 'org_2', name: 'Global Tech', domain: 'globaltech.io', plan: 'Pro', users: 45, status: 'active', joined: 'Jan 2024' },
  { id: 'org_3', name: 'Nexus Industries', domain: 'nexus.net', plan: 'Enterprise', users: 890, status: 'pending', joined: 'Mar 2024' },
  { id: 'org_4', name: 'Stark Labs', domain: 'stark.io', plan: 'Basic', users: 12, status: 'active', joined: 'Mar 2024' },
];

export function OrgManagement() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
          <p className="text-slate-500">Manage tenant organizations, billing, and global settings.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <AppIcon name="plus" className="w-4 h-4" />
            <span>Create Organization</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50">
          <div className="relative w-full sm:w-96">
            <AppIcon name="magnifying-glass" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search organizations..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
            <AppIcon name="filter" className="w-4 h-4 text-slate-500" />
            <span>Filters</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Organization</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan & Billing</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockOrgs.map((org) => (
                <tr key={org.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <AppIcon name="building" className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{org.name}</p>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                          <AppIcon name="link" className="w-3 h-3 mr-1" />
                          {org.domain}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <AppIcon name="credit-card" className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{org.plan}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-slate-700 font-medium">
                      <AppIcon name="users" className="w-4 h-4 mr-2 text-slate-400" />
                      {org.users.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      org.status === 'active' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <AppIcon name="ellipsis-vertical" className="w-4 h-4" />
                    </button>
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
