import { AdaptiveRecommendationDTO } from '../types/learning.types';

export async function getNextActivity(courseId: string): Promise<AdaptiveRecommendationDTO> {
  // Mock API implementation
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    session_id: `session-${Date.now()}`,
    activity: {
      type: 'practice',
      content_id: 'q-203',
      title: 'Equivalent Fractions Practice',
      difficulty: 'intermediate',
      estimated_minutes: 15
    },
    learning_context: {
      topic: 'Equivalent Fractions',
      mastery: 0.62,
      target_mastery: 0.80
    },
    reasoning: "Based on your recent assessment, you struggle slightly with equivalent fractions. A quick practice session will help solidify this concept before moving to algebra."
  };
}
