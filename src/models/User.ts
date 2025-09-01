import mongoose from 'mongoose';

// Use direct property access for better compatibility
const Schema = mongoose.Schema;
const model = mongoose.model;
const models = mongoose.models;

export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password?: string; // Optional for OAuth users
  avatar?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
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
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
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
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || this.username;
});

export const User = (models && models.User) || model<IUser>('User', UserSchema);