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
# This creates optimized static files in the dist/ directory
RUN npm run build

# Step 2: Serve static files with nginx
FROM nginx:alpine

# Copy the built frontend from build stage to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Create custom nginx configuration for React Router (SPA)
# This ensures proper routing and serves index.html for all routes
RUN echo 'server { \
    listen 3000; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    # Enable gzip compression for better performance \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml; \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
}' > /etc/nginx/conf.d/default.conf

# Expose port 3000 for HTTP traffic
EXPOSE 3000

# Health check to ensure nginx is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
