import { apiClient } from './client';
import { TenantDTO, UserDTO } from '../../types/api.types';

export const authApi = {
  login: async (credentials: { email: string; password?: string }) => {
    // Replace this mock with the real Laravel endpoint when the backend is available.
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (credentials.email.includes('error')) {
      throw new Error('Invalid credentials');
    }

    const mockTenants: TenantDTO[] = [
      { id: 't1', name: 'Acme University', slug: 'acme-u', type: 'university', role: 'learner' },
      { id: 't2', name: 'Acme Training', slug: 'acme-training', type: 'corporate', role: 'instructor' },
    ];

    let userRole: UserDTO['role'] = 'learner';
    if (credentials.email.includes('admin')) userRole = 'sys_admin';
    if (credentials.email.includes('instructor')) userRole = 'instructor';

    return {
      user: {
        id: '1',
        name: credentials.email.split('@')[0],
        email: credentials.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tenants: mockTenants,
        role: userRole,
      } satisfies UserDTO,
      token: 'mock-jwt-token-123',
    };
  },

  me: async () => {
    // Real backend contract: GET /auth/me or /me returning the authenticated user.
    await new Promise((resolve) => setTimeout(resolve, 500));

    const role = 'learner' as UserDTO['role'];
    const email = 'learner@example.com';

    return {
      id: '1',
      name: role === 'sys_admin' ? 'Test Admin' : 'Test Learner',
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tenants: [
        { id: 't1', name: 'Acme University', slug: 'acme-u', type: 'university', role: 'learner' },
        { id: 't2', name: 'Acme Training', slug: 'acme-training', type: 'corporate', role: 'instructor' },
      ],
      role,
    } satisfies UserDTO;
  },

  logout: async () => {
    // Real implementation: POST /auth/logout
    return Promise.resolve();
  },

  loginWithGoogle: async () => {
    return authApi.login({ email: 'google-user@example.com', password: 'google' });
  },

  registerOrganization: async (data: unknown) => {
    // Mock registration: replace with the Laravel tenant registration endpoint.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, data };
  },
};
