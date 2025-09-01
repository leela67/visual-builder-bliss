import { connectToDatabase } from './mongodb';
import type { IRecipe, IUser } from '../models';

export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async init() {
    try {
      await connectToDatabase();
      console.log('Database service initialized');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  // Recipe methods
  async createRecipe(recipeData: Partial<IRecipe>): Promise<IRecipe> {
    await this.init();
    const { Recipe } = await import('../models');
    const recipe = new Recipe(recipeData);
    return await recipe.save();
  }

  async getRecipe(id: string): Promise<IRecipe | null> {
    await this.init();
    const { Recipe } = await import('../models');
    return await Recipe.findById(id).populate('createdBy', 'username avatar');
  }

  async getRecipes(filters?: {
    category?: string;
    limit?: number;
    skip?: number;
    sortBy?: string;
  }): Promise<IRecipe[]> {
    await this.init();
    const { Recipe } = await import('../models');
    const query = Recipe.find({ isPublished: true });
    
    if (filters?.category) {
      query.where({ category: filters.category });
    }
    
    if (filters?.sortBy) {
      if (filters.sortBy === 'popular') {
        query.sort({ viewCount: -1, rating: -1 });
      } else if (filters.sortBy === 'recent') {
        query.sort({ createdAt: -1 });
      } else if (filters.sortBy === 'rating') {
        query.sort({ rating: -1 });
      }
    } else {
      query.sort({ createdAt: -1 });
    }

    if (filters?.skip) {
      query.skip(filters.skip);
    }

    if (filters?.limit) {
      query.limit(filters.limit);
    }

    return await query.populate('createdBy', 'username avatar');
  }

  async updateRecipe(id: string, updateData: Partial<IRecipe>): Promise<IRecipe | null> {
    await this.init();
    const { Recipe } = await import('../models');
    return await Recipe.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteRecipe(id: string): Promise<boolean> {
    await this.init();
    const { Recipe } = await import('../models');
    const result = await Recipe.findByIdAndDelete(id);
    return !!result;
  }

  async incrementViewCount(recipeId: string, userId?: string, sessionId?: string): Promise<number> {
    await this.init();
    const { Recipe, ViewCount } = await import('../models');
    
    // Record the view
    const viewCount = new ViewCount({
      recipeId,
      userId,
      sessionId,
      viewedAt: new Date()
    });
    await viewCount.save();

    // Update recipe view count
    const recipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    return recipe?.viewCount || 0;
  }

  async getViewCount(recipeId: string): Promise<number> {
    await this.init();
    const { Recipe } = await import('../models');
    const recipe = await Recipe.findById(recipeId, 'viewCount');
    return recipe?.viewCount || 0;
  }

  // User methods
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    await this.init();
    const { User } = await import('../models');
    const user = new User(userData);
    return await user.save();
  }

  async getUser(id: string): Promise<IUser | null> {
    await this.init();
    const { User } = await import('../models');
    return await User.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    await this.init();
    const { User } = await import('../models');
    return await User.findOne({ email: email.toLowerCase() });
  }

  async addToFavorites(userId: string, recipeId: string): Promise<boolean> {
    await this.init();
    const { User } = await import('../models');
    const result = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favoriteRecipes: recipeId } }
    );
    return !!result;
  }

  async removeFromFavorites(userId: string, recipeId: string): Promise<boolean> {
    await this.init();
    const { User } = await import('../models');
    const result = await User.findByIdAndUpdate(
      userId,
      { $pull: { favoriteRecipes: recipeId } }
    );
    return !!result;
  }

  // Social Post methods
  async getSocialPosts(limit: number = 10): Promise<any[]> {
    await this.init();
    const { SocialPost } = await import('../models');
    return await SocialPost.find({ isActive: true })
      .sort({ postedAt: -1 })
      .limit(limit)
      .populate('relatedRecipeId', 'title image');
  }

  async createSocialPost(postData: any): Promise<any> {
    await this.init();
    const { SocialPost } = await import('../models');
    const post = new SocialPost(postData);
    return await post.save();
  }

  // Seed initial data
  async seedDatabase(): Promise<void> {
    await this.init();
    const { Recipe, SocialPost } = await import('../models');
    
    // Check if data already exists
    const existingRecipes = await Recipe.countDocuments();
    if (existingRecipes > 0) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database with initial data...');

    // Create sample recipes
    const sampleRecipes = [
      {
        title: "Pasta with Vegetables",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
        rating: 5,
        category: "Dinner",
        cookTime: "25 min",
        servings: 4,
        calories: 300,
        ingredients: [
          { name: "pasta", quantity: 200, unit: "g" },
          { name: "zucchini", quantity: 1, unit: "piece" },
          { name: "carrot", quantity: 1, unit: "piece" },
          { name: "tomatoes", quantity: 2, unit: "pieces" },
          { name: "olive oil", quantity: 2, unit: "tbsp" },
          { name: "salt and pepper", quantity: 0, unit: "to taste" },
          { name: "fresh herbs (basil, parsley)", quantity: 0, unit: "to taste" }
        ],
        instructions: [
          "Cook pasta according to package instructions until al dente.",
          "Meanwhile, dice the zucchini, carrot, and tomatoes.",
          "Heat olive oil in a large pan over medium heat.",
          "Add vegetables and cook for 5-7 minutes until tender.",
          "Drain pasta and add to the pan with vegetables.",
          "Toss everything together and season with salt and pepper.",
          "Garnish with fresh herbs and serve hot."
        ],
        videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
        viewCount: 156,
        difficulty: 'Medium',
        cuisine: 'Italian',
        tags: ['healthy', 'vegetarian', 'quick']
      },
      {
        title: "Healthy Breakfast Bowl",
        image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop",
        rating: 4,
        category: "Breakfast",
        cookTime: "10 min",
        servings: 2,
        calories: 350,
        ingredients: [
          { name: "oats", quantity: 100, unit: "g" },
          { name: "banana", quantity: 1, unit: "piece" },
          { name: "berries", quantity: 150, unit: "g" },
          { name: "yogurt", quantity: 200, unit: "ml" },
          { name: "honey", quantity: 2, unit: "tbsp" },
          { name: "nuts", quantity: 30, unit: "g" }
        ],
        instructions: [
          "Cook oats according to package instructions.",
          "Slice the banana into rounds.",
          "In a bowl, layer the cooked oats.",
          "Top with yogurt, banana slices, and berries.",
          "Drizzle with honey and sprinkle with nuts.",
          "Serve immediately and enjoy!"
        ],
        videoUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
        viewCount: 89,
        difficulty: 'Easy',
        cuisine: 'International',
        tags: ['healthy', 'breakfast', 'quick', 'nutritious']
      },
      {
        title: "Mediterranean Salad",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
        rating: 4,
        category: "Lunch",
        cookTime: "15 min",
        servings: 3,
        calories: 250,
        ingredients: [
          { name: "mixed greens", quantity: 200, unit: "g" },
          { name: "cherry tomatoes", quantity: 150, unit: "g" },
          { name: "cucumber", quantity: 1, unit: "piece" },
          { name: "feta cheese", quantity: 100, unit: "g" },
          { name: "olives", quantity: 50, unit: "g" },
          { name: "olive oil", quantity: 3, unit: "tbsp" },
          { name: "lemon juice", quantity: 2, unit: "tbsp" },
          { name: "oregano", quantity: 1, unit: "tsp" }
        ],
        instructions: [
          "Wash and prepare all vegetables.",
          "Cut cherry tomatoes in half and slice cucumber.",
          "Combine greens, tomatoes, and cucumber in a large bowl.",
          "Add crumbled feta cheese and olives.",
          "Whisk olive oil, lemon juice, and oregano for dressing.",
          "Pour dressing over salad and toss gently.",
          "Serve immediately as a fresh, healthy meal."
        ],
        viewCount: 67,
        difficulty: 'Easy',
        cuisine: 'Mediterranean',
        tags: ['healthy', 'vegetarian', 'fresh', 'light']
      }
    ];

    await Recipe.insertMany(sampleRecipes);

    // Create sample social posts
    const sampleSocialPosts = [
      {
        platform: "instagram",
        user: "@recipemasters",
        content: "Check out this amazing pasta dish! 🍝 Simple ingredients, incredible flavor. What's your favorite comfort food?",
        likes: 124,
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
        postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        platform: "twitter",
        user: "@healthyeats",
        content: "Starting your morning right with this nutritious breakfast bowl! 🥣 Packed with oats, fresh fruits, and energy for the day ahead.",
        likes: 89,
        image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop",
        postedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        platform: "facebook",
        user: "Cooking Community",
        content: "Weekend cooking tip: Prep your ingredients in advance for stress-free weekday meals! What's your favorite meal prep hack?",
        likes: 67,
        postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    await SocialPost.insertMany(sampleSocialPosts);

    console.log('✅ Database seeded successfully with sample data');
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance();