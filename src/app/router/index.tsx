import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { AuthGuard } from '../guards/AuthGuard';

import { LoginForm } from '../../features/auth/components/LoginForm';
import { MfaChallengePage } from '../../features/auth/pages/MfaChallengePage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { SelectOrganizationPage } from '../../features/auth/pages/SelectOrganizationPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage';
import { SessionsPage } from '../../features/auth/pages/SessionsPage';

import { DashboardRouter } from '../../features/dashboard/components/DashboardRouter';

import { CourseCatalog } from '../../features/courses/components/CourseCatalog';
import { CourseDetails } from '../../features/courses/components/CourseDetails';

import { LearningPlayer } from '../../features/learning/components/LearningPlayer';

import { AssessmentPlayer } from '../../features/assessments/components/AssessmentPlayer';

import { AITutor } from '../../features/ai-tutor/components/AITutor';

import { QuestionBank } from '../../features/question-bank/components/QuestionBank';

import { LearnerProgress } from '../../features/progress/components/LearnerProgress';

import { UserManagement } from '../../features/admin/components/UserManagement';
import { OrganizationManagementPage } from '../../features/organization/pages/OrganizationManagementPage';
import { AuditLogs } from '../../features/admin/components/AuditLogs';

const router = createBrowserRouter([
  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */
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
        path: 'mfa',
        element: <MfaChallengePage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'verify-email',
        element: <VerifyEmailPage />,
      },
      {
        index: true,
        element: <Navigate to="/auth/login" replace />,
      },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | Password Reset
  |--------------------------------------------------------------------------
  |
  | Password reset links arrive from email at /reset-password.
  | This route is public and must not be protected by AuthGuard.
  |
  */
  {
    path: '/reset-password',
    element: (
      <AuthLayout />
    ),
    children: [
      {
        index: true,
        element: <ResetPasswordPage />,
      },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | Authenticated Application
  |--------------------------------------------------------------------------
  |
  | Authorization is handled by the backend menu/permission system.
  | The router defines which frontend pages exist; it does not decide
  | whether a user is allowed to see them.
  |
  */
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout />
      </AuthGuard>
    ),
    children: [
      /*
      |--------------------------------------------------------------------------
      | Dashboard
      |--------------------------------------------------------------------------
      */
      {
        path: 'dashboard',
        element: <DashboardRouter />,
      },

      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },

      /*
      |--------------------------------------------------------------------------
      | Learning
      |--------------------------------------------------------------------------
      */
      {
        path: 'my/learning',
        element: <LearnerProgress />,
      },
      {
        path: 'catalog',
        element: <CourseCatalog />,
      },
      {
        path: 'courses/:courseId',
        element: <CourseDetails />,
      },
      {
        path: 'paths',
        element: <CourseCatalog />,
      },
      {
        path: 'enrollments',
        element: <LearnerProgress />,
      },
      {
        path: 'calendar',
        element: <LearnerProgress />,
      },

      /*
      |--------------------------------------------------------------------------
      | Learning Player
      |--------------------------------------------------------------------------
      */
      {
        path: 'learning/:courseId',
        element: <LearningPlayer />,
      },

      /*
      |--------------------------------------------------------------------------
      | Content Studio
      |--------------------------------------------------------------------------
      */
      {
        path: 'studio/courses',
        element: <CourseCatalog />,
      },
      {
        path: 'studio/assets',
        element: <CourseCatalog />,
      },
      {
        path: 'studio/questions',
        element: <QuestionBank />,
      },
      {
        path: 'studio/templates',
        element: <CourseCatalog />,
      },
      {
        path: 'studio/imports',
        element: <CourseCatalog />,
      },

      /*
      |--------------------------------------------------------------------------
      | Adaptive Engine
      |--------------------------------------------------------------------------
      */
      {
        path: 'adaptive/skills',
        element: <CourseCatalog />,
      },
      {
        path: 'adaptive/graph',
        element: <CourseCatalog />,
      },
      {
        path: 'adaptive/mastery',
        element: <LearnerProgress />,
      },
      {
        path: 'adaptive/rules',
        element: <CourseCatalog />,
      },
      {
        path: 'adaptive/recommendations',
        element: <CourseCatalog />,
      },
      {
        path: 'adaptive/simulator',
        element: <CourseCatalog />,
      },

      /*
      |--------------------------------------------------------------------------
      | Assessment
      |--------------------------------------------------------------------------
      */
      {
        path: 'assessments',
        element: <AssessmentPlayer />,
      },
      {
        path: 'assessments/:assessmentId/attempt',
        element: <AssessmentPlayer />,
      },
      {
        path: 'assessments/analysis',
        element: <LearnerProgress />,
      },
      {
        path: 'assessments/rubrics',
        element: <CourseCatalog />,
      },
      {
        path: 'assessments/proctoring',
        element: <CourseCatalog />,
      },
      {
        path: 'assessments/results',
        element: <LearnerProgress />,
      },

      /*
      |--------------------------------------------------------------------------
      | Analytics
      |--------------------------------------------------------------------------
      */
      {
        path: 'analytics',
        element: <LearnerProgress />,
      },
      {
        path: 'analytics/learners',
        element: <LearnerProgress />,
      },
      {
        path: 'analytics/mastery',
        element: <LearnerProgress />,
      },
      {
        path: 'analytics/engagement',
        element: <LearnerProgress />,
      },
      {
        path: 'analytics/at-risk',
        element: <LearnerProgress />,
      },
      {
        path: 'analytics/reports',
        element: <LearnerProgress />,
      },

      /*
      |--------------------------------------------------------------------------
      | Engagement
      |--------------------------------------------------------------------------
      */
      {
        path: 'announcements',
        element: <CourseCatalog />,
      },
      {
        path: 'discussions',
        element: <CourseCatalog />,
      },
      {
        path: 'gamification',
        element: <CourseCatalog />,
      },
      {
        path: 'notifications/templates',
        element: <CourseCatalog />,
      },

      /*
      |--------------------------------------------------------------------------
      | Credentials
      |--------------------------------------------------------------------------
      */
      {
        path: 'credentials/certificates',
        element: <CourseCatalog />,
      },
      {
        path: 'credentials/badges',
        element: <CourseCatalog />,
      },
      {
        path: 'credentials/compliance',
        element: <CourseCatalog />,
      },

      /*
      |--------------------------------------------------------------------------
      | Administration
      |--------------------------------------------------------------------------
      */
      {
        path: 'settings/members',
        element: <UserManagement />,
      },
      {
        path: 'settings/groups',
        element: <OrganizationManagementPage />,
      },
      {
        path: 'settings/roles',
        element: <OrganizationManagementPage />,
      },
      {
        path: 'settings/integrations',
        element: <CourseCatalog />,
      },
      {
        path: 'settings/branding',
        element: <CourseCatalog />,
      },
      {
        path: 'settings/billing',
        element: <CourseCatalog />,
      },
      {
        path: 'settings/audit',
        element: <AuditLogs />,
      },

      /*
      |--------------------------------------------------------------------------
      | Platform
      |--------------------------------------------------------------------------
      */
      {
        path: 'platform/tenants',
        element: <OrganizationManagementPage />,
      },
      {
        path: 'platform/plans',
        element: <CourseCatalog />,
      },
      {
        path: 'platform/users',
        element: <UserManagement />,
      },
      {
        path: 'platform/roles',
        element: <OrganizationManagementPage />,
      },
      {
        path: 'platform/features',
        element: <CourseCatalog />,
      },
      {
        path: 'platform/integrations',
        element: <CourseCatalog />,
      },
      {
        path: 'platform/audit',
        element: <AuditLogs />,
      },
      {
        path: 'platform/health',
        element: <CourseCatalog />,
      },
      {
        path: 'platform/settings',
        element: <CourseCatalog />,
      },

      /*
      |--------------------------------------------------------------------------
      | AI Tutor
      |--------------------------------------------------------------------------
      */
      {
        path: 'ai-tutor',
        element: <AITutor />,
      },

      /*
      |--------------------------------------------------------------------------
      | Profile / Security
      |--------------------------------------------------------------------------
      */
      {
        path: 'profile',
        element: <SessionsPage />,
      },
      {
        path: 'security/sessions',
        element: <SessionsPage />,
      },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | Unknown routes
  |--------------------------------------------------------------------------
  */
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}