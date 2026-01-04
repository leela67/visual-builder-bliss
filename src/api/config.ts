// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error_code?: string;
  details?: any;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Common API error codes
export const API_ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  RECIPE_NOT_FOUND: 'RECIPE_NOT_FOUND',
  PHONE_EXISTS: 'PHONE_EXISTS',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  FAVORITE_EXISTS: 'FAVORITE_EXISTS',
  FAVORITE_NOT_FOUND: 'FAVORITE_NOT_FOUND',
  SEARCH_RECIPES_ERROR: 'SEARCH_RECIPES_ERROR',
  GET_RECIPES_ERROR: 'GET_RECIPES_ERROR',
  CREATE_RECIPE_ERROR: 'CREATE_RECIPE_ERROR',
  GET_FAVORITES_ERROR: 'GET_FAVORITES_ERROR',
  ADD_FAVORITE_ERROR: 'ADD_FAVORITE_ERROR',
  REMOVE_FAVORITE_ERROR: 'REMOVE_FAVORITE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const;

// Recipe categories as per API documentation
export const RECIPE_CATEGORIES = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
  'Dessert',
  'Beverage'
] as const;

// Dietary types as per API documentation
export const DIETARY_TYPES = [
  'Veg',
  'Non-Veg',
  'Egg',
  'Vegan'
] as const;

// Difficulty levels as per API documentation
export const DIFFICULTY_LEVELS = [
  'Easy',
  'Medium',
  'Hard'
] as const;

// Predefined recipe tags
export const RECIPE_TAGS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Low-Carb',
  'Keto',
  'Paleo',
  'High-Protein',
  'Quick & Easy',
  'One-Pot',
  'Meal Prep',
  'Kid-Friendly',
  'Healthy',
  'Comfort Food',
  'Spicy',
  'Sweet',
  'Savory',
  'Budget-Friendly'
] as const;

// Predefined cuisine types
export const CUISINE_TYPES = [
  'American',
  'Italian',
  'Mexican',
  'Chinese',
  'Japanese',
  'Thai',
  'Indian',
  'French',
  'Greek',
  'Mediterranean',
  'Middle Eastern',
  'Korean',
  'Vietnamese',
  'Spanish',
  'Caribbean',
  'African',
  'British',
  'German',
  'Brazilian',
  'Other'
] as const;

export type RecipeCategory = typeof RECIPE_CATEGORIES[number];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];
export type RecipeTag = typeof RECIPE_TAGS[number];
export type CuisineType = typeof CUISINE_TYPES[number];
export type DietaryType = typeof DIETARY_TYPES[number];
