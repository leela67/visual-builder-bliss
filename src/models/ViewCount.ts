import mongoose from 'mongoose';

// Use direct property access for better compatibility
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

export interface IViewCount {
  _id?: string;
  recipeId: string;
  userId?: string; // Optional - for tracking unique views per user
  sessionId?: string; // For anonymous users
  ipAddress?: string;
  userAgent?: string;
  viewedAt: Date;
}

const ViewCountSchema = new Schema<IViewCount>({
  recipeId: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionId: String,
  ipAddress: String,
  userAgent: String,
  viewedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Indexes for efficient querying
ViewCountSchema.index({ recipeId: 1, viewedAt: -1 });
ViewCountSchema.index({ userId: 1 });
ViewCountSchema.index({ sessionId: 1 });

// Compound index for unique views per user per recipe (optional constraint)
ViewCountSchema.index({ recipeId: 1, userId: 1 }, { sparse: true });

export const ViewCount = (models && models.ViewCount) || model<IViewCount>('ViewCount', ViewCountSchema);