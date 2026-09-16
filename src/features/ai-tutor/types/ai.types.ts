export interface AISourceDTO {
  id: string;
  title: string;
  url?: string;
  page?: string;
}

export interface AIMessageDTO {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: AISourceDTO[];
  isStreaming?: boolean;
}

export interface AIConversationDTO {
  id: string;
  course_id?: string;
  title: string;
  messages: AIMessageDTO[];
  created_at: string;
  updated_at: string;
}
