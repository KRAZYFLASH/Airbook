@echo off
REM setup-database.bat
REM Script untuk setup database PostgreSQL dengan Docker di Windows

echo 🚀 Setting up airbook Database...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Create .env file from example if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ✅ .env file created. Please update it with your configuration.
)

REM Start PostgreSQL container
echo 🐘 Starting PostgreSQL container...
docker-compose up -d postgres

REM Wait for PostgreSQL to be ready
echo ⏳ Waiting for PostgreSQL to be ready...
:wait_loop
docker-compose exec postgres pg_isready -U airbook_user -d airbook_db >nul 2>&1
if %errorlevel% neq 0 (
    echo PostgreSQL is unavailable - sleeping
    timeout /t 2 /nobreak >nul
    goto wait_loop
)

echo ✅ PostgreSQL is ready!

REM Check if Prisma is available
where npx >nul 2>&1
if %errorlevel% equ 0 (
    if exist "prisma\schema.prisma" (
        echo 🔄 Running Prisma migrations...
        npx prisma migrate dev --name init
        echo ✅ Database schema created!
        
        echo 🌱 Generating Prisma client...
        npx prisma generate
        echo ✅ Prisma client generated!
    ) else (
        echo ⚠️  Prisma schema not found. Please create prisma/schema.prisma first.
    )
) else (
    echo ⚠️  Prisma not found. Please install Prisma and create schema.prisma first.
    echo    Run: npm install prisma @prisma/client
    echo    Then: npx prisma init
)

echo 🎉 Database setup complete!
echo.
echo 📋 Next steps:
echo    1. Update your .env file with the correct DATABASE_URL
echo    2. Create your Prisma schema in prisma/schema.prisma
echo    3. Run 'npx prisma migrate dev' to create tables
echo    4. Access PgAdmin at http://localhost:8080 (admin@airbook.local / admin123)
echo.
echo 🔧 Useful commands:
echo    - Start services: docker-compose up -d
echo    - Stop services: docker-compose down
echo    - View logs: docker-compose logs postgres
echo    - Access PostgreSQL CLI: docker-compose exec postgres psql -U airbook_user -d airbook_db

pause