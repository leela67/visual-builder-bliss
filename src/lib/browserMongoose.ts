// Browser-compatible mongoose wrapper
// This module provides a shim for mongoose functionality in browser environments

interface BrowserSchema {
  add(obj: any): void;
  index(fields: any, options?: any): void;
  virtual(name: string): {
    get(fn: () => any): void;
  };
}

interface BrowserModel<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string, select?: string): Promise<T | null>;
  find(filter?: any): {
    sort(sortObj: any): {
      limit(num: number): {
        skip(num: number): {
          populate(path: string, select?: string): Promise<T[]>;
        };
      };
    };
  };
  findByIdAndUpdate(id: string, update: any, options?: any): Promise<T | null>;
  findByIdAndDelete(id: string): Promise<T | null>;
  findOne(filter: any): Promise<T | null>;
  insertMany(docs: any[]): Promise<T[]>;
  countDocuments(filter?: any): Promise<number>;
}

// Browser-compatible schema implementation
class BrowserSchemaImpl implements BrowserSchema {
  private definition: any;
  private indexes: any[] = [];
  private virtuals: { [key: string]: () => any } = {};

  constructor(definition: any, options?: any) {
    this.definition = definition;
  }

  add(obj: any): void {
    Object.assign(this.definition, obj);
  }

  index(fields: any, options?: any): void {
    this.indexes.push({ fields, options });
  }

  virtual(name: string) {
    return {
      get: (fn: () => any) => {
        this.virtuals[name] = fn;
      }
    };
  }
}

// Browser-compatible model implementation  
class BrowserModelImpl<T> implements BrowserModel<T> {
  private schema: BrowserSchemaImpl;
  private modelName: string;

  constructor(modelName: string, schema: BrowserSchemaImpl) {
    this.modelName = modelName;
    this.schema = schema;
  }

  async create(data: Partial<T>): Promise<T> {
    // In browser environment, we'll delegate to our API layer
    throw new Error('Database operations should use the API layer in browser environment');
  }

  async findById(id: string, select?: string): Promise<T | null> {
    throw new Error('Database operations should use the API layer in browser environment');
  }

  find(filter?: any) {
    return {
      sort: (sortObj: any) => ({
        limit: (num: number) => ({
          skip: (num: number) => ({
            populate: async (path: string, select?: string): Promise<T[]> => {
              throw new Error('Database operations should use the API layer in browser environment');
            }
          })
        })
      })
    };
  }

  async findByIdAndUpdate(id: string, update: any, options?: any): Promise<T | null> {
    throw new Error('Database operations should use the API layer in browser environment');
  }

  async findByIdAndDelete(id: string): Promise<T | null> {
    throw new Error('Database operations should use the API layer in browser environment');
  }

  async findOne(filter: any): Promise<T | null> {
    throw new Error('Database operations should use the API layer in browser environment');
  }

  async insertMany(docs: any[]): Promise<T[]> {
    throw new Error('Database operations should use the API layer in browser environment');
  }

  async countDocuments(filter?: any): Promise<number> {
    throw new Error('Database operations should use the API layer in browser environment');
  }
}

// Mock mongoose Types for browser compatibility
const Types = {
  ObjectId: String // Simplified for browser use
};

// Browser-compatible mongoose interface
export const browserMongoose = {
  Schema: function(definition: any, options?: any) {
    return new BrowserSchemaImpl(definition, options);
  },
  model: function<T>(name: string, schema: BrowserSchemaImpl): BrowserModel<T> {
    return new BrowserModelImpl<T>(name, schema);
  },
  models: {} as { [key: string]: any },
  Types
};

// Environment detection and mongoose provider
const getMongooseProvider = async () => {
  // Check if we're in Node.js environment
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    // Use real mongoose in Node.js
    const mongoose = await import('mongoose');
    return mongoose.default;
  }
  
  // Use browser-compatible version in browser
  return browserMongoose;
};

export default getMongooseProvider;