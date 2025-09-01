# Environment Setup Guide

This document explains how to set up environment variables for the Visual Builder Bliss application.

## Issue Resolution

### Problem
The application was throwing this error in the browser:
```
mongodb.ts:3 Uncaught ReferenceError: process is not defined at mongodb.ts:3:21
```

### Root Cause
The error occurred because `process.env` is a Node.js environment variable that's not available in the browser. This is a common issue when trying to access server-side environment variables in client-side code.

### Solution
We implemented Vite's environment variable system which properly handles environment variables in the browser by prefixing them with `VITE_`.

## Environment Variables Setup

### 1. Vite Environment Variables
Vite only exposes environment variables prefixed with `VITE_` to the client-side code for security reasons.

**Frontend Variables (accessible in browser):**
```bash
VITE_MONGODB_URI=mongodb+srv://your-connection-string
```

**Backend Variables (for scripts only):**
```bash
MONGODB_URI=mongodb+srv://your-connection-string
```

### 2. File Structure
```
.env                 # Local environment variables
.env.example         # Template for environment variables
```

### 3. Current Configuration

**`.env` file:**
```bash
# MongoDB Configuration (VITE_ prefix for frontend access)
VITE_MONGODB_URI=mongodb+srv://beinghomeindia_db_user:61T4qaiJJNaCdRbo@cluster0.dldoreq.mongodb.net/visual-builder-bliss

# Application Configuration
NODE_ENV=development
PORT=3000

# Legacy support for scripts (non-VITE prefixed)
MONGODB_URI=mongodb+srv://beinghomeindia_db_user:61T4qaiJJNaCdRbo@cluster0.dldoreq.mongodb.net/visual-builder-bliss
```

## Code Changes Made

### 1. Updated MongoDB Connection (`src/lib/mongodb.ts`)
**Before:**
```typescript
const MONGODB_URI = process.env.MONGODB_URI || 'fallback-uri';
```

**After:**
```typescript
const MONGODB_URI = import.meta.env.VITE_MONGODB_URI || 'fallback-uri';
```

### 2. Added Environment Testing Utility (`src/utils/envTest.ts`)
```typescript
export const testEnvironmentVariables = () => {
  console.log('🔍 Environment Variables Test:');
  console.log('VITE_MONGODB_URI:', import.meta.env.VITE_MONGODB_URI ? '✅ Available' : '❌ Not found');
  console.log('NODE_ENV:', import.meta.env.NODE_ENV);
  console.log('DEV:', import.meta.env.DEV);
  console.log('PROD:', import.meta.env.PROD);
};
```

## How Vite Environment Variables Work

### 1. Prefix Requirement
- Only variables prefixed with `VITE_` are exposed to client-side code
- This prevents accidental exposure of sensitive server-side variables

### 2. Import Syntax
```typescript
// Access environment variables in client code
const apiUrl = import.meta.env.VITE_API_URL;
const mongoUri = import.meta.env.VITE_MONGODB_URI;

// Built-in Vite variables
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const mode = import.meta.env.MODE;
```

### 3. TypeScript Support
For better TypeScript support, you can extend the ImportMetaEnv interface:

```typescript
// vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_MONGODB_URI: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

## Security Considerations

### 1. Frontend vs Backend Variables
- **Frontend (`VITE_` prefix)**: Visible to users, use for non-sensitive data
- **Backend (no prefix)**: Server-only, use for sensitive data like API keys

### 2. MongoDB Connection String
In this case, the MongoDB connection string is exposed to the frontend because:
- This is a client-side application connecting directly to MongoDB
- MongoDB Atlas has IP whitelisting and user authentication
- In production, consider using a backend API instead

### 3. Production Best Practices
For production applications:
1. Use a backend API to handle database operations
2. Keep sensitive credentials server-side
3. Use environment-specific configuration files
4. Implement proper authentication and authorization

## Troubleshooting

### 1. Environment Variables Not Loading
- Ensure variables start with `VITE_` prefix
- Restart the development server after changing `.env`
- Check the browser console for the environment test logs

### 2. MongoDB Connection Issues
- Verify the connection string format
- Check MongoDB Atlas network access settings
- Ensure the database user has proper permissions

### 3. Build Issues
- Environment variables are embedded at build time
- Different `.env` files for different environments (`.env.local`, `.env.production`)

## Testing Environment Variables

### 1. Development Console
Check the browser console for environment variable test logs when the app loads.

### 2. Manual Testing
```typescript
// In browser console
console.log(import.meta.env.VITE_MONGODB_URI);
```

### 3. Build Verification
```bash
npm run build
# Check if environment variables are properly embedded
```

## Environment Files Priority

Vite loads environment variables in this order:
1. `.env.local` (always ignored by git)
2. `.env.[mode].local`
3. `.env.[mode]`
4. `.env`

## Migration Guide

If you're migrating from a Node.js backend approach:

### 1. Identify Variables
- Separate client-safe vs server-only variables
- Add `VITE_` prefix to client-safe variables

### 2. Update Code
```typescript
// Old Node.js approach
const uri = process.env.MONGODB_URI;

// New Vite approach
const uri = import.meta.env.VITE_MONGODB_URI;
```

### 3. Update Configuration
- Move client variables to `VITE_` prefixed versions
- Keep server variables without prefix for scripts/backend

This setup ensures proper environment variable handling in both development and production environments while maintaining security best practices.