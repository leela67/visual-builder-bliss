import { type IRecipe, type IIngredient } from '../models';

// API Base URL - defaults to localhost:3001 for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

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

      // Try to call backend API first
      try {
        const response = await fetch(`${API_BASE_URL}/recipes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(recipe),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const savedRecipe = await response.json();
        console.log('✅ Recipe saved to database via API:', savedRecipe.title);
        return savedRecipe;

      } catch (apiError) {
        const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
        console.warn('⚠️ Backend API not available, falling back to localStorage:', errorMessage);
        
        // Fallback to localStorage if API is not available
        const mockRecipe: IRecipe = {
          ...recipe,
          _id: 'recipe_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11),
          createdAt: new Date(),
          updatedAt: new Date()
        } as IRecipe;

        // Store in localStorage for demo purposes
        const existingRecipes = JSON.parse(localStorage.getItem('demo-recipes') || '[]');
        existingRecipes.push(mockRecipe);
        localStorage.setItem('demo-recipes', JSON.stringify(existingRecipes));

        console.log('💾 Recipe saved to localStorage:', mockRecipe.title);
        return mockRecipe;
      }
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
      // Try to call backend API first
      try {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.limit) params.append('limit', filters.limit.toString());
        if (filters?.skip) params.append('skip', filters.skip.toString());
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.userId) params.append('userId', filters.userId);

        const response = await fetch(`${API_BASE_URL}/recipes?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const recipes = await response.json();
        console.log('✅ Recipes fetched from database via API:', recipes.length);
        return recipes;

      } catch (apiError) {
        const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
        console.warn('⚠️ Backend API not available, falling back to localStorage:', errorMessage);
        
        // Fallback to localStorage if API is not available
        const existingRecipes = JSON.parse(localStorage.getItem('demo-recipes') || '[]');
        let filteredRecipes = [...existingRecipes];
        
        // Apply category filter if specified
        if (filters?.category) {
          filteredRecipes = filteredRecipes.filter((r: any) => r.category === filters.category);
        }
        
        // Apply userId filter if specified
        if (filters?.userId) {
          filteredRecipes = filteredRecipes.filter((r: any) => r.createdBy === filters.userId);
        }
        
        // Apply sorting
        if (filters?.sortBy === 'popular') {
          filteredRecipes.sort((a: any, b: any) => (b.viewCount || 0) - (a.viewCount || 0));
        }
        
        // Apply skip and limit
        if (filters?.skip) {
          filteredRecipes = filteredRecipes.slice(filters.skip);
        }
        if (filters?.limit) {
          filteredRecipes = filteredRecipes.slice(0, filters.limit);
        }
        
        console.log('💾 Recipes fetched from localStorage:', filteredRecipes.length);
        return filteredRecipes;
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw new Error('Failed to fetch recipes');
    }
  }

  static async getRecipe(id: string): Promise<IRecipe | null> {
    try {
      // Check if we're in Node.js environment (server-side)
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        // Server-side: Use database service
        const { db } = await import('../lib/database.js');
        return await db.getRecipe(id);
      } else {
        // Browser environment: Read from localStorage
        const existingRecipes = JSON.parse(localStorage.getItem('demo-recipes') || '[]');
        const recipe = existingRecipes.find((r: any) => r._id === id);
        return recipe || null;
      }
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw new Error('Failed to fetch recipe');
    }
  }

  static async updateRecipe(id: string, updateData: Partial<IRecipe>): Promise<IRecipe | null> {
    try {
      // Try to call backend API first
      try {
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedRecipe = await response.json();
        console.log('✅ Recipe updated via API:', updatedRecipe.title);
        return updatedRecipe;

      } catch (apiError) {
        const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
        console.warn('⚠️ Backend API not available, falling back to localStorage:', errorMessage);

        // Fallback to localStorage if API is not available
        const existingRecipes = JSON.parse(localStorage.getItem('demo-recipes') || '[]');
        const recipeIndex = existingRecipes.findIndex((r: any) => r._id === id);

        if (recipeIndex !== -1) {
          existingRecipes[recipeIndex] = {
            ...existingRecipes[recipeIndex],
            ...updateData,
            updatedAt: new Date()
          };
          localStorage.setItem('demo-recipes', JSON.stringify(existingRecipes));
          console.log('💾 Recipe updated in localStorage');
          return existingRecipes[recipeIndex];
        }

        return null;
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw new Error('Failed to update recipe');
    }
  }

  static async deleteRecipe(id: string): Promise<boolean> {
    try {
      // Try to call backend API first
      try {
        const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('✅ Recipe deleted via API');
        return true;

      } catch (apiError) {
        const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
        console.warn('⚠️ Backend API not available, falling back to localStorage:', errorMessage);

        // Fallback to localStorage if API is not available
        const existingRecipes = JSON.parse(localStorage.getItem('demo-recipes') || '[]');
        const recipeIndex = existingRecipes.findIndex((r: any) => r._id === id);

        if (recipeIndex !== -1) {
          existingRecipes.splice(recipeIndex, 1);
          localStorage.setItem('demo-recipes', JSON.stringify(existingRecipes));
          console.log('💾 Recipe deleted from localStorage');
          return true;
        }

        return false;
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw new Error('Failed to delete recipe');
    }
  }

  static async incrementViewCount(recipeId: string, userId?: string): Promise<number> {
    try {
      // Check if we're in Node.js environment (server-side)
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        // Server-side: Use database service
        const { db } = await import('../lib/database.js');
        const sessionId = userId ? undefined : `session_${Date.now()}_${Math.random()}`;
        return await db.incrementViewCount(recipeId, userId, sessionId);
      } else {
        // Browser environment: Update recipe in localStorage
        const existingRecipes = JSON.parse(localStorage.getItem('demo-recipes') || '[]');
        const recipeIndex = existingRecipes.findIndex((r: any) => r._id === recipeId);
        
        if (recipeIndex !== -1) {
          existingRecipes[recipeIndex].viewCount = (existingRecipes[recipeIndex].viewCount || 0) + 1;
          localStorage.setItem('demo-recipes', JSON.stringify(existingRecipes));
          return existingRecipes[recipeIndex].viewCount;
        }
        
        return 0;
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
      return 0;
    }
  }

  static async getViewCount(recipeId: string): Promise<number> {
    try {
      // Check if we're in Node.js environment (server-side)
      if (typeof process !== 'undefined' && process.versions && process.versions.node) {
        // Server-side: Use database service
        const { db } = await import('../lib/database.js');
        return await db.getViewCount(recipeId);
      } else {
        // Browser environment: Read from localStorage
        const existingRecipes = JSON.parse(localStorage.getItem('demo-recipes') || '[]');
        const recipe = existingRecipes.find((r: any) => r._id === recipeId);
        return recipe?.viewCount || 0;
      }
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