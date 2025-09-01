# Browser Compatibility Fixes

This document details the browser compatibility issues encountered and their resolutions.

## Issues Encountered

### 1. `process is not defined` Error
**Error:**
```
mongodb.ts:3 Uncaught ReferenceError: process is not defined
```

**Cause:** Node.js `process.env` object doesn't exist in browser environment

### 2. `global is not defined` Error  
**Error:**
```
mongodb.ts:30 Uncaught ReferenceError: global is not defined
```

**Cause:** Node.js `global` object doesn't exist in browser environment

### 3. Missing Favicon
**Error:**
```
favicon.ico:1 Failed to load resource: the server responded with a status of 404 (Not Found)
```

**Cause:** No favicon link in HTML head

## Solutions Implemented

### 1. Cross-Environment Variable Access
**File:** `src/lib/mongodb.ts`

**Before:**
```typescript
const MONGODB_URI = process.env.MONGODB_URI || 'fallback';
```

**After:**
```typescript
const MONGODB_URI = (() => {
  // Browser environment (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_MONGODB_URI || 'fallback';
  }
  // Node.js environment (scripts)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.MONGODB_URI || 'fallback';
  }
  // Fallback
  return 'fallback';
})();
```

### 2. Cross-Platform Global Object Access
**File:** `src/lib/mongodb.ts`

**Before:**
```typescript
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}
```

**After:**
```typescript
// Cross-platform global object access
const globalForMongoose = (() => {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof window !== 'undefined') return window as any;
  if (typeof global !== 'undefined') return global;
  throw new Error('Unable to locate global object');
})();

let cached: MongooseCache = globalForMongoose.mongoose || { conn: null, promise: null };

if (!globalForMongoose.mongoose) {
  globalForMongoose.mongoose = cached;
}
```

### 3. Favicon Configuration
**File:** `index.html`

**Added:**
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
```

## Environment Variable Configuration

### Browser Environment
Uses Vite's environment variable system with `VITE_` prefix:

**`.env`:**
```bash
VITE_MONGODB_URI=mongodb+srv://connection-string
```

**Access in code:**
```typescript
import.meta.env.VITE_MONGODB_URI
```

### Node.js Environment  
Uses traditional process environment variables:

**`.env`:**
```bash
MONGODB_URI=mongodb+srv://connection-string
```

**Access in code:**
```typescript
process.env.MONGODB_URI
```

## Platform Detection Strategy

### Environment Variables
```typescript
const getEnvironmentVariable = (browserVar: string, nodeVar: string, fallback: string) => {
  // Browser environment (Vite)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[browserVar] || fallback;
  }
  // Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[nodeVar] || fallback;
  }
  // Fallback
  return fallback;
};
```

### Global Object
```typescript
const getGlobalObject = () => {
  if (typeof globalThis !== 'undefined') return globalThis;  // Modern standard
  if (typeof window !== 'undefined') return window;          // Browser
  if (typeof global !== 'undefined') return global;          // Node.js
  throw new Error('Unable to locate global object');
};
```

## Cross-Platform Compatibility Matrix

| Environment | Variable Access | Global Object | Status |
|-------------|----------------|---------------|--------|
| **Browser (Development)** | `import.meta.env.VITE_*` | `window` | ✅ Working |
| **Browser (Production)** | `import.meta.env.VITE_*` | `window` | ✅ Working |
| **Node.js Scripts** | `process.env.*` | `global` | ✅ Working |
| **Server-Side Rendering** | `process.env.*` | `global` | ✅ Working |

## Testing Results

### ✅ API Functionality
- Recipe creation: Working
- Database connectivity: Working  
- View tracking: Working
- Featured recipes: Working

### ✅ Environment Detection
- Browser environment: Detected correctly
- Node.js environment: Detected correctly
- Fallbacks: Working properly

### ✅ Development Experience
- Hot reload: Working
- Error handling: Improved
- No browser console errors

## Best Practices Applied

### 1. Feature Detection Over User Agent Sniffing
```typescript
// Good: Feature detection
if (typeof import.meta !== 'undefined' && import.meta.env) {
  // Browser environment
}

// Avoid: User agent sniffing
if (navigator.userAgent.includes('Chrome')) {
  // Brittle approach
}
```

### 2. Graceful Degradation
```typescript
// Provide fallbacks at every level
const config = getValue() || getDefaultValue() || 'hardcoded-fallback';
```

### 3. Environment Isolation
```typescript
// Separate concerns by environment
const browserConfig = getBrowserConfig();
const serverConfig = getServerConfig();
```

## Future Considerations

### 1. TypeScript Support
Consider adding type definitions for environment variables:

```typescript
// env.d.ts
interface ImportMetaEnv {
  readonly VITE_MONGODB_URI: string;
  readonly VITE_API_URL: string;
}
```

### 2. Configuration Management
For larger applications, consider using a configuration management library that handles cross-platform concerns automatically.

### 3. Build-Time Optimization
Environment detection could be optimized at build time to remove unused code paths.

## Error Prevention

### 1. Development Guidelines
- Always use feature detection for environment-specific code
- Test in both browser and Node.js environments
- Provide meaningful fallbacks

### 2. Code Review Checklist
- [ ] No direct references to `process` in browser code
- [ ] No direct references to `global` in browser code  
- [ ] Environment variables properly prefixed
- [ ] Fallbacks provided for all configurations

### 3. Testing Strategy
- Unit tests for environment detection logic
- Integration tests in both environments
- Build verification in CI/CD pipeline

This comprehensive fix ensures the application works reliably across all target environments while maintaining clean, maintainable code.