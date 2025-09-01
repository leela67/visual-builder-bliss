import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './src/lib/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Recipe API Server is running' });
});

// Recipe API Routes - Order matters! Specific routes before parameterized ones
app.get('/api/recipes/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    console.log('⭐ Fetching featured recipes, limit:', limit);
    const recipes = await db.getRecipes({
      sortBy: 'popular',
      limit,
      skip: 0
    });
    res.json(recipes);
  } catch (error) {
    console.error('❌ Error fetching featured recipes:', error);
    res.status(500).json({ error: 'Failed to fetch featured recipes', details: error.message });
  }
});

app.get('/api/recipes/search', async (req, res) => {
  try {
    const { q: query, category, limit } = req.query;
    console.log('🔎 Searching recipes for:', query);
    
    const allRecipes = await db.getRecipes({
      category: category || undefined,
      limit: limit ? parseInt(limit) : 20
    });

    if (!query || !query.trim()) {
      return res.json(allRecipes);
    }

    const searchTerms = query.toLowerCase().split(' ');
    const filteredRecipes = allRecipes.filter(recipe => {
      const searchableText = [
        recipe.title,
        recipe.category,
        recipe.cuisine,
        ...(recipe.tags || []),
        ...recipe.ingredients.map(ing => ing.name)
      ].join(' ').toLowerCase();

      return searchTerms.some(term => searchableText.includes(term));
    });
    
    res.json(filteredRecipes);
  } catch (error) {
    console.error('❌ Error searching recipes:', error);
    res.status(500).json({ error: 'Failed to search recipes', details: error.message });
  }
});

app.post('/api/recipes', async (req, res) => {
  try {
    console.log('📝 Creating new recipe:', req.body.title);
    const recipe = await db.createRecipe(req.body);
    console.log('✅ Recipe created successfully:', recipe._id);
    res.status(201).json(recipe);
  } catch (error) {
    console.error('❌ Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe', details: error.message });
  }
});

app.get('/api/recipes', async (req, res) => {
  try {
    const { category, limit, skip, sortBy, userId } = req.query;
    const filters = {
      category: category || undefined,
      limit: limit ? parseInt(limit) : undefined,
      skip: skip ? parseInt(skip) : undefined,
      sortBy: sortBy || undefined,
      userId: userId || undefined
    };
    
    console.log('📚 Fetching recipes with filters:', filters);
    const recipes = await db.getRecipes(filters);
    res.json(recipes);
  } catch (error) {
    console.error('❌ Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes', details: error.message });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    console.log('🔍 Fetching recipe:', req.params.id);
    const recipe = await db.getRecipe(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('❌ Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe', details: error.message });
  }
});

app.put('/api/recipes/:id', async (req, res) => {
  try {
    console.log('✏️ Updating recipe:', req.params.id);
    const recipe = await db.updateRecipe(req.params.id, req.body);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('❌ Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe', details: error.message });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    console.log('🗑️ Deleting recipe:', req.params.id);
    const success = await db.deleteRecipe(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe', details: error.message });
  }
});

app.post('/api/recipes/:id/view', async (req, res) => {
  try {
    const { userId } = req.body;
    console.log('👁️ Incrementing view count for recipe:', req.params.id);
    const viewCount = await db.incrementViewCount(req.params.id, userId);
    res.json({ viewCount });
  } catch (error) {
    console.error('❌ Error incrementing view count:', error);
    res.status(500).json({ error: 'Failed to increment view count', details: error.message });
  }
});

app.get('/api/recipes/:id/views', async (req, res) => {
  try {
    console.log('📊 Getting view count for recipe:', req.params.id);
    const viewCount = await db.getViewCount(req.params.id);
    res.json({ viewCount });
  } catch (error) {
    console.error('❌ Error getting view count:', error);
    res.status(500).json({ error: 'Failed to get view count', details: error.message });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Server Error:', error);
  res.status(500).json({ error: 'Internal server error', details: error.message });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Recipe API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🍳 Recipe API: http://localhost:${PORT}/api/recipes`);
});