import { AssessmentDTO, AssessmentResultDTO, AssessmentSubmissionDTO } from '../types/assessment.types';

export async function getAssessment(id: string): Promise<AssessmentDTO> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id,
    title: 'Mid-Course Knowledge Check',
    description: 'This assessment evaluates your understanding of the concepts covered in Modules 1-4. You have 30 minutes to complete it.',
    duration_minutes: 30,
    total_points: 30,
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        text: 'Which of the following is NOT a supervised learning algorithm?',
        points: 10,
        options: [
          { id: 'opt1', text: 'Linear Regression' },
          { id: 'opt2', text: 'K-Means Clustering' },
          { id: 'opt3', text: 'Decision Trees' },
          { id: 'opt4', text: 'Support Vector Machines' }
        ]
      },
      {
        id: 'q2',
        type: 'true_false',
        text: 'Overfitting occurs when a model learns the training data too well, including its noise, but fails to generalize to new data.',
        points: 10,
      },
      {
        id: 'q3',
        type: 'short_answer',
        text: 'What does "API" stand for?',
        points: 10,
      }
    ]
  };
}

export async function submitAssessment(submission: AssessmentSubmissionDTO): Promise<AssessmentResultDTO> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    assessment_id: submission.assessment_id,
    score: 20,
    total_points: 30,
    percentage: 66.67,
    passed: false,
    feedback: 'You showed a good understanding of supervised learning, but missed some foundational concepts. Review the material on clustering and APIs.',
    recommended_activity_id: 'c1-module4-review'
  };
}
