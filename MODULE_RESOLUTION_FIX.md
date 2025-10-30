# Module Resolution Error Fix

## Problem Summary

The application was failing on the server with the following error:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/app/src/lib/database' imported from /app/server.js
```

## Root Causes Identified

1. **Missing File Extension**: The import statement in `server.js` was missing the `.js` extension
   - Import: `import { db } from './src/lib/database';`
   - Node.js ES modules require explicit file extensions

2. **TypeScript Files Not Deployed**: The Dockerfile was not copying the `src/` directory
   - Only `server.js` and `dist/` folder were being copied
   - The database module (`src/lib/database.ts`) was missing on the server

3. **No TypeScript Runtime**: The server was running with `node` instead of `tsx`
   - TypeScript files cannot be executed directly by Node.js
   - Required a TypeScript runtime like `tsx` to handle `.ts` files

4. **Missing Production Dependency**: `tsx` was only in `devDependencies`
   - Production server needs `tsx` to run TypeScript files
   - Docker's `--only=production` flag excluded it

## Changes Made

### 1. Updated `server.js` (Line 4)
**Before:**
```javascript
import { db } from './src/lib/database';
```

**After:**
```javascript
import { db } from './src/lib/database.js';
```

**Reason**: Node.js ES modules require explicit file extensions. When using TypeScript with tsx, the `.js` extension is used even for `.ts` files (TypeScript convention).

### 2. Updated `dockerfile` (Lines 38-42)
**Before:**
```dockerfile
# Copy server file
COPY server.js ./

# Copy any other necessary files (env, etc.)
COPY .env* ./
```

**After:**
```dockerfile
# Copy server file
COPY server.js ./

# Copy source files (needed for database modules and TypeScript files)
COPY src ./src

# Copy TypeScript configuration files
COPY tsconfig*.json ./

# Copy any other necessary files (env, etc.)
COPY .env* ./
```

**Reason**: The `src/` directory contains all the TypeScript modules that the server needs to import, including the database module.

### 3. Updated `dockerfile` (Line 56)
**Before:**
```dockerfile
CMD ["node", "server.js"]
```

**After:**
```dockerfile
CMD ["npx", "tsx", "server.js"]
```

**Reason**: Use `tsx` to handle TypeScript files at runtime instead of plain Node.js.

### 4. Updated `package.json`
**Moved `tsx` from `devDependencies` to `dependencies`:**

**Before:**
```json
"devDependencies": {
  ...
  "tsx": "^4.20.5",
  ...
}
```

**After:**
```json
"dependencies": {
  ...
  "tsx": "^4.20.5",
  ...
}
```

**Reason**: The production server needs `tsx` to run TypeScript files. Docker's `npm ci --only=production` only installs dependencies, not devDependencies.

## Verification

### Local Testing
Tested the server locally with the new configuration:

```bash
# This fails (as expected):
node server.js
# Error: Cannot find module '/path/to/src/lib/database.js'

# This works:
npx tsx server.js
# ✅ Server starts successfully
```

### Expected Server Behavior
After deploying with these changes, the server should:
1. ✅ Find the database module at `/app/src/lib/database.ts`
2. ✅ Execute TypeScript files using tsx runtime
3. ✅ Start successfully on port 3001
4. ✅ Respond to health checks at `/health`

## Deployment Instructions

1. **Commit the changes:**
   ```bash
   git add server.js dockerfile package.json package-lock.json
   git commit -m "Fix module resolution error for server deployment"
   ```

2. **Rebuild the Docker image:**
   ```bash
   docker build -t your-app-name .
   ```

3. **Deploy to server:**
   - Push the changes to your repository
   - Rebuild the Docker container on the server
   - The server should now start without module resolution errors

## Files Modified

- ✅ `server.js` - Added `.js` extension to database import
- ✅ `dockerfile` - Added src directory and tsconfig files to production image
- ✅ `dockerfile` - Changed CMD to use tsx instead of node
- ✅ `package.json` - Moved tsx from devDependencies to dependencies

## Additional Notes

### Why `.js` extension for `.ts` files?
This is a TypeScript convention when using ES modules. TypeScript's module resolution allows importing `.ts` files using `.js` extensions, and tools like `tsx` handle this automatically.

### Alternative Solutions Considered

1. **Compile TypeScript to JavaScript**: 
   - Could use `tsc` to compile all TypeScript files to JavaScript
   - Would require additional build step and configuration
   - Current solution is simpler for this use case

2. **Use ts-node instead of tsx**:
   - `tsx` is faster and more modern
   - Better ES modules support
   - Recommended for production use

### Environment Differences

**Local Development:**
- Uses `tsx server.js` via npm script
- Has access to all source files
- Works correctly ✅

**Server/Docker:**
- Previously: Used `node server.js` (failed ❌)
- Now: Uses `npx tsx server.js` (works ✅)
- Has access to src directory and TypeScript files

## Testing Checklist

Before deploying to production, verify:
- [ ] Server starts without errors
- [ ] Health check endpoint responds: `GET /health`
- [ ] Recipe API endpoints work: `GET /api/recipes`
- [ ] Database connection is established
- [ ] All TypeScript modules are resolved correctly
- [ ] Environment variables are loaded from .env file

## Troubleshooting

If you still encounter module resolution errors:

1. **Check file exists in container:**
   ```bash
   docker exec -it <container-id> ls -la /app/src/lib/
   ```

2. **Verify tsx is installed:**
   ```bash
   docker exec -it <container-id> npm list tsx
   ```

3. **Check Node.js version:**
   ```bash
   docker exec -it <container-id> node --version
   ```
   Should be v18.20.8 or compatible

4. **View server logs:**
   ```bash
   docker logs <container-id>
   ```

## Summary

The module resolution error was caused by a combination of missing file extensions, missing source files in the Docker image, and using the wrong runtime (node vs tsx). All issues have been resolved by:
1. Adding `.js` extension to imports
2. Copying the `src/` directory to the Docker image
3. Using `tsx` runtime instead of plain Node.js
4. Moving `tsx` to production dependencies

The server should now deploy and run successfully on the server environment.

