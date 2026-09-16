export interface BaseQuestionDTO {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  text: string;
  points: number;
}

export interface MultipleChoiceQuestionDTO extends BaseQuestionDTO {
  type: 'multiple_choice';
  options: {
    id: string;
    text: string;
  }[];
}

export interface TrueFalseQuestionDTO extends BaseQuestionDTO {
  type: 'true_false';
}

export interface ShortAnswerQuestionDTO extends BaseQuestionDTO {
  type: 'short_answer';
}

export type QuestionDTO = MultipleChoiceQuestionDTO | TrueFalseQuestionDTO | ShortAnswerQuestionDTO;

export interface AssessmentDTO {
  id: string;
  title: string;
  description: string;
  duration_minutes?: number;
  total_points: number;
  questions: QuestionDTO[];
}

export interface AssessmentSubmissionDTO {
  assessment_id: string;
  answers: Record<string, string | string[]>;
}

export interface AssessmentResultDTO {
  assessment_id: string;
  score: number;
  total_points: number;
  percentage: number;
  passed: boolean;
  feedback: string;
  recommended_activity_id?: string;
}
