import { type IRecipe, type IIngredient } from '../models';

// API Base URL - must be set via VITE_API_BASE_URL environment variable
// This frontend app connects to an external API service
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error('❌ VITE_API_BASE_URL environment variable is not set!');
  console.error('Please set VITE_API_BASE_URL to your external API endpoint.');
}

export interface CreateRecipeRequest {
  title: string;
  image?: string;
  category: string;
  cookTime: string;
  servings: number;
  calories: number;
  ingredients: string[]; // Raw ingredient strings from form
  instructions: string[];
  videoUrl?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cuisine?: string;
  tags?: string[];
}

export interface ParsedIngredient extends IIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export class RecipeAPI {
  // Parse ingredient string to structured format
  private static parseIngredient(ingredientStr: string): ParsedIngredient {
    // Simple parsing logic - can be enhanced with NLP
    const trimmed = ingredientStr.trim();
    
    // Match patterns like "200g pasta", "2 tbsp olive oil", "1 piece carrot"
    const quantityUnitMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]*)\s+(.+)$/);
    
    if (quantityUnitMatch) {
      const [, quantityStr, unit, name] = quantityUnitMatch;
      return {
        name: name.trim(),
        quantity: parseFloat(quantityStr),
        unit: unit || 'piece'
      };
    }
    
    // Match patterns like "salt and pepper to taste"
    const toTasteMatch = trimmed.match(/^(.+)\s+to\s+taste$/i);
    if (toTasteMatch) {
      return {
        name: toTasteMatch[1].trim(),
        quantity: 0,
        unit: 'to taste'
      };
    }
    
    // Default case - treat as single item
    const numberMatch = trimmed.match(/^(\d+)\s+(.+)$/);
    if (numberMatch) {
      return {
        name: numberMatch[2].trim(),
        quantity: parseInt(numberMatch[1]),
        unit: 'piece'
      };
    }
    
    // Fallback
    return {
      name: trimmed,
      quantity: 1,
      unit: 'piece'
    };
  }

  static async createRecipe(recipeData: CreateRecipeRequest, userId?: string): Promise<IRecipe> {
    try {
      // Parse ingredients from strings to structured format
      const parsedIngredients = recipeData.ingredients
        .filter(ing => ing.trim()) // Remove empty ingredients
        .map(ing => this.parseIngredient(ing));

      // Filter out empty instructions
      const cleanInstructions = recipeData.instructions.filter(inst => inst.trim());

      // Create recipe object
      const recipe: Partial<IRecipe> = {
        title: recipeData.title,
        image: recipeData.image || 'https://images.unsplash.com/photo-1495521821757-a2efb71eecd1?w=400&h=300&fit=crop', // Default image
        rating: 0, // New recipes start with 0 rating
        category: recipeData.category,
        cookTime: recipeData.cookTime,
        servings: recipeData.servings,
        calories: recipeData.calories,
        ingredients: parsedIngredients,
        instructions: cleanInstructions,
        videoUrl: recipeData.videoUrl,
        viewCount: 0,
        createdBy: userId,
        isPublished: true,
        difficulty: recipeData.difficulty || 'Medium',
        cuisine: recipeData.cuisine,
        tags: recipeData.tags || []
      };

      // Call external API to create recipe
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const savedRecipe = await response.json();
      console.log('✅ Recipe created via API:', savedRecipe.title);
      return savedRecipe;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw new Error('Failed to create recipe');
    }
  }

  static async getRecipes(filters?: {
    category?: string;
    limit?: number;
    skip?: number;
    sortBy?: string;
    userId?: string;
  }): Promise<IRecipe[]> {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.skip) params.append('skip', filters.skip.toString());
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.userId) params.append('userId', filters.userId);

      // Call external API to fetch recipes
      const response = await fetch(`${API_BASE_URL}/recipes?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const recipes = await response.json();
      console.log('✅ Recipes fetched from API:', recipes.length);
      return recipes;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw new Error('Failed to fetch recipes');
    }
  }

  static async getRecipe(id: string): Promise<IRecipe | null> {
    try {
      // Call external API
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const recipe = await response.json();
      console.log('✅ Recipe fetched from API:', recipe.title);
      return recipe;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw new Error('Failed to fetch recipe');
    }
  }

  static async updateRecipe(id: string, updateData: Partial<IRecipe>): Promise<IRecipe | null> {
    try {
      // Call external API to update recipe
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`API error: ${response.status}`);
      }

      const updatedRecipe = await response.json();
      console.log('✅ Recipe updated via API:', updatedRecipe.title);
      return updatedRecipe;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw new Error('Failed to update recipe');
    }
  }

  static async deleteRecipe(id: string): Promise<boolean> {
    try {
      // Call external API to delete recipe
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return false;
        }
        throw new Error(`API error: ${response.status}`);
      }

      console.log('✅ Recipe deleted via API');
      return true;
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw new Error('Failed to delete recipe');
    }
  }

  static async incrementViewCount(recipeId: string, userId?: string): Promise<number> {
    try {
      // Call external API to increment view count
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ View count incremented via API');
      return data.viewCount;
    } catch (error) {
      console.error('Error incrementing view count:', error);
      return 0;
    }
  }

  static async getViewCount(recipeId: string): Promise<number> {
    try {
      // Call external API to get view count
      const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/views`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ View count fetched from API');
      return data.viewCount;
    } catch (error) {
      console.error('Error getting view count:', error);
      return 0;
    }
  }

  static async getFeaturedRecipes(limit: number = 6): Promise<IRecipe[]> {
    try {
      return await this.getRecipes({
        sortBy: 'popular', // Sort by view count and rating
        limit,
        skip: 0
      });
    } catch (error) {
      console.error('Error fetching featured recipes:', error);
      return [];
    }
  }

  static async searchRecipes(query: string, filters?: {
    category?: string;
    limit?: number;
  }): Promise<IRecipe[]> {
    try {
      // This is a basic implementation - MongoDB text search would be better
      const allRecipes = await this.getRecipes({
        category: filters?.category,
        limit: filters?.limit || 20
      });

      if (!query.trim()) return allRecipes;

      const searchTerms = query.toLowerCase().split(' ');
      
      return allRecipes.filter(recipe => {
        const searchableText = [
          recipe.title,
          recipe.category,
          recipe.cuisine,
          ...(recipe.tags || []),
          ...recipe.ingredients.map(ing => ing.name)
        ].join(' ').toLowerCase();

        return searchTerms.some(term => searchableText.includes(term));
      });
    } catch (error) {
      console.error('Error searching recipes:', error);
      return [];
    }
  }
}

export default RecipeAPI;