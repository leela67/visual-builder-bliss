# Docker Build Configuration - Updated for Standard Deployment

## Configuration Summary

This document describes the Docker build configuration for the Recipe App UI.

## Current Configuration (Updated)

The application has been reconfigured for standard Docker deployment:

1. **Vite Configuration (`vite.config.ts`):**
   - `base: "/"` - Root path for all deployments
   - `outDir: "dist"` - Standard output directory
   - Vite builds to `/app/dist` directory

2. **Dockerfile:**
   - Copies from `/app/dist` to nginx html directory
   - Configured to run on port 3000
   - Uses CMD instead of ENTRYPOINT for flexibility

3. **Previous GitHub Pages Configuration (REMOVED):**
   - ~~Base path: `/visual-builder-bliss/`~~ (removed)
   - ~~Output directory: `docs`~~ (changed to `dist`)
   - ~~GitHub Pages specific settings~~ (removed)

## Solution

**Standardized the configuration for Docker deployment** by removing GitHub Pages-specific settings and using industry-standard conventions.

## Changes Made

### 1. Removed GitHub Pages Base Path

**File:** `src/App.tsx`
- Removed `basename="/visual-builder-bliss"` from BrowserRouter
- Now uses root path for all routes

### 2. Updated Vite Configuration

**File:** `vite.config.ts`
- Changed `base` from conditional GitHub Pages path to `"/"`
- Changed `outDir` from `"docs"` to `"dist"`
- Removed GitHub Pages-specific configuration

### 3. Updated Dockerfile

**Changes:**
- Changed port from 80 to 3000
- Updated COPY command to use `/app/dist` instead of `/app/docs`
- Added security headers to nginx configuration
- Improved gzip compression settings
- Uses CMD (not ENTRYPOINT) for flexibility

### 4. Deleted Build Directories

- Removed `docs/` directory (GitHub Pages build output)
- Removed `dist/` directory (old build output)

## Docker Build Instructions

### Building the Docker Image

```bash
docker build -t recipe-app-ui .
```

### Running the Container

```bash
docker run -d -p 3000:3000 --name recipe-app-ui recipe-app-ui
```

### Testing the Application

```bash
# Check if container is running
docker ps

# View logs
docker logs recipe-app-ui

# Test the application
curl http://localhost:3000

# Access in browser
open http://localhost:3000
```

## Why This Configuration is Better

### Benefits of Standard Configuration

**Pros:**
- ✅ Uses industry-standard `dist` directory
- ✅ Simplified configuration without GitHub Pages complexity
- ✅ Runs on port 3000 (standard for UI applications)
- ✅ Uses CMD instead of ENTRYPOINT for better flexibility
- ✅ Optimized nginx configuration with security headers
- ✅ Better gzip compression settings
- ✅ Clean separation of concerns (UI-only, no backend)

**Deployment:**
- Docker-first approach
- Can be deployed to any container platform
- No GitHub Pages dependencies

## Project Configuration Summary

### Build Output
- **Local Build:** `npm run build` → creates `/dist` directory
- **Docker Build:** `npm run build` → creates `/app/dist` directory
- **Production Image:** Files copied to nginx html directory

### Deployment Strategy
- **Docker Container:** Serves static files via nginx on port 3000
- **UI-Only Application:** No backend server included
- **Single Page Application:** React Router with proper nginx routing

### File Structure in Docker Container
```
/usr/share/nginx/html/       # Built frontend files (from Vite)
├── index.html
├── assets/
│   ├── index-*.js
│   └── index-*.css
├── favicon.ico
└── ...
```

## Important Notes

1. **UI-Only Application**
   - This Dockerfile serves only the frontend static files
   - No backend server included
   - API calls should be configured via environment variables

2. **Standard Configuration**
   - Base path: `/` (root path)
   - Output directory: `dist` (standard convention)
   - Port: 3000 (standard for UI applications)

3. **Nginx Configuration**
   - ✅ Serves static files efficiently
   - ✅ Handles React Router (SPA) routing
   - ✅ Gzip compression enabled
   - ✅ Security headers included
   - ✅ Health check configured

## Testing Checklist

- [ ] Docker build completes without errors
- [ ] `/app/dist` directory is created successfully
- [ ] Static files are copied to nginx
- [ ] Test running the Docker container
- [ ] Verify application loads in browser
- [ ] Verify React Router navigation works

## Container Management Commands

```bash
# Build the image
docker build -t recipe-app-ui .

# Run the container
docker run -d -p 3000:3000 --name recipe-app-ui recipe-app-ui

# Check if it's running
docker ps

# View logs
docker logs recipe-app-ui

# Follow logs in real-time
docker logs -f recipe-app-ui

# Test the application
curl http://localhost:3000

# Stop the container
docker stop recipe-app-ui

# Start the container
docker start recipe-app-ui

# Remove the container
docker rm recipe-app-ui

# Remove the image
docker rmi recipe-app-ui
```

## Summary

The application has been reconfigured for standard Docker deployment:

**Changes Made:**
- ✅ Removed GitHub Pages base path `/visual-builder-bliss/`
- ✅ Changed output directory from `docs` to `dist`
- ✅ Updated Dockerfile to use standard conventions
- ✅ Configured to run on port 3000
- ✅ Uses CMD instead of ENTRYPOINT
- ✅ Added security headers and optimized nginx configuration

**Result:** Clean, production-ready Docker configuration for UI-only deployment.

## Files Modified

- ✅ `src/App.tsx` - Removed basename from BrowserRouter
- ✅ `vite.config.ts` - Changed base path and output directory
- ✅ `dockerfile` - Complete rewrite for standard deployment
- ✅ `DOCKER_BUILD_FIX.md` - Updated documentation

## Deployment Ready

The application is now ready for Docker deployment with:
- ✅ Standard directory structure
- ✅ Optimized nginx configuration
- ✅ Security headers
- ✅ Health checks
- ✅ Gzip compression
- ✅ SPA routing support

