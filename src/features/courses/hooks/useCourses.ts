import { useQuery } from '@tanstack/react-query';
import { getCourses } from '../api/courses.api';

export function useCourses(filters?: { search?: string; difficulty?: string }) {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => getCourses(filters),
  });
}
