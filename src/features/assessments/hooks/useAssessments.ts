import { useQuery, useMutation } from '@tanstack/react-query';
import { getAssessment, submitAssessment } from '../api/assessments.api';

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ['assessment', id],
    queryFn: () => getAssessment(id),
  });
}

export function useSubmitAssessment() {
  return useMutation({
    mutationFn: submitAssessment,
  });
}
