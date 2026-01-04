import { API_BASE_URL, ApiResponse } from './config';
import { AuthService } from './auth';

// Notification interfaces based on API documentation
export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: 'SYSTEM' | 'ADMIN' | 'RECIPE' | 'ENGAGEMENT' | 'PROMOTION';
  reference_type?: string;
  reference_id?: number;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  expires_at?: string;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  unread_count: number;
}

export class NotificationService {
  // Get user notifications with pagination
  static async getNotifications(page: number = 1, limit: number = 20): Promise<ApiResponse<NotificationResponse>> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await fetch(`${API_BASE_URL}/notifications?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: number): Promise<ApiResponse<null>> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  // Delete notification
  static async deleteNotification(notificationId: number): Promise<ApiResponse<null>> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(): Promise<ApiResponse<null>> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  // Get unread notification count
  static async getUnreadCount(): Promise<ApiResponse<{ unread_count: number }>> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      throw new Error('Failed to fetch unread count');
    }
  }
}