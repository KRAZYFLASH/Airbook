#!/bin/bash

echo "🌱 AirBook Modular Database Seeding"
echo "====================================="
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the backend directory."
    echo "   Expected location: backend/"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error installing dependencies"
    exit 1
fi

echo ""
echo "🔧 Generating Prisma client..."
npm run db:generate
if [ $? -ne 0 ]; then
    echo "❌ Error generating Prisma client"
    exit 1
fi

echo ""
echo "📤 Pushing database schema..."
npm run db:push
if [ $? -ne 0 ]; then
    echo "❌ Error pushing database schema"
    exit 1
fi

echo ""
echo "🌱 Running modular seeding..."
npm run db:seed-modular
if [ $? -ne 0 ]; then
    echo "❌ Error during modular seeding"
    exit 1
fi

echo ""
echo "✅ Modular database seeding completed successfully!"
echo ""
echo "🎯 Available individual seed commands:"
echo "   npm run db:seed-countries   - Seed countries only"
echo "   npm run db:seed-cities      - Seed cities only"
echo "   npm run db:seed-airports    - Seed airports only"
echo "   npm run db:seed-airlines    - Seed airlines only"
echo "   npm run db:seed-flights     - Seed flight schedules only"
echo "   npm run db:seed-promotions  - Seed promotions only"
echo ""
echo "🔍 To view seeded data:"
echo "   npm run db:studio"
echo ""