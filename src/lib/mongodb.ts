import mongoose from 'mongoose';

// Handle both browser (Vite) and Node.js environments
const MONGODB_URI = (() => {
  // Browser environment (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://beinghomeindia_db_user:61T4qaiJJNaCdRbo@cluster0.dldoreq.mongodb.net/visual-builder-bliss';
  }
  // Node.js environment (scripts)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.MONGODB_URI || 'mongodb+srv://beinghomeindia_db_user:61T4qaiJJNaCdRbo@cluster0.dldoreq.mongodb.net/visual-builder-bliss';
  }
  // Fallback
  return 'mongodb+srv://beinghomeindia_db_user:61T4qaiJJNaCdRbo@cluster0.dldoreq.mongodb.net/visual-builder-bliss';
})();

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI or VITE_MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Cross-platform global object access
const globalForMongoose = (() => {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof window !== 'undefined') return window as any;
  if (typeof global !== 'undefined') return global;
  throw new Error('Unable to locate global object');
})();

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = globalForMongoose.mongoose || { conn: null, promise: null };

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: 'visual-builder-bliss',
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ Connected to MongoDB');
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection error:', e);
    throw e;
  }
}

export { mongoose };