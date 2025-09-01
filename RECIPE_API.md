# Recipe API Documentation

This document describes the Recipe API implementation for the Visual Builder Bliss application.

## Overview

The Recipe API provides a comprehensive interface for managing recipes, including CRUD operations, view tracking, and search functionality. It integrates with MongoDB for data persistence and includes intelligent ingredient parsing.

## API Structure

### File: `src/api/recipes.ts`

The main API class `RecipeAPI` provides static methods for all recipe operations.

## Data Types

### CreateRecipeRequest Interface
```typescript
interface CreateRecipeRequest {
  title: string;                    // Recipe title (required)
  image?: string;                   // Image URL (optional)
  category: string;                 // Recipe category (required)
  cookTime: string;                 // Cooking time e.g., "30 min" (required)
  servings: number;                 // Number of servings (required)
  calories: number;                 // Calorie count (required)
  ingredients: string[];            // Raw ingredient strings (required)
  instructions: string[];           // Step-by-step instructions (required)
  videoUrl?: string;                // YouTube video URL (optional)
  difficulty?: 'Easy' | 'Medium' | 'Hard';  // Recipe difficulty
  cuisine?: string;                 // Cuisine type (optional)
  tags?: string[];                  // Recipe tags (optional)
}
```

### ParsedIngredient Interface
```typescript
interface ParsedIngredient {
  name: string;                     // Ingredient name
  quantity: number;                 // Amount needed
  unit: string;                     // Unit of measurement
}
```

## API Methods

### Recipe Creation

#### `RecipeAPI.createRecipe(recipeData, userId?)`

Creates a new recipe in the database with intelligent ingredient parsing.

**Parameters:**
- `recipeData: CreateRecipeRequest` - Recipe data
- `userId?: string` - Optional user ID for recipe ownership

**Returns:** `Promise<IRecipe>` - The created recipe

**Features:**
- Parses ingredient strings into structured format
- Handles various input formats:
  - "2 cups flour" → `{name: "flour", quantity: 2, unit: "cups"}`
  - "Salt to taste" → `{name: "salt", quantity: 0, unit: "to taste"}`
  - "1 onion" → `{name: "onion", quantity: 1, unit: "piece"}`
- Sets default image if none provided
- Initializes rating and view count to 0

**Example:**
```typescript
const newRecipe = await RecipeAPI.createRecipe({
  title: "Pasta Carbonara",
  category: "Dinner",
  cookTime: "20 min",
  servings: 4,
  calories: 450,
  ingredients: [
    "400g spaghetti",
    "200g pancetta",
    "4 eggs",
    "100g parmesan cheese",
    "Salt and pepper to taste"
  ],
  instructions: [
    "Cook pasta according to package instructions",
    "Fry pancetta until crispy",
    "Mix eggs and cheese in a bowl",
    "Combine pasta with pancetta and egg mixture"
  ],
  difficulty: "Medium",
  cuisine: "Italian",
  tags: ["pasta", "italian", "quick"]
});
```

### Recipe Retrieval

#### `RecipeAPI.getRecipe(id)`

Fetches a single recipe by ID.

**Parameters:**
- `id: string` - Recipe ID

**Returns:** `Promise<IRecipe | null>` - The recipe or null if not found

#### `RecipeAPI.getRecipes(filters?)`

Fetches multiple recipes with optional filtering and sorting.

