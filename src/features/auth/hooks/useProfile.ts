import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { authApi } from '../../../services/api/auth.api';
import { useAuth } from '../../../stores/auth.store';

import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from '../types/profile.types';

export const profileKeys = {
  all: ['profile'] as const,

  me: () => [
    ...profileKeys.all,
    'me',
  ] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: authApi.me,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: UpdateProfilePayload,
    ) => authApi.updateProfile(payload),

    onSuccess: async (response) => {
      useAuth.setState({
        user: response.user,
      });

      queryClient.setQueryData(
        profileKeys.me(),
        response.user,
      );

      await queryClient.invalidateQueries({
        queryKey: profileKeys.me(),
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (
      payload: ChangePasswordPayload,
    ) => authApi.changePassword(payload),
  });
}