import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNextActivity } from '../api/learning.api';

export function useNextActivity(courseId: string) {
  return useQuery({
    queryKey: ['learning', 'next', courseId],
    queryFn: () => getNextActivity(courseId),
  });
}
