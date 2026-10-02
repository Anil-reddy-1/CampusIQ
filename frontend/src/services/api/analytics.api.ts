import apiClient from './client';
import type { ApiResponse, DashboardAnalytics } from '../../types';

export const analyticsApi = {
  /**
   * Get dashboard analytics
   */
  getDashboard: async (): Promise<DashboardAnalytics> => {
    const response = await apiClient.get<ApiResponse<DashboardAnalytics>>(
      '/analytics/dashboard'
    );
    return response.data.data!;
  },
};
