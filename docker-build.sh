#!/bin/bash

# Build the Docker image
echo "Building Docker image..."
docker build -t eesita-portfolio .

# Test the container locally
echo "Testing container locally..."
docker run -d --name eesita-portfolio-test -p 3000:3000 \
  -e OPENAI_API_KEY="your-openai-key" \
  -e PINECONE_API_KEY="your-pinecone-key" \
  -e PINECONE_INDEX_NAME="your-index-name" \
  eesita-portfolio

echo "Container started. You can test it at http://localhost:3000"
echo "To stop the container: docker stop eesita-portfolio-test && docker rm eesita-portfolio-test" 