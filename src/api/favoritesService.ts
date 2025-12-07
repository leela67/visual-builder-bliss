import { API_BASE_URL, ApiResponse, PaginatedResponse } from './config';
import { AuthService } from './auth';
import { RecipeListItem } from './recipeService';

export interface FavoriteItem {
  user_id: number;
  recipe_id: number;
  recipe: RecipeListItem; // Contains image_url as base64-encoded data URI
  created_at: string;
}

export interface FavoriteCheckResponse {
  is_favorite: boolean;
}

export class FavoritesService {
  // Get user's favorite recipes
  static async getFavorites(page: number = 1, limit: number = 20): Promise<PaginatedResponse<FavoriteItem>> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      throw new Error('Failed to fetch favorites');
    }
  }

  // Add recipe to favorites
  static async addToFavorites(recipeId: number): Promise<ApiResponse> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${recipeId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      throw new Error('Failed to add to favorites');
    }
  }

  // Remove recipe from favorites
  static async removeFromFavorites(recipeId: number): Promise<ApiResponse> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${recipeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      throw new Error('Failed to remove from favorites');
    }
  }

  // Check if recipe is favorited
  static async checkFavoriteStatus(recipeId: number): Promise<ApiResponse<FavoriteCheckResponse>> {
    const token = AuthService.getToken();
    if (!token) {
      // If not authenticated, return false
      return {
        success: true,
        message: 'Not authenticated',
        data: { is_favorite: false }
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${recipeId}/check`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to check favorite status:', error);
      // Return false on error instead of throwing
      return {
        success: true,
        message: 'Error checking status',
        data: { is_favorite: false }
      };
    }
  }

  // Toggle favorite status (convenience method)
  static async toggleFavorite(recipeId: number): Promise<{ success: boolean; isFavorite: boolean; message: string }> {
    try {
      const statusResponse = await this.checkFavoriteStatus(recipeId);
      
      if (!statusResponse.success || !statusResponse.data) {
        return {
          success: false,
          isFavorite: false,
          message: 'Failed to check favorite status'
        };
      }

      const isFavorite = statusResponse.data.is_favorite;

      if (isFavorite) {
        // Remove from favorites
        const response = await this.removeFromFavorites(recipeId);
        return {
          success: response.success,
          isFavorite: false,
          message: response.message
        };
      } else {
        // Add to favorites
        const response = await this.addToFavorites(recipeId);
        return {
          success: response.success,
          isFavorite: true,
          message: response.message
        };
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return {
        success: false,
        isFavorite: false,
        message: 'Failed to toggle favorite'
      };
    }
  }
}
