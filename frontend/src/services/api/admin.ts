import apiClient from './client';
import type { User, SystemStats, ExtractionMetrics, SystemHealth } from '../../types';

/**
 * Admin API Service
 * Provides admin-only endpoints for user management, system monitoring, and analytics
 */
export const adminService = {
  /**
   * Get system-wide statistics
   * GET /api/admin/stats
   */
  async getSystemStats(): Promise<SystemStats> {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  /**
   * Get all users
   * GET /api/admin/users
   */
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  /**
   * Get user by ID
   * GET /api/admin/users/:userId
   */
  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Update user
   * PATCH /api/admin/users/:userId
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const response = await apiClient.patch(`/admin/users/${userId}`, updates);
    return response.data;
  },

  /**
   * Delete user
   * DELETE /api/admin/users/:userId
   */
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/admin/users/${userId}`);
  },

  /**
   * Get extraction metrics
   * GET /api/admin/extractions/metrics?timeRange=24h|7d|30d
   */
  async getExtractionMetrics(timeRange: '24h' | '7d' | '30d' = '24h'): Promise<{
    metrics: ExtractionMetrics;
    recent: any[];
  }> {
    const response = await apiClient.get(`/admin/extractions/metrics`, {
      params: { timeRange }
    });
    return response.data;
  },

  /**
   * Get system health status
   * GET /api/admin/health
   */
  async getSystemHealth(): Promise<{
    health: SystemHealth;
    logs: any[];
  }> {
    const response = await apiClient.get('/admin/health');
    return response.data;
  },

  /**
   * Create new user (admin action)
   * POST /api/admin/users
   */
  async createUser(userData: {
    email: string;
    name: string;
    role: 'student' | 'admin';
    password: string;
  }): Promise<User> {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },

  /**
   * Get audit logs
   * GET /api/admin/audit-logs?limit=50&offset=0
   */
  async getAuditLogs(limit = 50, offset = 0): Promise<any[]> {
    const response = await apiClient.get('/admin/audit-logs', {
      params: { limit, offset }
    });
    return response.data;
  },

  /**
   * Export system data
   * GET /api/admin/export?type=users|extractions|all
   */
  async exportData(type: 'users' | 'extractions' | 'all' = 'all'): Promise<Blob> {
    const response = await apiClient.get('/admin/export', {
      params: { type },
      responseType: 'blob'
    });
    return response.data;
  }
};
