import apiClient from './client';
import { ApiResponse } from './config';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  readAt: string | null;
  link: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export const getNotifications = async (): Promise<ApiResponse<Notification[]>> => {
  const response = await apiClient.get<ApiResponse<Notification[]>>('/notifications');
  return response.data;
};

export const getUnreadCount = async (): Promise<{ count: number }> => {
  const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
  return response.data;
};

export const markAsRead = async (id: string): Promise<ApiResponse> => {
  const response = await apiClient.patch<ApiResponse>(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async (): Promise<ApiResponse> => {
  const response = await apiClient.patch<ApiResponse>('/notifications/read-all');
  return response.data;
};

export const deleteNotification = async (id: string): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(`/notifications/${id}`);
  return response.data;
};

export const deleteAllNotifications = async (): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>('/notifications');
  return response.data;
};
