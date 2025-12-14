import { API_BASE_URL } from './config';
import { AuthService } from './auth';

export interface Rating {
  id: number;
  recipe_id: number;
  user_id: number;
  rating: number;
  review: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_id: number | null;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

export interface RatingWithDetails extends Rating {
  user_name: string;
  recipe_name: string;
  admin_name: string;
}

export interface CreateRatingRequest {
  recipe_id: number;
  rating: number;
  review?: string;
}

export interface RatingsResponse {
  ratings: RatingWithDetails[];
  total: number;
  page: number;
  limit: number;
}

export interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: { [key: number]: number };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
  details?: any;
}

class RatingsService {
  private baseURL = `${API_BASE_URL}/ratings`;

  private getAuthHeaders(): HeadersInit {
    const token = AuthService.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`RatingsService request failed:`, error);
      throw error;
    }
  }

  // Create a new rating for a recipe (authenticated users only)
  async createRating(recipeId: number, rating: number, review: string = ''): Promise<ApiResponse<Rating>> {
    return this.request<Rating>('', {
      method: 'POST',
      body: JSON.stringify({
        recipe_id: recipeId,
        rating: rating,
        review: review
      })
    });
  }

  // Get the authenticated user's rating for a specific recipe
  async getUserRating(recipeId: number): Promise<ApiResponse<Rating>> {
    return this.request<Rating>(`/recipe/${recipeId}`);
  }

  // Update the authenticated user's rating for a specific recipe
  async updateRating(recipeId: number, rating: number, review: string = ''): Promise<ApiResponse<Rating>> {
    return this.request<Rating>(`/recipe/${recipeId}`, {
      method: 'PUT',
      body: JSON.stringify({
        recipe_id: recipeId,
        rating: rating,
        review: review
      })
    });
  }

  // Delete the authenticated user's rating for a specific recipe
  async deleteRating(recipeId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/recipe/${recipeId}`, {
      method: 'DELETE'
    });
  }

  // Get all approved ratings for a specific recipe (public endpoint)
  async getRecipeRatings(recipeId: number, page: number = 1, limit: number = 20): Promise<ApiResponse<RatingsResponse>> {
    return this.request<RatingsResponse>(`/recipe/${recipeId}/all?page=${page}&limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
        // Skip auth for public endpoint
      }
    });
  }

  // Check if user has rated a recipe
  async hasUserRated(recipeId: number): Promise<boolean> {
    try {
      await this.getUserRating(recipeId);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        return false;
      }
      throw error;
    }
  }

  // Get recipe rating statistics
  async getRecipeStats(recipeId: number): Promise<RatingStats> {
    try {
      const ratingsData = await this.getRecipeRatings(recipeId, 1, 1);
      const totalRatings = ratingsData.data?.total || 0;
      
      if (totalRatings === 0) {
        return {
          averageRating: 0,
          totalRatings: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }

      // Get all ratings to calculate statistics
      const allRatings = await this.getRecipeRatings(recipeId, 1, totalRatings);
      const ratings = allRatings.data?.ratings || [];
      
      const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      const averageRating = sum / ratings.length;
      
      const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratings.forEach(rating => {
        const roundedRating = Math.round(rating.rating);
        if (roundedRating >= 1 && roundedRating <= 5) {
          ratingDistribution[roundedRating]++;
        }
      });

      return {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalRatings: ratings.length,
        ratingDistribution
      };
    } catch (error) {
      console.error('Failed to get recipe stats:', error);
      return {
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
  }

  // Manage user rating (create or update)
  async manageUserRating(recipeId: number, rating: number, review: string = ''): Promise<{ action: 'created' | 'updated'; data: Rating }> {
    try {
      const hasRated = await this.hasUserRated(recipeId);
      
      if (hasRated) {
        // Update existing rating
        const result = await this.updateRating(recipeId, rating, review);
        return { action: 'updated', data: result.data! };
      } else {
        // Create new rating
        const result = await this.createRating(recipeId, rating, review);
        return { action: 'created', data: result.data! };
      }
    } catch (error) {
      console.error('Failed to manage user rating:', error);
      throw error;
    }
  }
}

export const ratingsService = new RatingsService();
export default ratingsService;