**Parameters:**
- `filters?: object` - Optional filters
  - `category?: string` - Filter by category
  - `limit?: number` - Maximum number of recipes
  - `skip?: number` - Number of recipes to skip
  - `sortBy?: string` - Sort criteria ('popular', 'recent', 'rating')
  - `userId?: string` - Filter by user (for user's recipes)

**Returns:** `Promise<IRecipe[]>` - Array of recipes

**Example:**
```typescript
// Get popular dinner recipes
const popularDinners = await RecipeAPI.getRecipes({
  category: "Dinner",
  sortBy: "popular",
  limit: 10
});

// Get recent recipes
const recentRecipes = await RecipeAPI.getRecipes({
  sortBy: "recent",
  limit: 5
});
```

#### `RecipeAPI.getFeaturedRecipes(limit?)`

Gets featured recipes sorted by popularity.

**Parameters:**
- `limit?: number` - Maximum number of recipes (default: 6)

**Returns:** `Promise<IRecipe[]>` - Array of featured recipes

### Recipe Updates

#### `RecipeAPI.updateRecipe(id, updateData)`

Updates an existing recipe.

**Parameters:**
- `id: string` - Recipe ID
- `updateData: Partial<IRecipe>` - Fields to update

**Returns:** `Promise<IRecipe | null>` - Updated recipe or null

#### `RecipeAPI.deleteRecipe(id)`

Deletes a recipe.

**Parameters:**
- `id: string` - Recipe ID

**Returns:** `Promise<boolean>` - Success status

### View Tracking

#### `RecipeAPI.incrementViewCount(recipeId, userId?)`

Increments view count for a recipe.

**Parameters:**
- `recipeId: string` - Recipe ID
- `userId?: string` - Optional user ID for tracking

**Returns:** `Promise<number>` - Updated view count

**Features:**
- Tracks both recipe view count and individual view records
- Generates session ID for anonymous users
- Updates recipe's viewCount field

#### `RecipeAPI.getViewCount(recipeId)`

Gets current view count for a recipe.

**Parameters:**
- `recipeId: string` - Recipe ID

**Returns:** `Promise<number>` - Current view count

### Search Functionality

#### `RecipeAPI.searchRecipes(query, filters?)`

Searches recipes by title, ingredients, tags, etc.

**Parameters:**
- `query: string` - Search query
- `filters?: object` - Optional filters
  - `category?: string` - Filter by category
  - `limit?: number` - Maximum results

**Returns:** `Promise<IRecipe[]>` - Matching recipes

**Features:**
- Searches across title, category, cuisine, tags, and ingredients
- Case-insensitive matching
- Partial word matching

## Usage Examples

### Complete Recipe Creation Flow

```typescript
import { RecipeAPI } from '@/api/recipes';

// Create a new recipe
try {
  const recipeData = {
    title: "Homemade Pizza",
    category: "Dinner",
    cookTime: "45 min",
    servings: 4,
    calories: 320,
    ingredients: [
      "500g pizza dough",
      "200ml tomato sauce",
      "200g mozzarella cheese",
      "100g pepperoni",
      "2 tbsp olive oil",
      "Fresh basil to taste"
    ],
    instructions: [
      "Preheat oven to 220°C",
      "Roll out pizza dough on floured surface",
      "Spread tomato sauce evenly",
      "Add mozzarella and pepperoni",
      "Bake for 12-15 minutes",
      "Garnish with fresh basil"
    ],
    difficulty: "Medium",
    cuisine: "Italian",
    tags: ["pizza", "italian", "homemade"]
  };

  const newRecipe = await RecipeAPI.createRecipe(recipeData);
  console.log('Recipe created:', newRecipe.title);
  
  // Navigate to the new recipe
  window.location.href = `/recipes/${newRecipe._id}`;
  
} catch (error) {
  console.error('Failed to create recipe:', error);
}
```

### Fetching and Displaying Recipes

```typescript
// Get recipes for homepage
const featuredRecipes = await RecipeAPI.getFeaturedRecipes(6);

// Display in React component
{featuredRecipes.map(recipe => (
  <RecipeCard 
    key={recipe._id}
    id={recipe._id}
    title={recipe.title}
    image={recipe.image}
    rating={recipe.rating}
    category={recipe.category}
  />
))}
```

### Search Implementation

```typescript
// Search recipes
const searchRecipes = async (query: string, category?: string) => {
  try {
    const results = await RecipeAPI.searchRecipes(query, {
      category,
      limit: 20
    });
    
    setSearchResults(results);
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

## Integration with UI Components

### CreateRecipePage Integration

The `CreateRecipePage` component uses the API for form submission:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const newRecipe = await RecipeAPI.createRecipe(formData);
    toast.success("Recipe created successfully!");
    navigate(`/recipes/${newRecipe._id}`);
  } catch (error) {
    toast.error("Failed to create recipe");
  }
};
```

### RecipeDetailPage Integration

The `RecipeDetailPage` fetches recipe data and tracks views:

```typescript
useEffect(() => {
  const fetchRecipe = async () => {
    const recipe = await RecipeAPI.getRecipe(id);
    setRecipe(recipe);
    
    // Track view
    await RecipeAPI.incrementViewCount(id);
  };
  
  fetchRecipe();
}, [id]);
```

## Error Handling

All API methods include comprehensive error handling:

- Database connection errors
- Validation errors
- Network timeouts
- Invalid data formats

Errors are logged to console and appropriate error messages are returned to the UI.

## Performance Considerations

- Database queries are optimized with indexes
- View counting is asynchronous to avoid blocking UI
- Recipe fetching includes pagination support
- Intelligent caching could be added for frequently accessed recipes

## Testing

Use the test script to verify API functionality:

```bash
npm run test:api
```

This runs comprehensive tests covering:
- Recipe creation
- Recipe fetching
- View count tracking
- Featured recipe retrieval
- Database connectivity

## Future Enhancements

Potential API improvements:

1. **User Authentication**: Add user-based recipe ownership and permissions
2. **Recipe Ratings**: Implement rating system with average calculations
3. **Image Upload**: Add image upload functionality with cloud storage
4. **Recipe Collections**: Allow users to create recipe collections
5. **Advanced Search**: Implement full-text search with MongoDB Atlas Search
6. **Recipe Recommendations**: Add ML-based recipe suggestions
7. **Batch Operations**: Support bulk recipe operations
8. **API Rate Limiting**: Add rate limiting for production use

## Dependencies

- **mongoose**: MongoDB object modeling
- **Database Models**: Recipe, User, ViewCount, SocialPost
- **Database Service**: Centralized database operations

## Environment Variables

Ensure these environment variables are set:

```
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

## Deployment Notes

For production deployment:

1. Set up proper MongoDB indexes
2. Implement authentication middleware
3. Add API rate limiting
4. Configure error monitoring
5. Set up automated backups
6. Implement caching strategy