#!/bin/bash

echo "🚀 Setting up Sinamoa Chemicals Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB or use Docker Compose."
    echo "   You can start MongoDB with: sudo systemctl start mongod"
    echo "   Or use Docker: docker-compose up mongodb -d"
fi

# Copy environment files
echo "📝 Setting up environment files..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo "✅ Created frontend/.env file"
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Set up database
echo "🗃️  Setting up database..."
node database/seed.js

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🔐 Login Credentials:"
echo "   Admin: admin@sinamoa.com / Admin123!@#"
echo "   Manager: manager@sinamoa.com / Manager123!@#"
echo "   Employee: employee@sinamoa.com / Employee123!@#"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev (starts both backend and frontend)"
echo "   OR"
echo "   npm run backend:dev (backend only)"
echo "   npm run frontend:dev (frontend only)"
echo ""
echo "🐳 To use Docker:"
echo "   docker-compose up"
echo ""