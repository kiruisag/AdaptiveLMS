export interface CourseDTO {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail_url?: string;
  duration_minutes: number;
  instructor_name: string;
  enrollment_status?: 'not_enrolled' | 'enrolled' | 'completed';
  progress_percentage?: number;
}
