import { apiClient } from './client';
import { UserDTO, TenantDTO } from '../../types/api.types';

export const authApi = {
  login: async (credentials: { email: string; password?: string }) => {
    // In a real implementation:
    // const { data } = await apiClient.post<{ user: UserDTO; token: string }>('/auth/login', credentials);
    // return data;
    
    // MOCK IMPLEMENTATION
    await new Promise(resolve => setTimeout(resolve, 800));
    if (credentials.email.includes('error')) throw new Error('Invalid credentials');
    
    const mockTenants: TenantDTO[] = [
      { id: 't1', name: 'Acme University', slug: 'acme-u', type: 'university', role: 'learner' },
      { id: 't2', name: 'Acme Training', slug: 'acme-training', type: 'corporate', role: 'instructor' }
    ];
    
    let userRole = 'learner';
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
        role: userRole as any,
      } as UserDTO,
      token: 'mock-jwt-token-123'
    };
  },
  
  me: async () => {
    // return (await apiClient.get<UserDTO>('/auth/me')).data;
    await new Promise(resolve => setTimeout(resolve, 500));
    const role = localStorage.getItem('mock_user_role') || 'learner';
    const email = localStorage.getItem('mock_user_email') || 'learner@example.com';
    return {
      id: "1",
      name: role === 'sys_admin' ? "Test Admin" : "Test Learner",
      email: email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tenants: [
        { id: 't1', name: 'Acme University', slug: 'acme-u', type: 'university', role: 'learner' },
        { id: 't2', name: 'Acme Training', slug: 'acme-training', type: 'corporate', role: 'instructor' }
      ],
      role: role as any,
    } as UserDTO;
  },

  registerOrganization: async (data: any) => {
    // MOCK
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  }
};
