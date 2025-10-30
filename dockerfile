# Step 1: Build the React + Vite application
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Vite application for production
# This creates optimized static files in the docs/ directory (configured for GitHub Pages)
RUN npm run build

# Step 2: Create production image with Node.js for Express server
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the built frontend from build stage
# Note: Vite builds to 'docs' directory (configured for GitHub Pages)
COPY --from=build /app/docs ./docs

# Copy server file
COPY server.js ./

# Copy source files (needed for database modules and TypeScript files)
COPY src ./src

# Copy TypeScript configuration files
COPY tsconfig*.json ./

# Copy any other necessary files (env, etc.)
COPY .env* ./

# Expose the port that the Express server will run on
# Default is 3001 as per server.js, but can be overridden with PORT env var
EXPOSE 3000

# Health check to ensure the server is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the Express server with tsx to handle TypeScript files
CMD ["npx", "tsx", "server.js"]
