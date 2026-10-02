import apiClient, { uploadFile } from './client';
import type {
  ApiResponse,
  ExtractionJob,
  DocumentType,
  TimetableExtraction,
  ResultExtraction,
  ExamScheduleExtraction,
  DeadlineExtraction,
} from '../../types';

export const extractionApi = {
  /**
   * Upload document for extraction
   */
  upload: async (
    file: File,
    documentType?: DocumentType,
    onProgress?: (progress: number) => void
  ): Promise<ExtractionJob> => {
    const additionalData = documentType ? { documentType } : {};
    const response = await uploadFile('/extraction/upload', file, additionalData, onProgress);
    return response.data;
  },

  /**
   * Get extraction job status
   */
  getJob: async (jobId: string): Promise<ExtractionJob> => {
    const response = await apiClient.get<ApiResponse<ExtractionJob>>(
      `/extraction/${jobId}`
    );
    return response.data.data!;
  },

  /**
   * Confirm timetable extraction
   */
  confirmTimetable: async (
    jobId: string,
    data: {
      entries: TimetableExtraction['entries'];
      semester_start_date: string;
      semester_end_date: string;
    }
  ): Promise<{ message: string; createdRecords: number; calendarSyncTriggered: boolean }> => {
    const response = await apiClient.post<
      ApiResponse<{
        message: string;
        createdRecords: number;
        calendarSyncTriggered: boolean;
      }>
    >(`/extraction/${jobId}/confirm`, data);
    return response.data.data!;
  },

  /**
   * Confirm result extraction
   */
  confirmResult: async (
    jobId: string,
    data: ResultExtraction
  ): Promise<{ message: string; createdRecords: number }> => {
    const response = await apiClient.post<
      ApiResponse<{ message: string; createdRecords: number }>
    >(`/extraction/${jobId}/confirm`, data);
    return response.data.data!;
  },

  /**
   * Confirm exam schedule extraction
   */
  confirmExamSchedule: async (
    jobId: string,
    data: ExamScheduleExtraction
  ): Promise<{ message: string; createdRecords: number; calendarSyncTriggered: boolean }> => {
    const response = await apiClient.post<
      ApiResponse<{
        message: string;
        createdRecords: number;
        calendarSyncTriggered: boolean;
      }>
    >(`/extraction/${jobId}/confirm`, data);
    return response.data.data!;
  },

  /**
   * Confirm deadline extraction
   */
  confirmDeadline: async (
    jobId: string,
    data: DeadlineExtraction
  ): Promise<{ message: string; createdRecords: number; calendarSyncTriggered: boolean }> => {
    const response = await apiClient.post<
      ApiResponse<{
        message: string;
        createdRecords: number;
        calendarSyncTriggered: boolean;
      }>
    >(`/extraction/${jobId}/confirm`, data);
    return response.data.data!;
  },

  /**
   * Reject extraction
   */
  reject: async (jobId: string): Promise<{ message: string }> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      `/extraction/${jobId}/reject`
    );
    return response.data.data!;
  },
};
