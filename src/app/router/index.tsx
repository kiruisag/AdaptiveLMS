import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import { AuthLayout } from '../layouts/AuthLayout';
import { AppLayout } from '../layouts/AppLayout';
import { AuthGuard } from '../guards/AuthGuard';

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/
import { LoginForm } from '../../features/auth/components/LoginForm';
import { MfaChallengePage } from '../../features/auth/pages/MfaChallengePage';
import { RegisterPage } from '../../features/auth/pages/RegisterPage';
import { SelectOrganizationPage } from '../../features/auth/pages/SelectOrganizationPage';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage';
import { VerifyEmailPage } from '../../features/auth/pages/VerifyEmailPage';
import { SessionsPage } from '../../features/auth/pages/SessionsPage';
import { AcceptInvitationPage } from '../../features/auth/pages/AcceptInvitationPage';
import { SecurityPage } from '../../features/auth/pages/SecuritySetupPage';
import { MfaSetupPage } from '../../features/auth/pages/MfaSetupPage';
/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/
import { ProfilePage } from '../../features/auth/pages/ProfilePage';

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
import { DashboardRouter } from '../../features/dashboard/components/DashboardRouter';

/*
|--------------------------------------------------------------------------
| Learning
|--------------------------------------------------------------------------
*/
import { CourseCatalog } from '../../features/courses/components/CourseCatalog';
import { CourseDetails } from '../../features/courses/components/CourseDetails';
import { LearningPlayer } from '../../features/learning/components/LearningPlayer';

/*
|--------------------------------------------------------------------------
| Assessment
|--------------------------------------------------------------------------
*/
import { AssessmentPlayer } from '../../features/assessments/components/AssessmentPlayer';

/*
|--------------------------------------------------------------------------
| AI Tutor
|--------------------------------------------------------------------------
*/
import { AITutor } from '../../features/ai-tutor/components/AITutor';

/*
|--------------------------------------------------------------------------
| Question Bank
|--------------------------------------------------------------------------
*/
import { QuestionBank } from '../../features/question-bank/components/QuestionBank';

/*
|--------------------------------------------------------------------------
| Progress
|--------------------------------------------------------------------------
*/
import { LearnerProgress } from '../../features/progress/components/LearnerProgress';

/*
|--------------------------------------------------------------------------
| Administration
|--------------------------------------------------------------------------
*/
import { UserManagement } from '../../features/admin/components/UserManagement';
import { AuditLogs } from '../../features/admin/components/AuditLogs';
import { OrganizationManagementPage } from '../../features/organization/pages/OrganizationManagementPage';

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
        element: (
          <Navigate
            to="/auth/login"
            replace
          />
        ),
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
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <ResetPasswordPage />,
      },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | Organization Invitation
  |--------------------------------------------------------------------------
  |
  | Invitation acceptance is public because invited users may not
  | have an authenticated session yet.
  |
  */
  {
    path: '/invitations/accept',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <AcceptInvitationPage />,
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
      | Profile & Security
      |--------------------------------------------------------------------------
      */
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'profile/sessions',
        element: <SessionsPage />,
      },
      {
        path: 'profile/security',
        element: <SecurityPage />,
      },
      {
        path: 'profile/security/mfa/setup',
        element: <MfaSetupPage />,
      },
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
        element: (
          <Navigate
            to="/dashboard"
            replace
          />
        ),
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
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | Unknown Routes
  |--------------------------------------------------------------------------
  */
  {
    path: '*',
    element: (
      <Navigate
        to="/dashboard"
        replace
      />
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}