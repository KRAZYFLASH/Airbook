#!/bin/bash

# setup-database.sh
# Script untuk setup database PostgreSQL dengan Docker

echo "🚀 Setting up airbook Database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Start PostgreSQL container
echo "🐘 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker-compose exec postgres pg_isready -U airbook_user -d airbook_db; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run Prisma migrations (if Prisma is installed)
if command -v npx > /dev/null && [ -f "prisma/schema.prisma" ]; then
    echo "🔄 Running Prisma migrations..."
    npx prisma migrate dev --name init
    echo "✅ Database schema created!"
    
    echo "🌱 Generating Prisma client..."
    npx prisma generate
    echo "✅ Prisma client generated!"
else
    echo "⚠️  Prisma not found. Please install Prisma and create schema.prisma first."
    echo "   Run: npm install prisma @prisma/client"
    echo "   Then: npx prisma init"
fi

echo "🎉 Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Update your .env file with the correct DATABASE_URL"
echo "   2. Create your Prisma schema in prisma/schema.prisma"
echo "   3. Run 'npx prisma migrate dev' to create tables"
echo "   4. Access PgAdmin at http://localhost:8080 (admin@airbook.local / admin123)"
echo ""
echo "🔧 Useful commands:"
echo "   - Start services: docker-compose up -d"
echo "   - Stop services: docker-compose down"
echo "   - View logs: docker-compose logs postgres"
echo "   - Access PostgreSQL CLI: docker-compose exec postgres psql -U airbook_user -d airbook_db"