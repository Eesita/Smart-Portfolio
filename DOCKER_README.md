# Docker Setup for Eesita's Portfolio

This document explains how to containerize and deploy Eesita's AI-powered portfolio application.

## 🐳 Docker Configuration

### Files Created:
- `Dockerfile` - Container configuration
- `.dockerignore` - Excludes unnecessary files from build
- `docker-build.sh` - Local testing script

### Key Features:
- **Node.js 22 Alpine** - Lightweight base image
- **Security** - Non-root user execution
- **Health Check** - Automatic health monitoring
- **Production Ready** - Optimized for AWS ECS Fargate

## 🚀 Local Testing

### Prerequisites:
- Docker installed on your machine
- Environment variables configured

### Test Locally:
```bash
# Make script executable
chmod +x docker-build.sh

# Build and test
./docker-build.sh
```

### Manual Testing:
```bash
# Build image
docker build -t eesita-portfolio .

# Run container
docker run -d --name eesita-portfolio-test -p 3000:3000 \
  -e OPENAI_API_KEY="your-key" \
  -e PINECONE_API_KEY="your-key" \
  -e PINECONE_INDEX_NAME="your-index" \
  eesita-portfolio

# Test at http://localhost:3000
# Stop container
docker stop eesita-portfolio-test && docker rm eesita-portfolio-test
```

## 🔧 Environment Variables

The application requires these environment variables:

```bash
OPENAI_API_KEY=your-openai-api-key
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_INDEX_NAME=your-pinecone-index-name
PORT=3000  # Optional, defaults to 3000
```

## 📦 Container Details

- **Base Image**: `node:22-alpine`
- **Working Directory**: `/app`
- **Port**: 3000
- **User**: `nodejs` (non-root for security)
- **Health Check**: HTTP GET to `/` every 30s

## 🔍 Health Check

The container includes a health check that:
- Runs every 30 seconds
- Times out after 3 seconds
- Starts checking after 5 seconds
- Retries 3 times before marking unhealthy

## 🚀 Next Steps for AWS ECS

1. **Push to ECR** - Upload image to Amazon ECR
2. **Create ECS Cluster** - Set up Fargate cluster
3. **Create Task Definition** - Define container specifications
4. **Create Service** - Deploy with load balancer
5. **Configure Domain** - Point eesita.com to the service

## 📝 Notes

- The application uses ES modules (`"type": "module"`)
- Static files are served from the `public/` directory
- The chatbot API endpoint is at `/chat`
- Resume PDF should be in `public/assets/resume.pdf` 