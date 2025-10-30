#!/bin/bash

# Recipe API Docker Deployment Script
# This script automates the deployment of the Recipe API application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="leela383/ui.3"
IMAGE_TAG="latest"
CONTAINER_NAME="app"
PORT=3000

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Recipe API Docker Deployment${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_step() {
    echo -e "${BLUE}🔹 $1${NC}"
}

# Step 1: Stop and remove old container
print_step "Step 1: Stopping and removing old container..."
if docker ps -a | grep -q $CONTAINER_NAME; then
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    print_success "Old container removed"
else
    print_info "No existing container found"
fi
echo ""

# Step 2: Build new image
print_step "Step 2: Building Docker image..."
if docker build -t $IMAGE_NAME:$IMAGE_TAG .; then
    print_success "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi
echo ""

# Step 3: Push to registry (optional, comment out if not needed)
print_step "Step 3: Pushing image to Docker Hub..."
read -p "Do you want to push to Docker Hub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if docker push $IMAGE_NAME:$IMAGE_TAG; then
        print_success "Image pushed to Docker Hub"
    else
        print_error "Failed to push image"
        exit 1
    fi
else
    print_info "Skipping Docker Hub push"
fi
echo ""

# Step 4: Run new container
print_step "Step 4: Starting new container..."
if docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:$PORT \
    --restart unless-stopped \
    $IMAGE_NAME:$IMAGE_TAG; then
    print_success "Container started successfully"
else
    print_error "Failed to start container"
    exit 1
fi
echo ""

# Step 5: Wait for container to be ready
print_step "Step 5: Waiting for container to be ready..."
sleep 5

# Step 6: Check container status
print_step "Step 6: Checking container status..."
if docker ps | grep -q $CONTAINER_NAME; then
    print_success "Container is running"
    
    # Show container info
    echo ""
    echo -e "${BLUE}Container Information:${NC}"
    docker ps | grep $CONTAINER_NAME
else
    print_error "Container is not running"
    echo ""
    echo -e "${RED}Container logs:${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi
echo ""

# Step 7: Check logs
print_step "Step 7: Checking container logs..."
echo -e "${BLUE}Recent logs:${NC}"
docker logs --tail 20 $CONTAINER_NAME
echo ""

# Step 8: Test health endpoint
print_step "Step 8: Testing health endpoint..."
sleep 2
if curl -s http://localhost:$PORT/health > /dev/null; then
    print_success "Health check passed"
    echo ""
    echo -e "${GREEN}Response:${NC}"
    curl -s http://localhost:$PORT/health | jq '.' 2>/dev/null || curl -s http://localhost:$PORT/health
else
    print_error "Health check failed"
    echo ""
    echo -e "${RED}Container logs:${NC}"
    docker logs $CONTAINER_NAME
    exit 1
fi
echo ""

# Step 9: Display access information
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Deployment Successful!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}Access Information:${NC}"
echo -e "  Local:    http://localhost:$PORT"
echo -e "  Health:   http://localhost:$PORT/health"
echo -e "  API:      http://localhost:$PORT/api/recipes"
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "<YOUR_SERVER_IP>")
echo -e "${BLUE}External Access:${NC}"
echo -e "  Health:   http://$SERVER_IP:$PORT/health"
echo -e "  API:      http://$SERVER_IP:$PORT/api/recipes"
echo ""

echo -e "${BLUE}Useful Commands:${NC}"
echo -e "  View logs:      docker logs -f $CONTAINER_NAME"
echo -e "  Stop:           docker stop $CONTAINER_NAME"
echo -e "  Start:          docker start $CONTAINER_NAME"
echo -e "  Restart:        docker restart $CONTAINER_NAME"
echo -e "  Shell access:   docker exec -it $CONTAINER_NAME sh"
echo ""

# Step 10: Check firewall (optional)
print_step "Step 10: Checking firewall configuration..."
if command -v ufw &> /dev/null; then
    if sudo ufw status | grep -q "Status: active"; then
        if sudo ufw status | grep -q "$PORT"; then
            print_success "UFW firewall allows port $PORT"
        else
            print_error "UFW firewall may be blocking port $PORT"
            echo ""
            read -p "Do you want to allow port $PORT in UFW? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                sudo ufw allow $PORT/tcp
                sudo ufw reload
                print_success "Port $PORT allowed in UFW"
            fi
        fi
    else
        print_info "UFW firewall is not active"
    fi
elif command -v firewall-cmd &> /dev/null; then
    if sudo firewall-cmd --state 2>/dev/null | grep -q "running"; then
        if sudo firewall-cmd --list-ports | grep -q "$PORT"; then
            print_success "Firewalld allows port $PORT"
        else
            print_error "Firewalld may be blocking port $PORT"
            echo ""
            read -p "Do you want to allow port $PORT in firewalld? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                sudo firewall-cmd --permanent --add-port=$PORT/tcp
                sudo firewall-cmd --reload
                print_success "Port $PORT allowed in firewalld"
            fi
        fi
    else
        print_info "Firewalld is not running"
    fi
else
    print_info "No firewall detected (UFW or firewalld)"
fi
echo ""

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""

