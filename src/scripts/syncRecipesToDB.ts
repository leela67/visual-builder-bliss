import { db } from '../lib/database';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Script to sync user-created recipes from a JSON file to MongoDB
 * Usage: npm run sync-recipes
 * 
 * This script reads recipes from a JSON file (recipes-to-sync.json) and saves them to MongoDB.
 * Users can export their localStorage recipes to this file and run this script to sync.
 */

interface LocalStorageRecipe {
  _id?: string;
  title: string;
  image?: string;
  category: string;
  cookTime: string;
  servings: number;
  calories: number;
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
  videoUrl?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cuisine?: string;
  tags?: string[];
  rating?: number;
  viewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isPublished?: boolean;
}

async function syncRecipesToDB() {
  try {
    console.log('🔄 Starting recipe sync to MongoDB...');
    
    // Path to the JSON file containing recipes to sync
    const recipesFilePath = join(process.cwd(), 'recipes-to-sync.json');
    
    if (!existsSync(recipesFilePath)) {
      console.log('📝 Creating sample recipes-to-sync.json file...');
      
      // Create a sample file with instructions
      const sampleData = {
        instructions: "Export your localStorage recipes and paste them in the 'recipes' array below",
        howToExport: "In browser console, run: console.log(JSON.stringify(JSON.parse(localStorage.getItem('demo-recipes') || '[]'), null, 2))",
        recipes: []
      };
      
      writeFileSync(recipesFilePath, JSON.stringify(sampleData, null, 2));
      console.log('✅ Created recipes-to-sync.json file with instructions');
      console.log('📖 Please add your recipes to this file and run the script again');
      return;
    }
    
    // Read the recipes file
    const fileContent = readFileSync(recipesFilePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    if (!data.recipes || !Array.isArray(data.recipes)) {
      console.error('❌ Invalid file format. Expected { recipes: [...] }');
      return;
    }
    
    const recipes: LocalStorageRecipe[] = data.recipes;
    
    // Show export metadata if available
    if (data.exportedAt) {
      console.log(`📅 Recipes exported at: ${data.exportedAt}`);
    }
    if (data.totalRecipes) {
      console.log(`📊 Total recipes in export: ${data.totalRecipes}`);
    }
    
    if (recipes.length === 0) {
      console.log('📝 No recipes found in recipes-to-sync.json');
      return;
    }
    
    console.log(`📚 Found ${recipes.length} recipe(s) to sync`);
    
    let syncedCount = 0;
    let skippedCount = 0;
    
    for (const recipe of recipes) {
      try {
        // Check if recipe already exists by title (to avoid duplicates)
        const existingRecipe = await db.getRecipes({ 
          limit: 1,
          // Note: This is a basic check - in production you'd want better duplicate detection
        });
        
        const titleExists = existingRecipe.some(r => 
          r.title.toLowerCase().trim() === recipe.title.toLowerCase().trim()
        );
        
        if (titleExists) {
          console.log(`⏭️  Skipping "${recipe.title}" (already exists)`);
          skippedCount++;
          continue;
        }
        
        // Remove _id if present (let MongoDB generate new one)
        const { _id, ...recipeData } = recipe;
        
        // Ensure required fields have defaults
        const recipeToSave = {
          ...recipeData,
          rating: recipe.rating || 0,
          viewCount: recipe.viewCount || 0,
          isPublished: recipe.isPublished !== false, // Default to true unless explicitly false
          createdAt: recipe.createdAt ? new Date(recipe.createdAt) : new Date(),
          updatedAt: recipe.updatedAt ? new Date(recipe.updatedAt) : new Date(),
        };
        
        // Save to database
        const savedRecipe = await db.createRecipe(recipeToSave);
        console.log(`✅ Synced "${savedRecipe.title}" (ID: ${savedRecipe._id})`);
        syncedCount++;
        
      } catch (error) {
        console.error(`❌ Failed to sync "${recipe.title}":`, error);
      }
    }
    
    console.log('\n📊 Sync Summary:');
    console.log(`✅ Successfully synced: ${syncedCount} recipes`);
    console.log(`⏭️  Skipped (duplicates): ${skippedCount} recipes`);
    console.log(`❌ Failed: ${recipes.length - syncedCount - skippedCount} recipes`);
    
    if (syncedCount > 0) {
      console.log('\n🎉 Recipes have been successfully synced to MongoDB!');
      console.log('🔗 You can now view them in your MongoDB database');
    }
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Recipe sync failed:', error);
    process.exit(1);
  }
}

syncRecipesToDB();