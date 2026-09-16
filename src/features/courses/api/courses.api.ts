import { apiClient } from '../../../api/client';
import { CourseDTO } from '../types/course.types';
import { PaginatedResponse } from '../../../types/api.types';

export async function getCourses(params?: { search?: string, difficulty?: string }): Promise<PaginatedResponse<CourseDTO>> {
  // Mock API implementation for now
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const mockCourses: CourseDTO[] = [
    {
      id: 'c1',
      title: 'Introduction to Machine Learning',
      description: 'Learn the fundamentals of machine learning algorithms and concepts.',
      category: 'Data Science',
      difficulty: 'intermediate',
      duration_minutes: 360,
      instructor_name: 'Dr. Jane Smith',
      enrollment_status: 'enrolled',
      progress_percentage: 45
    },
    {
      id: 'c2',
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts and design patterns for scalable applications.',
      category: 'Web Development',
      difficulty: 'advanced',
      duration_minutes: 240,
      instructor_name: 'Alex Johnson',
      enrollment_status: 'not_enrolled'
    },
    {
      id: 'c3',
      title: 'Python for Beginners',
      description: 'Start your programming journey with Python.',
      category: 'Programming',
      difficulty: 'beginner',
      duration_minutes: 180,
      instructor_name: 'Sarah Lee',
      enrollment_status: 'completed',
      progress_percentage: 100
    }
  ];

  return {
    data: mockCourses,
    meta: {
      current_page: 1,
      from: 1,
      last_page: 1,
      per_page: 10,
      to: 3,
      total: 3
    }
  };
}
