import mongoose from 'mongoose';

// Use direct property access for better compatibility
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

export interface ISocialPost {
  _id?: string;
  platform: 'instagram' | 'twitter' | 'facebook';
  user: string; // Username or handle
  content: string;
  image?: string;
  likes: number;
  shares?: number;
  comments?: number;
  postUrl?: string; // Link to original post
  relatedRecipeId?: string; // If post is about a specific recipe
  isActive: boolean;
  postedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SocialPostSchema = new Schema<ISocialPost>({
  platform: {
    type: String,
    required: true,
    enum: ['instagram', 'twitter', 'facebook']
  },
  user: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  image: String,
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  shares: {
    type: Number,
    default: 0,
    min: 0
  },
  comments: {
    type: Number,
    default: 0,
    min: 0
  },
  postUrl: String,
  relatedRecipeId: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
SocialPostSchema.index({ platform: 1, postedAt: -1 });
SocialPostSchema.index({ isActive: 1, postedAt: -1 });
SocialPostSchema.index({ relatedRecipeId: 1 });

export const SocialPost = (models && models.SocialPost) || model<ISocialPost>('SocialPost', SocialPostSchema);