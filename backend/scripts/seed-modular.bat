@echo off
echo 🌱 AirBook Modular Database Seeding
echo =====================================
echo.

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the backend directory.
    echo    Expected location: backend/
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Error installing dependencies
    pause
    exit /b 1
)

echo.
echo 🔧 Generating Prisma client...
call npm run db:generate
if %errorlevel% neq 0 (
    echo ❌ Error generating Prisma client
    pause
    exit /b 1
)

echo.
echo 📤 Pushing database schema...
call npm run db:push
if %errorlevel% neq 0 (
    echo ❌ Error pushing database schema
    pause
    exit /b 1
)

echo.
echo 🌱 Running modular seeding...
call npm run db:seed-modular
if %errorlevel% neq 0 (
    echo ❌ Error during modular seeding
    pause
    exit /b 1
)

echo.
echo ✅ Modular database seeding completed successfully!
echo.
echo 🎯 Available individual seed commands:
echo    npm run db:seed-countries   - Seed countries only
echo    npm run db:seed-cities      - Seed cities only  
echo    npm run db:seed-airports    - Seed airports only
echo    npm run db:seed-airlines    - Seed airlines only
echo    npm run db:seed-flights     - Seed flight schedules only
echo    npm run db:seed-promotions  - Seed promotions only
echo.
echo 🔍 To view seeded data:
echo    npm run db:studio
echo.
pause