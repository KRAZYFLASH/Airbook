@echo off
REM AirBook Database Seeding Script for Windows
REM This script will seed your database with comprehensive sample data

echo 🌱 AirBook Database Seeding
echo ==========================
echo.

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Please run this script from the backend directory
    exit /b 1
)

if not exist "prisma" (
    echo ❌ Prisma directory not found. Please run from backend directory
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🔄 Step 1: Generating Prisma Client...
npm run db:generate

echo 🔄 Step 2: Pushing database schema...
npm run db:push

echo 🔄 Step 3: Seeding comprehensive sample data...
npm run db:seed-comprehensive

echo.
echo ✅ Database seeding completed successfully!
echo.
echo 📊 Your database now contains:
echo    • 8 Countries (Indonesia, Singapore, Malaysia, Thailand, etc.)
echo    • 11 Cities (Jakarta, Singapore, Bangkok, Tokyo, etc.)
echo    • 11 Airports (CGK, SIN, DPS, BKK, NRT, etc.)
echo    • 8 Airlines (Garuda, Lion Air, Singapore Airlines, etc.)
echo    • 8 Flight Schedules (various routes with different statuses)
echo    • 6 Promotions (active and expired campaigns)
echo.
echo 🚀 Your AirBook admin system is ready!
echo 💡 You can now start the server with: npm run dev

pause