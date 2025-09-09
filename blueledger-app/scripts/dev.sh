#!/bin/bash

echo "🚀 Starting Sinamoa Chemicals Development Environment..."

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "backend/node_modules" ] || [ ! -d "frontend/node_modules" ]; then
    echo "⚠️  Dependencies not found. Running setup first..."
    ./scripts/setup.sh
fi

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
fi

if [ ! -f "frontend/.env" ]; then
    echo "⚠️  frontend/.env file not found. Copying from frontend/.env.example..."
    cp frontend/.env.example frontend/.env
fi

echo "🎯 Starting both backend and frontend in development mode..."
npm run dev