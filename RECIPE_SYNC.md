# Recipe Database Sync Guide

This guide explains how to sync user-created recipes from the browser's localStorage to your MongoDB database.

## Overview

The application currently works in two environments:

1. **Browser Environment**: User-created recipes are stored in `localStorage` for immediate functionality
2. **Database Environment**: Production recipes are stored in MongoDB Atlas for persistence

## Why This Setup?

Since this is a frontend-only Vite React application without a backend API server, we cannot directly save recipes from the browser to MongoDB. The current setup provides:

- ✅ **Immediate functionality**: Users can create and view recipes instantly
- ✅ **Data persistence**: Recipes survive browser sessions via localStorage  
- ✅ **Database sync capability**: Manual sync process to move recipes to MongoDB
- ✅ **Production ready**: Database contains the official recipe collection

## How to Sync Recipes to MongoDB

### Method 1: Using the Export Button

1. **Create recipes** in the browser using the "Create Recipe" page
2. **Click the "Export" button** in the top-right corner of the Create Recipe page
3. **Open browser console** (F12 → Console tab)
4. **Copy the JSON output** from the console
5. **Paste into recipes-to-sync.json** (located in project root)
6. **Run sync command**:
   ```bash
   npm run sync-recipes
   ```

### Method 2: Manual Console Export

1. **Open browser console** (F12 → Console tab)
2. **Run export command**:
   ```javascript
   exportRecipesToConsole()
   ```
3. **Copy the JSON output**
4. **Paste into recipes-to-sync.json**
5. **Run sync command**:
   ```bash
   npm run sync-recipes
   ```

### Method 3: Direct localStorage Access

1. **Open browser console** (F12 → Console tab)  
2. **Get raw data**:
   ```javascript
   console.log(JSON.stringify(JSON.parse(localStorage.getItem('demo-recipes') || '[]'), null, 2))
   ```
3. **Wrap in proper format** and save to `recipes-to-sync.json`:
   ```json
   {
     "instructions": "Copy the recipes array below to recipes-to-sync.json and run 'npm run sync-recipes'",
     "recipes": [
       // Paste your recipes here
     ]
   }
   ```
4. **Run sync command**:
   ```bash
   npm run sync-recipes
   ```

## File Structure

```
project-root/
├── recipes-to-sync.json          # Recipe staging file (auto-created)
├── src/
│   ├── scripts/
│   │   ├── seedDatabase.ts        # Initial database seeding
│   │   └── syncRecipesToDB.ts     # Recipe sync script
│   ├── api/
│   │   └── recipes.ts             # Cross-environment Recipe API
│   └── pages/
│       └── CreateRecipePage.tsx   # Recipe creation form
```

## Recipe Data Flow

```
User Creates Recipe
        ↓
[Browser localStorage] ← User can immediately view/use recipes
        ↓
Export via UI/Console
        ↓
[recipes-to-sync.json] ← Staging file
        ↓
npm run sync-recipes
        ↓
[MongoDB Atlas] ← Permanent database storage
```

## Example Sync Session

```bash
# 1. Create recipes in browser (localStorage)
# 2. Export recipes via UI button or console
# 3. Sync to database
$ npm run sync-recipes

🔄 Starting recipe sync to MongoDB...
📚 Found 3 recipe(s) to sync
✅ Synced "My Awesome Pasta" (ID: 507f1f77bcf86cd799439011)
✅ Synced "Healthy Smoothie Bowl" (ID: 507f1f77bcf86cd799439012)
⏭️  Skipping "Chocolate Cake" (already exists)

📊 Sync Summary:
✅ Successfully synced: 2 recipes
⏭️  Skipped (duplicates): 1 recipes
❌ Failed: 0 recipes

🎉 Recipes have been successfully synced to MongoDB!
```

## Features

### Duplicate Prevention
- Checks recipe titles to avoid duplicates
- Skips recipes that already exist in database
- Provides detailed sync summary

### Data Validation
- Ensures required fields have defaults
- Handles missing or invalid data gracefully
- Preserves user-created metadata (view counts, ratings)

### Cross-Environment Compatibility
- Recipe API works in both browser and Node.js
- Automatic environment detection
- Consistent data structures

## Database Schema

Recipes are stored with the following structure:

```typescript
interface IRecipe {
  _id: string;
  title: string;
  image?: string;
  rating: number;
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
  viewCount: number;
  createdBy?: string;
  isPublished: boolean;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cuisine?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Troubleshooting

### "No recipes found in recipes-to-sync.json"
- Make sure you've added recipes to the `recipes` array in the JSON file
- Verify the file format matches the expected structure

### "Invalid file format" 
- Ensure recipes-to-sync.json has the correct structure:
  ```json
  {
    "instructions": "...",
    "recipes": [...]
  }
  ```

### "Database connection failed"
- Check your MongoDB connection string in environment variables
- Verify `VITE_MONGODB_URI` is set correctly
- Ensure database is accessible

### "Recipe already exists" (not syncing)
- This is normal - prevents duplicates
- Recipe titles are checked for existence
- Modify the title slightly if you want to create a variant

## Future Enhancements

For a production application, consider:

1. **Backend API Server**: Express.js/Node.js server with proper REST endpoints
2. **Real-time Sync**: Automatic sync when recipes are created
3. **User Authentication**: Associate recipes with specific users
4. **Advanced Duplicate Detection**: Beyond simple title matching
5. **Bulk Operations**: Import/export multiple recipes at once
6. **Recipe Versioning**: Track changes to recipes over time

## Commands Reference

```bash
# Seed initial database with sample recipes
npm run seed

# Sync localStorage recipes to MongoDB
npm run sync-recipes

# Test Recipe API functionality  
npm run test:api

# Run development server
npm run dev
```

This setup provides a practical bridge between the frontend-only application and database persistence, allowing users to create recipes immediately while providing a path to permanent storage.