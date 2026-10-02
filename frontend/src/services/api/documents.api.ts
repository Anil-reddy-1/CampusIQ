import apiClient, { uploadFile } from './client';
import type { ApiResponse, Document, SearchResult } from '../../types';

export const documentsApi = {
  /**
   * Upload document for RAG ingestion
   */
  upload: async (
    file: File,
    title?: string,
    onProgress?: (progress: number) => void
  ): Promise<Document> => {
    const additionalData = title ? { title } : {};
    const response = await uploadFile('/documents/upload', file, additionalData, onProgress);
    return response.data;
  },

  /**
   * Get document processing status
   */
  getStatus: async (documentId: string): Promise<Document> => {
    const response = await apiClient.get<ApiResponse<Document>>(
      `/documents/${documentId}/status`
    );
    return response.data.data!;
  },

  /**
   * List all user documents
   */
  list: async (filters?: { status?: string; file_type?: string }): Promise<Document[]> => {
    const response = await apiClient.get<ApiResponse<Document[]>>('/documents', {
      params: filters,
    });
    return response.data.data!;
  },

  /**
   * Delete document
   */
  delete: async (documentId: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/documents/${documentId}`
    );
    return response.data.data!;
  },

  /**
   * Semantic search across documents
   */
  search: async (data: {
    query: string;
    topK?: number;
    documentIds?: string[];
  }): Promise<{ results: SearchResult[] }> => {
    const response = await apiClient.post<ApiResponse<{ results: SearchResult[] }>>(
      '/search/semantic',
      data
    );
    return response.data.data!;
  },
};
