# airbook Docker Setup

## Overview

Setup Docker untuk PostgreSQL database yang digunakan oleh aplikasi airbook.

## Prerequisites

- Docker dan Docker Compose terinstall
- Node.js dan npm (untuk Prisma)

## Quick Start

1. **Clone dan masuk ke direktori project**

   ```bash
   cd airbook
   ```

2. **Setup environment**

   ```bash
   # Windows
   scripts\setup-database.bat

   # Linux/Mac
   chmod +x scripts/setup-database.sh
   ./scripts/setup-database.sh
   ```

3. **Install dependencies (jika belum)**

   ```bash
   npm install prisma @prisma/client
   ```

4. **Run database migration**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

## Manual Setup

### 1. Start PostgreSQL

```bash
docker-compose up -d postgres
```

### 2. Configure Environment

Copy `.env.example` to `.env` dan sesuaikan konfigurasi:

```env
DATABASE_URL="postgresql://airbook_user:airbook_password@localhost:5432/airbook_db"
```

### 3. Initialize Database

```bash
npx prisma migrate dev
npx prisma generate
```

## Services

### PostgreSQL Database

- **Host**: localhost
- **Port**: 5432
- **Database**: airbook_db
- **Username**: airbook_user
- **Password**: airbook_password
- **Connection URL**: `postgresql://airbook_user:airbook_password@localhost:5432/airbook_db`

### PgAdmin (Database Management)

- **URL**: http://localhost:8080
- **Email**: admin@airbook.local
- **Password**: admin123

## Docker Commands

```bash
# Start all services
docker-compose up -d

# Start only PostgreSQL
docker-compose up -d postgres

# Stop all services
docker-compose down

# View logs
docker-compose logs postgres

# Access PostgreSQL CLI
docker-compose exec postgres psql -U airbook_user -d airbook_db

# Remove all data (be careful!)
docker-compose down -v
```

## Prisma Commands

```bash
# Create migration
npx prisma migrate dev --name migration_name

# Generate client
npx prisma generate

# Reset database
npx prisma migrate reset

# View database in browser
npx prisma studio

# Deploy migrations (production)
npx prisma migrate deploy
```

## Database Schema

Model User dengan fields:

- `id`: Auto-increment integer primary key
- `name`: String (required)
- `email`: String (unique, required)
- `passwordHash`: String (required)
- `phone`: String (optional)
- `roles`: Array of strings (default: ["user"])
- `isVerified`: Boolean (default: false)
- `lastLoginAt`: DateTime (optional)
- `createdAt`: DateTime (auto-generated)
- `updatedAt`: DateTime (auto-updated)

## Troubleshooting

### Port 5432 sudah digunakan

```bash
# Cek process yang menggunakan port 5432
netstat -ano | findstr :5432

# Stop PostgreSQL service jika ada
net stop postgresql-x64-13
```

### Connection refused

```bash
# Pastikan container berjalan
docker ps

# Restart container
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Prisma connection error

1. Pastikan DATABASE_URL benar di file `.env`
2. Pastikan PostgreSQL container sudah running
3. Test connection:
   ```bash
   npx prisma db pull
   ```

## Production Deployment

Untuk production, update `docker-compose.yml`:

1. Ganti password default
2. Disable PgAdmin service
3. Add volume backup strategy
4. Configure proper networking
5. Use environment-specific variables

## Backup & Restore

### Backup

```bash
docker-compose exec postgres pg_dump -U airbook_user airbook_db > backup.sql
```

### Restore

```bash
docker-compose exec -T postgres psql -U airbook_user airbook_db < backup.sql
```
