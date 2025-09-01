# MongoDB Database Setup

This document describes the MongoDB database setup for the Visual Builder Bliss recipe application.

## Database Configuration

### Connection Details
- **MongoDB URI**: `mongodb+srv://beinghomeindia_db_user:61T4qaiJJNaCdRbo@cluster0.dldoreq.mongodb.net/`
- **Database Name**: `visual-builder-bliss`
- **Connection File**: `src/lib/mongodb.ts`

### Environment Variables
Create a `.env` file in the root directory with:
```
MONGODB_URI=mongodb+srv://beinghomeindia_db_user:61T4qaiJJNaCdRbo@cluster0.dldoreq.mongodb.net/visual-builder-bliss
NODE_ENV=development
PORT=3000
```

## Database Schema

### Collections

#### 1. Recipes Collection
**File**: `src/models/Recipe.ts`

**Fields**:
- `title`: Recipe name
- `image`: Recipe image URL
- `rating`: Rating (0-5)
- `category`: Recipe category (Breakfast, Lunch, Dinner, Snack, Dessert, Beverage)
- `cookTime`: Cooking time (e.g., "25 min")
- `servings`: Number of servings
- `calories`: Calorie count
- `ingredients`: Array of ingredient objects with `name`, `quantity`, `unit`
- `instructions`: Array of instruction strings
- `videoUrl`: Optional YouTube video URL
- `viewCount`: Number of views
- `createdBy`: User ID (ObjectId reference)
- `isPublished`: Publication status
- `tags`: Array of tags
- `difficulty`: Easy/Medium/Hard
- `cuisine`: Cuisine type
- `createdAt`, `updatedAt`: Timestamps

#### 2. Users Collection
**File**: `src/models/User.ts`

**Fields**:
- `username`: Unique username
- `email`: Unique email address
- `password`: Hashed password (optional for OAuth users)
- `avatar`: Profile image URL
- `firstName`, `lastName`: Full name components
- `bio`: User biography
- `favoriteRecipes`: Array of recipe ObjectIds
- `createdRecipes`: Array of recipe ObjectIds
- `socialLinks`: Instagram, Twitter, Facebook URLs
- `preferences`: Dietary restrictions, cuisine preferences, skill level
- `isEmailVerified`: Email verification status
- `lastLoginAt`: Last login timestamp
- `createdAt`, `updatedAt`: Timestamps

#### 3. ViewCounts Collection
**File**: `src/models/ViewCount.ts`

**Fields**:
- `recipeId`: Recipe ObjectId reference
- `userId`: User ObjectId reference (optional)
- `sessionId`: Anonymous user session ID
- `ipAddress`: User IP address
- `userAgent`: Browser user agent
- `viewedAt`: Timestamp of view

#### 4. SocialPosts Collection
**File**: `src/models/SocialPost.ts`

**Fields**:
- `platform`: instagram/twitter/facebook
- `user`: Username or handle
- `content`: Post content
- `image`: Post image URL (optional)
- `likes`, `shares`, `comments`: Engagement metrics
- `postUrl`: Link to original post
- `relatedRecipeId`: Associated recipe ObjectId
- `isActive`: Post visibility status
- `postedAt`: Original post timestamp
- `createdAt`, `updatedAt`: Timestamps

## Database Service

### File: `src/lib/database.ts`

The `DatabaseService` class provides a singleton pattern for database operations:

#### Key Methods:

**Recipe Operations**:
- `createRecipe(recipeData)`: Create new recipe
- `getRecipe(id)`: Get recipe by ID
- `getRecipes(filters)`: Get recipes with filtering/sorting
- `updateRecipe(id, updateData)`: Update recipe
- `deleteRecipe(id)`: Delete recipe
- `incrementViewCount(recipeId, userId?, sessionId?)`: Track recipe views
- `getViewCount(recipeId)`: Get recipe view count

**User Operations**:
- `createUser(userData)`: Create new user
- `getUser(id)`: Get user by ID
- `getUserByEmail(email)`: Get user by email
- `addToFavorites(userId, recipeId)`: Add recipe to favorites
- `removeFromFavorites(userId, recipeId)`: Remove from favorites

**Social Media Operations**:
- `getSocialPosts(limit)`: Get social media posts
- `createSocialPost(postData)`: Create new social post

## Database Indexes

For optimal query performance, the following indexes are created:

**Recipes**:
- `category: 1`
- `rating: -1`
- `createdAt: -1`
- `viewCount: -1`
- `title: text, tags: text` (full-text search)

**Users**:
- `email: 1`
- `username: 1`

**ViewCounts**:
- `recipeId: 1, viewedAt: -1`
- `userId: 1`
- `sessionId: 1`
- `recipeId: 1, userId: 1` (compound for unique views)

**SocialPosts**:
- `platform: 1, postedAt: -1`
- `isActive: 1, postedAt: -1`
- `relatedRecipeId: 1`

## Usage

### Initialize Database Connection
```typescript
import { db } from './src/lib/database';

// Initialize connection
await db.init();
```

### Seed Database with Sample Data
```bash
# Run seeding script
npm run seed

# Or manually
npm run db:seed
```

### Example Usage
```typescript
import { db } from './src/lib/database';

// Get all recipes
const recipes = await db.getRecipes({ category: 'Dinner', limit: 10 });

// Create a new recipe
const newRecipe = await db.createRecipe({
  title: 'New Recipe',
  category: 'Dinner',
  // ... other fields
});

// Increment view count
await db.incrementViewCount(recipeId, userId);
```

## Scripts

### Available npm Scripts:
- `npm run seed`: Seed database with sample data
- `npm run db:seed`: Alternative seed command

### Manual Database Operations:
```bash
# Connect to MongoDB Atlas
# Use MongoDB Compass or Atlas web interface
# Connection string: mongodb+srv://beinghomeindia_db_user:61T4qaiJJNaCdRbo@cluster0.dldoreq.mongodb.net/visual-builder-bliss
```

## Migration and Backup

For production deployments:
1. Export data: Use MongoDB Atlas backup features
2. Import data: Use `mongorestore` or Atlas import tools
3. Index management: Indexes are automatically created via schema definitions

## Security Considerations

- Database credentials are stored in environment variables
- User passwords should be hashed before storage
- Implement proper authentication middleware
- Use connection pooling for production
- Regular backup strategy recommended

## Troubleshooting

### Common Issues:
1. **Connection timeout**: Check network connectivity and MongoDB Atlas whitelist
2. **Duplicate key errors**: Ensure unique constraints on email/username
3. **Schema validation errors**: Verify data types match schema definitions

### Debug Connection:
```bash
# Test database connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('your-connection-string')
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Connection error:', err));
"
```