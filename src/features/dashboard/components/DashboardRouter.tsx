import React from 'react';
import { useAuthStore } from '../../../stores/auth.store';
import { LearnerDashboard } from './LearnerDashboard';
import { AdminDashboard } from './AdminDashboard';
import { InstructorDashboard } from '../../instructor/components/InstructorDashboard';

import type { UserRole } from '../../../types';
export function DashboardRouter() {
  const { user } = useAuthStore();

  if (!user) return null;

  // Role information will come from the authorization context.
  // It is intentionally nullable until that contract is exposed by the backend.
  const currentRole: UserRole | null = null;

  if (!currentRole) {
    return <LearnerDashboard />;
  }

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
