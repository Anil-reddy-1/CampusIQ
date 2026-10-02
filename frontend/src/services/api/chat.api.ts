import apiClient from './client';
import type { ApiResponse, ChatResponse, ChatMessage } from '../../types';

export const chatApi = {
  /**
   * Send chat message to AI assistant
   */
  sendMessage: async (data: {
    message: string;
    conversationId?: string;
  }): Promise<ChatResponse> => {
    const response = await apiClient.post<ApiResponse<ChatResponse>>(
      '/chat/message',
      data
    );
    return response.data.data!;
  },

  /**
   * Get chat history
   */
  getHistory: async (params?: {
    conversationId?: string;
    limit?: number;
  }): Promise<{ messages: ChatMessage[] }> => {
    const response = await apiClient.get<ApiResponse<{ messages: ChatMessage[] }>>(
      '/chat/history',
      { params }
    );
    return response.data.data!;
  },
};
