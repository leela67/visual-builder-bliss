import mongoose from 'mongoose';

// Use direct property access for better compatibility
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

export interface IUser {
  _id?: string;
  id?: number; // API uses numeric IDs
  username?: string; // Optional for backward compatibility
  phone_number: string; // Primary identifier as per API
  email?: string; // Optional for backward compatibility
  name: string; // Full name as per API
  password?: string; // Optional for OAuth users
  avatar?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  interests: string[]; // As per API documentation
  favoriteRecipes: string[]; // Recipe IDs
  createdRecipes: string[]; // Recipe IDs
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  preferences?: {
    dietaryRestrictions?: string[];
    cuisinePreferences?: string[];
    skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  };
  isEmailVerified?: boolean;
  lastLoginAt?: Date;
  created_at?: string; // API format
  updated_at?: string; // API format
  createdAt?: Date; // Mongoose format
  updatedAt?: Date; // Mongoose format
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  phone_number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true, // Allow null/undefined values
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  password: {
    type: String,
    minlength: 6
  },
  avatar: String,
  firstName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  bio: {
    type: String,
    maxlength: 500
  },
  interests: {
    type: [String],
    default: []
  },
  favoriteRecipes: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  createdRecipes: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  }],
  socialLinks: {
    instagram: String,
    twitter: String,
    facebook: String
  },
  preferences: {
    dietaryRestrictions: [String],
    cuisinePreferences: [String],
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner'
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLoginAt: Date
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Indexes
UserSchema.index({ phone_number: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || this.name || this.username;
});

export const User = (models && models.User) || model<IUser>('User', UserSchema);