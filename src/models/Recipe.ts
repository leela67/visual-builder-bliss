import mongoose from 'mongoose';

// Use direct property access for better compatibility
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface IRecipe {
  _id?: string;
  title: string;
  image: string;
  rating: number;
  category: string;
  cookTime: string;
  servings: number;
  calories: number;
  ingredients: IIngredient[];
  instructions: string[];
  videoUrl?: string;
  viewCount: number;
  createdBy?: string; // User ID
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  tags?: string[];
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  cuisine?: string;
}

const IngredientSchema = new Schema<IIngredient>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }
}, { _id: false });

const RecipeSchema = new Schema<IRecipe>({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  image: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    default: 0,
    min: 0,
    max: 5
  },
  category: { 
    type: String, 
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage']
  },
  cookTime: { 
    type: String, 
    required: true 
  },
  servings: { 
    type: Number, 
    required: true,
    min: 1
  },
  calories: { 
    type: Number, 
    required: true,
    min: 0
  },
  ingredients: [IngredientSchema],
  instructions: [{ 
    type: String, 
    required: true 
  }],
  videoUrl: { 
    type: String 
  },
  viewCount: { 
    type: Number, 
    default: 0 
  },
  createdBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
  isPublished: { 
    type: Boolean, 
    default: true 
  },
  tags: [String],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  cuisine: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
RecipeSchema.index({ category: 1 });
RecipeSchema.index({ rating: -1 });
RecipeSchema.index({ createdAt: -1 });
RecipeSchema.index({ viewCount: -1 });
RecipeSchema.index({ title: 'text', tags: 'text' });

// Virtual for average rating calculation (if we implement ratings later)
RecipeSchema.virtual('averageRating').get(function() {
  return this.rating;
});

export const Recipe = (models && models.Recipe) || model<IRecipe>('Recipe', RecipeSchema);