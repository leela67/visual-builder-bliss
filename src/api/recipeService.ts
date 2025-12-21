import { API_BASE_URL, ApiResponse, PaginatedResponse, RecipeCategory, DifficultyLevel } from './config';
import { AuthService } from './auth';

// Recipe interfaces based on API documentation
export interface RecipeListItem {
  recipe_id: number;
  image_url: string; // Base64-encoded data URI (e.g., "data:image/jpeg;base64,...")
  name: string;
  rating: number;
  cook_time: number;
  views: number;
  is_popular: boolean;
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Instruction {
  step: number;
  description: string;
}

export interface Recipe {
  recipe_id: number;
  name: string;
  category: RecipeCategory;
  image_url: string; // Base64-encoded data URI (e.g., "data:image/jpeg;base64,...")
  youtube_url?: string;
  cook_time: number;
  servings: number;
  difficulty: DifficultyLevel;
  cuisine: string;
  calories: number;
  tags: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  rating: number;
  views: number;
  is_popular: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRecipeRequest {
  name: string;
  category: RecipeCategory;
  image_url?: string;
  youtube_url?: string;
  cook_time: number;
  servings: number;
  difficulty: DifficultyLevel;
  cuisine: string;
  calories: number;
  tags: string[];
  ingredients: Ingredient[];
  instructions: Instruction[];
}

export interface SearchFilters {
  search?: string;
  meal_type?: RecipeCategory;
  veg?: boolean;
  page?: number;
  limit?: number;
}

export interface RandomRecipeFilters {
  meal_type?: RecipeCategory;
  max_cook_time?: number;
  tags?: string;
  is_popular?: boolean;
  limit?: number;
}

export interface RandomRecipeResponse {
  recipe_id: number;
  name: string;
  image_url: string;
  rating: number;
  cook_time: number;
  views: number;
  is_popular: boolean;
  user_id: number | null;
  is_admin_recipe: boolean;
  is_active: number;
  is_approve: number;
  approved_by: number | null;
  intelligent_suggestion: string | null;
}

export class RecipeService {
  // Get all recipes with pagination
  static async getRecipes(page: number = 1, limit: number = 20): Promise<PaginatedResponse<RecipeListItem>> {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // Debug: Log sample recipe from list
      if (data.data && data.data.length > 0) {
        console.log('📡 API Response for getRecipes (first recipe):', {
          recipe_id: data.data[0]?.recipe_id,
          image_url_exists: !!data.data[0]?.image_url,
          image_url_type: typeof data.data[0]?.image_url,
          image_url_length: data.data[0]?.image_url?.length,
          image_url_first_100_chars: data.data[0]?.image_url?.substring(0, 100),
          is_data_uri: data.data[0]?.image_url?.startsWith('data:'),
          total_recipes: data.data.length
        });
      }

      return data;
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      throw new Error('Failed to fetch recipes');
    }
  }

  // Search recipes with filters
  static async searchRecipes(filters: SearchFilters): Promise<PaginatedResponse<RecipeListItem>> {
    try {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.meal_type) params.append('meal_type', filters.meal_type);
      if (filters.veg !== undefined) params.append('veg', filters.veg.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE_URL}/recipes/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // Debug: Log sample recipe from search results
      if (data.data && data.data.length > 0) {
        console.log('📡 API Response for searchRecipes (first recipe):', {
          recipe_id: data.data[0]?.recipe_id,
          image_url_exists: !!data.data[0]?.image_url,
          image_url_type: typeof data.data[0]?.image_url,
          image_url_length: data.data[0]?.image_url?.length,
          image_url_first_100_chars: data.data[0]?.image_url?.substring(0, 100),
          is_data_uri: data.data[0]?.image_url?.startsWith('data:'),
          total_recipes: data.data.length
        });
      }

      return data;
    } catch (error) {
      console.error('Failed to search recipes:', error);
      throw new Error('Failed to search recipes');
    }
  }

  // Get popular recipes
  static async getPopularRecipes(page: number = 1, limit: number = 20): Promise<PaginatedResponse<RecipeListItem>> {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/popular?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch popular recipes:', error);
      throw new Error('Failed to fetch popular recipes');
    }
  }

  // Get random recipes
  static async getRandomRecipes(filters: RandomRecipeFilters = {}): Promise<ApiResponse<RecipeListItem[]>> {
    try {
      const params = new URLSearchParams();
      
      if (filters.meal_type) params.append('meal_type', filters.meal_type);
      if (filters.max_cook_time) params.append('max_cook_time', filters.max_cook_time.toString());
      if (filters.tags) params.append('tags', filters.tags);
      if (filters.is_popular !== undefined) params.append('is_popular', filters.is_popular.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const response = await fetch(`${API_BASE_URL}/recipes/random?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch random recipes:', error);
      throw new Error('Failed to fetch random recipes');
    }
  }

  // Get single random recipe with intelligent suggestions
  static async getRandomRecipe(): Promise<ApiResponse<RandomRecipeResponse>> {
    try {
      const token = AuthService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if token exists for better personalization
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/recipes/random`, {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      // Debug: Log the random recipe response
      console.log('📡 API Response for getRandomRecipe:', {
        recipe_id: data.data?.recipe_id,
        name: data.data?.name,
        intelligent_suggestion: data.data?.intelligent_suggestion,
        image_url_exists: !!data.data?.image_url,
        is_data_uri: data.data?.image_url?.startsWith('data:'),
        raw_data: data
      });

      return data;
    } catch (error) {
      console.error('Failed to fetch random recipe:', error);
      throw new Error('Failed to fetch random recipe');
    }
  }

  // Get recipe by ID
  static async getRecipeById(id: number): Promise<ApiResponse<Recipe>> {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      // Debug: Log the raw API response
      console.log('📡 API Response for getRecipeById:', {
        recipe_id: data.data?.recipe_id,
        image_url_exists: !!data.data?.image_url,
        image_url_type: typeof data.data?.image_url,
        image_url_length: data.data?.image_url?.length,
        image_url_first_100_chars: data.data?.image_url?.substring(0, 100),
        is_data_uri: data.data?.image_url?.startsWith('data:'),
        raw_data: data
      });

      return data;
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
      throw new Error('Failed to fetch recipe');
    }
  }

  // Create recipe (requires authentication)
  static async createRecipe(recipeData: CreateRecipeRequest): Promise<ApiResponse<Recipe>> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to create recipe:', error);
      throw new Error('Failed to create recipe');
    }
  }

  // Create recipe with FormData (for file uploads)
  static async createRecipeWithFormData(formData: FormData): Promise<ApiResponse<Recipe>> {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to create recipe with FormData:', error);
      throw new Error('Failed to create recipe');
    }
  }

  // Get user's recipes
  static async getUserRecipes(userId: number, page: number = 1, limit: number = 20): Promise<PaginatedResponse<RecipeListItem>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/recipes?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch user recipes:', error);
      throw new Error('Failed to fetch user recipes');
    }
  }
}
