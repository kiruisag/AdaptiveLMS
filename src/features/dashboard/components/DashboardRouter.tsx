import React from 'react';
import { useAuthStore } from '../../../stores/auth.store';
import { LearnerDashboard } from './LearnerDashboard';
import { AdminDashboard } from './AdminDashboard';
import { InstructorDashboard } from '../../instructor/components/InstructorDashboard';

export function DashboardRouter() {
  const { user, activeTenant } = useAuthStore();

  if (!user) return null;

  const currentRole = activeTenant?.role ?? user.role ?? 'learner';

  switch (currentRole) {
    case 'learner':
      return <LearnerDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'org_admin':
      return <div>Organization Admin Dashboard Placeholder</div>;
    case 'sys_admin':
      return <AdminDashboard />;
    default:
      return <div>Unknown role dashboard</div>;
  }
}
