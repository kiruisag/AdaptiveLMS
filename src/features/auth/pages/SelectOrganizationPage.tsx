import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../stores/auth.store';
import { useTenant } from '../../../app/providers/TenantProvider';
import { AppIcon } from '../../../components/ui/AppIcon';
import { TenantDTO } from '../../../types/api.types';

export function SelectOrganizationPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { setTenant } = useTenant();
  
  const token = localStorage.getItem('temp_access_token');
  const userStr = localStorage.getItem('temp_user');
  
  useEffect(() => {
    if (!token || !userStr) {
      navigate('/auth/login');
    }
  }, [token, userStr, navigate]);

  if (!token || !userStr) return null;
  
  const user = JSON.parse(userStr);
  const tenants = user.tenants as TenantDTO[];

  const handleSelectTenant = (tenant: TenantDTO) => {
    // Clear temporary auth data
    localStorage.removeItem('temp_access_token');
    localStorage.removeItem('temp_user');
    
    // Set active organization in context
    setTenant(tenant);
    
    // Finalize authentication which globally stores session and triggers UI updates
    setAuth(user, token);
    
    // Redirect to dashboard now that tenant context is established
    navigate('/');
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 hidden lg:block">
        <AppIcon name="book-open" className="w-10 h-10 text-indigo-600 mb-6" />
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Select Organization</h2>
        <p className="mt-2 text-slate-500 text-sm">Where would you like to continue?</p>
      </div>

      <div className="mb-8 lg:hidden">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Select Organization</h2>
        <p className="mt-2 text-slate-500 text-sm">Where would you like to continue?</p>
      </div>

      <div className="space-y-4">
        {tenants.map((tenant) => (
          <button
            key={tenant.id}
            onClick={() => handleSelectTenant(tenant)}
            className="w-full flex items-center justify-between p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all group text-left"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <AppIcon name="building" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{tenant.name}</h3>
                <p className="text-sm text-slate-500 capitalize">{tenant.role.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
              <AppIcon name="chevron-right" className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center text-sm">
        <button
          onClick={() => {
            localStorage.removeItem('temp_access_token');
            localStorage.removeItem('temp_user');
            navigate('/auth/login');
          }}
          className="font-medium text-slate-500 hover:text-slate-700"
        >
          Cancel and go back
        </button>
      </div>
    </div>
  );
}
