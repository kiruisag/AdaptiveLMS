export interface AdaptiveRecommendationDTO {
  session_id: string;
  activity: {
    type: 'lesson' | 'video' | 'reading' | 'practice' | 'quiz' | 'assessment';
    content_id: string;
    title: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimated_minutes: number;
  };
  learning_context: {
    topic: string;
    mastery: number;
    target_mastery: number;
  };
  reasoning: string;
}

export interface LearningSessionDTO {
  id: string;
  course_id: string;
  learner_id: string;
  started_at: string;
  current_activity?: AdaptiveRecommendationDTO;
}
