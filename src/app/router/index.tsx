import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { AuthGuard, RoleGuard } from '../guards/AuthGuard';
import { LoginForm } from '../../features/auth/components/LoginForm';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { SelectOrganizationPage } from '../../features/auth/pages/SelectOrganizationPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { DashboardRouter } from '../../features/dashboard/components/DashboardRouter';
import { CourseCatalog } from '../../features/courses/components/CourseCatalog';
import { LearningPlayer } from '../../features/learning/components/LearningPlayer';
import { AssessmentPlayer } from '../../features/assessments/components/AssessmentPlayer';
import { AITutor } from '../../features/ai-tutor/components/AITutor';
import { CourseDetails } from '../../features/courses/components/CourseDetails';
import { QuestionBank } from '../../features/question-bank/components/QuestionBank';
import { LearnerProgress } from '../../features/progress/components/LearnerProgress';
import { UserManagement } from '../../features/admin/components/UserManagement';
import { OrgManagement } from '../../features/admin/components/OrgManagement';
import { AuditLogs } from '../../features/admin/components/AuditLogs';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginForm />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'select-organization',
        element: <SelectOrganizationPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '',
        element: <Navigate to="/auth/login" replace />
      }
    ]
  },
  {
    path: '/',
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      {
        index: true,
        element: <DashboardRouter />
      },
      {
        path: 'courses',
        element: <CourseCatalog />
      },
      {
        path: 'courses/:courseId',
        element: <CourseDetails />
      },
      {
        path: 'progress',
        element: <LearnerProgress />
      },
      {
        path: 'learning/:courseId',
        element: <LearningPlayer />
      },
      {
        path: 'assessments/:assessmentId/attempt',
        element: <AssessmentPlayer />
      },
      {
        path: 'ai-tutor',
        element: <AITutor />
      },
      {
        path: 'instructor/question-bank',
        element: <RoleGuard allowedRoles={['instructor', 'sys_admin']}><QuestionBank /></RoleGuard>
      },
      {
        path: 'admin/users',
        element: <RoleGuard allowedRoles={['sys_admin']}><UserManagement /></RoleGuard>
      },
      {
        path: 'admin/organizations',
        element: <RoleGuard allowedRoles={['sys_admin']}><OrgManagement /></RoleGuard>
      },
      {
        path: 'admin/audit-logs',
        element: <RoleGuard allowedRoles={['sys_admin']}><AuditLogs /></RoleGuard>
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);



export function AppRouter() {
  return <RouterProvider router={router} />;
}
