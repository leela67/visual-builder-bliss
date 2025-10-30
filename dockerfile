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

# Step 2: Serve static files with nginx
FROM nginx:alpine

# Copy the built frontend from build stage to nginx html directory
# Note: Vite builds to 'docs' directory (configured for GitHub Pages)
COPY --from=build /app/docs /usr/share/nginx/html

# Copy custom nginx configuration if needed
# This ensures proper routing for React Router (SPA)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    # Enable gzip compression \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP traffic
EXPOSE 80

# Health check to ensure nginx is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
