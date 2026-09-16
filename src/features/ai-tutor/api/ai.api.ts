import { AIConversationDTO, AIMessageDTO } from '../types/ai.types';

export async function sendMessage(conversationId: string, message: string): Promise<AIMessageDTO> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    id: `msg-${Date.now()}`,
    role: 'assistant',
    content: "Equivalent fractions are fractions that represent the same part of a whole, even though they look different. For example, 1/2 and 2/4 are equivalent. To find an equivalent fraction, you can multiply or divide both the numerator and the denominator by the same non-zero number.",
    timestamp: new Date().toISOString(),
    sources: [
      { id: 's1', title: 'Mathematics Module 2', page: 'Page 15' },
      { id: 's2', title: 'Fractions Core Concepts', url: '/resources/fractions-core' }
    ]
  };
}
