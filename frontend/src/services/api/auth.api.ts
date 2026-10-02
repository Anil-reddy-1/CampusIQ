import apiClient from './client';
import type { ApiResponse, User, AuthResponse, UserRole } from '../../types';

export const authApi = {
  /**
   * Register user profile after Firebase signup
   */
  register: async (data: {
    fullName: string;
    email: string;
    role: UserRole;
  }): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/auth/register', data);
    return response.data.data!;
  },

  /**
   * Create session and retrieve user profile
   */
  createSession: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/session', {
      token,
    });
    return response.data.data!;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },
};
