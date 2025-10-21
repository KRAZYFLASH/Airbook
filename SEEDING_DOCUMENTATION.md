# 📚 AirBook Database Seeding Documentation

> **Comprehensive Guide for AirBook Database Seeding System**  
> Version: 2.0 | Date: October 2025

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [System Architecture](#system-architecture)
4. [Installation & Setup](#installation--setup)
5. [Usage Guide](#usage-guide)
6. [Data Structure](#data-structure)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [Contributing](#contributing)

---

## 🌟 Overview

AirBook Database Seeding System adalah solusi lengkap untuk mengisi database dengan data sample yang realistic untuk aplikasi airline booking. Sistem ini mendukung dua pendekatan: **Comprehensive Seeding** (monolithic) dan **Modular Seeding** (component-based).

### ✨ Key Features

- 🎯 **Dual Approach**: Comprehensive dan Modular seeding
- 🔄 **Idempotent Operations**: Aman dijalankan berulang kali
- 📊 **Realistic Data**: 52+ entries dengan data industri penerbangan yang authentic
- 🛠️ **Easy Management**: NPM scripts dan batch files
- 📱 **Cross-Platform**: Windows, Linux, dan macOS support
- 🔍 **Visual Verification**: Prisma Studio integration

### 🎯 Target Audience

- **Backend Developers**: Setting up development environment
- **QA Engineers**: Testing dengan data comprehensive
- **DevOps Teams**: Production deployment preparation
- **Project Managers**: Demo dan presentation setup

---

## 🚀 Quick Start

### Prerequisites

```bash
# Ensure you have these installed:
- Node.js (v16+)
- PostgreSQL (running)
- npm or yarn package manager
```

### 30-Second Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies (if not done)
npm install

# 3. Run comprehensive seeding
npm run db:seed-modular

# 4. Verify with Prisma Studio
npm run db:studio
```

**✅ Expected Output:**

```
🌱 Starting comprehensive database seeding...
📍 Seeding countries... ✅ 8 countries
🏙️ Seeding cities... ✅ 11 cities
✈️ Seeding airports... ✅ 11 airports
🛫 Seeding airlines... ✅ 8 airlines
🗓️ Seeding flight schedules... ✅ 8 schedules
🎯 Seeding promotions... ✅ 6 promotions
🚀 Database ready with 52 sample records!
```

---

## 🏗️ System Architecture

### Directory Structure

```
backend/
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── seed-comprehensive.ts         # Original monolithic seeding
│   └── seeds/                        # 🆕 Modular seeding system
│       ├── README.md                 # Seeding documentation
│       ├── index.ts                  # Master orchestrator
│       ├── countries.ts              # Countries data (8 entries)
│       ├── cities.ts                 # Cities data (11 entries)
│       ├── airports.ts               # Airports data (11 entries)
│       ├── airlines.ts               # Airlines data (8 entries)
│       ├── flightSchedules.ts        # Flight schedules (8 entries)
│       ├── promotions.ts             # Promotions (6 entries)
│       ├── destinations.ts           # Legacy destinations
│       └── directSQL.ts              # Direct SQL operations
├── scripts/
│   ├── seed-database.bat             # Windows comprehensive script
│   ├── seed-database.sh              # Unix comprehensive script
│   ├── seed-modular.bat              # Windows modular script
│   └── seed-modular.sh               # Unix modular script
└── package.json                      # NPM scripts configuration
```

### Component Dependencies

```mermaid
graph TD
    A[Countries] --> B[Cities]
    A --> C[Airlines]
    B --> D[Airports]
    C --> E[Flight Schedules]
    D --> E
    F[Promotions] -.-> G[Independent]

    H[Master Seeding] --> A
    H --> B
    H --> D
    H --> C
    H --> E
    H --> F
```

---

## 🛠️ Installation & Setup

### 1. Environment Preparation

```bash
# Clone repository
git clone https://github.com/username/airbook.git
cd airbook/backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### 2. Database Configuration

```env
# .env file configuration
DATABASE_URL="postgresql://username:password@localhost:5432/airbook_db"
```

### 3. Schema Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Verify connection
npm run db:studio
```

---

## 📋 Usage Guide

### A. Comprehensive Seeding (Original)

```bash
# Single command for all data
npm run db:seed-comprehensive

# Alternative: using script
scripts/seed-database.bat        # Windows
./scripts/seed-database.sh       # Unix/Linux/Mac
```

**Pros:**

- ✅ Fast execution
- ✅ Single command
- ✅ Proven reliability

**Cons:**

- ❌ Monolithic approach
- ❌ Hard to debug specific issues
- ❌ No selective seeding

### B. Modular Seeding (Recommended)

#### B.1. Complete Modular Seeding

```bash
# All components in dependency order
npm run db:seed-modular

# Alternative: using script
scripts/seed-modular.bat         # Windows
./scripts/seed-modular.sh        # Unix/Linux/Mac
```

#### B.2. Individual Component Seeding

```bash
# Geographic data
npm run db:seed-countries        # 8 countries
npm run db:seed-cities           # 11 cities
npm run db:seed-airports         # 11 airports

# Airline operations
npm run db:seed-airlines         # 8 airlines
npm run db:seed-flights          # 8 flight schedules

# Marketing data
npm run db:seed-promotions       # 6 promotional campaigns
```

#### B.3. Selective Seeding Workflows

```bash
# Scenario 1: Geography setup only
npm run db:seed-countries
npm run db:seed-cities
npm run db:seed-airports

# Scenario 2: Airline operations only
npm run db:seed-airlines
npm run db:seed-flights

# Scenario 3: Fresh start with specific data
npm run db:reset
npm run db:seed-countries
npm run db:seed-airlines
npm run db:seed-promotions
```

### C. Verification Methods

#### C.1. Prisma Studio (Visual)

```bash
# Open database browser
npm run db:studio
# Opens at: http://localhost:5555
```

#### C.2. Admin Dashboard (Application)

```bash
# Start backend server
npm run dev
# API available at: http://localhost:3001

# Start admin frontend
cd ../admin
npm run dev
# Dashboard at: http://localhost:5173
```

#### C.3. Direct Database Query

```bash
# Connect to PostgreSQL
psql -h localhost -U username -d airbook_db

# Sample queries
SELECT COUNT(*) FROM "Country";
SELECT COUNT(*) FROM "City";
SELECT COUNT(*) FROM "Airport";
SELECT COUNT(*) FROM "Airline";
SELECT COUNT(*) FROM "AdminFlightSchedule";
SELECT COUNT(*) FROM "Promotion";
```

---

## 📊 Data Structure

### 1. Countries (8 entries)

| Code | Name        | Continent | Currency | Timezone          |
| ---- | ----------- | --------- | -------- | ----------------- |
| ID   | Indonesia   | Asia      | IDR      | Asia/Jakarta      |
| SG   | Singapore   | Asia      | SGD      | Asia/Singapore    |
| MY   | Malaysia    | Asia      | MYR      | Asia/Kuala_Lumpur |
| TH   | Thailand    | Asia      | THB      | Asia/Bangkok      |
| VN   | Vietnam     | Asia      | VND      | Asia/Ho_Chi_Minh  |
| PH   | Philippines | Asia      | PHP      | Asia/Manila       |
| JP   | Japan       | Asia      | JPY      | Asia/Tokyo        |
| AU   | Australia   | Oceania   | AUD      | Australia/Sydney  |

### 2. Cities (11 entries)

| City             | Country     | Population | Coordinates        |
| ---------------- | ----------- | ---------- | ------------------ |
| Jakarta          | Indonesia   | 10,770,000 | -6.2088, 106.8456  |
| Surabaya         | Indonesia   | 2,874,000  | -7.2575, 112.7521  |
| Denpasar         | Indonesia   | 897,300    | -8.6705, 115.2126  |
| Medan            | Indonesia   | 2,435,000  | 3.5952, 98.6722    |
| Singapore        | Singapore   | 5,685,000  | 1.3521, 103.8198   |
| Kuala Lumpur     | Malaysia    | 1,768,000  | 3.1390, 101.6869   |
| Bangkok          | Thailand    | 10,539,000 | 13.7563, 100.5018  |
| Ho Chi Minh City | Vietnam     | 9,321,000  | 10.8231, 106.6297  |
| Manila           | Philippines | 13,482,000 | 14.5995, 120.9842  |
| Tokyo            | Japan       | 37,435,000 | 35.6762, 139.6503  |
| Sydney           | Australia   | 5,312,000  | -33.8688, 151.2093 |

### 3. Airports (11 entries)

| IATA | ICAO | Name                         | City         | Elevation |
| ---- | ---- | ---------------------------- | ------------ | --------- |
| CGK  | WIII | Soekarno-Hatta International | Jakarta      | 34m       |
| MLG  | WARA | Abdul Rachman Saleh          | Surabaya     | 526m      |
| DPS  | WADD | Ngurah Rai International     | Denpasar     | 14m       |
| KNO  | WIMM | Kualanamu International      | Medan        | 23m       |
| SIN  | WSSS | Singapore Changi Airport     | Singapore    | 22m       |
| KUL  | WMKK | Kuala Lumpur International   | Kuala Lumpur | 69m       |
| BKK  | VTBS | Suvarnabhumi Airport         | Bangkok      | 2m        |
| SGN  | VVTS | Tan Son Nhat International   | Ho Chi Minh  | 33m       |
| MNL  | RPLL | Ninoy Aquino International   | Manila       | 23m       |
| NRT  | RJAA | Narita International         | Tokyo        | 43m       |
| SYD  | YSSY | Sydney Kingsford Smith       | Sydney       | 21m       |

### 4. Airlines (8 entries)

| Code | Name               | Type         | Country   | Description         |
| ---- | ------------------ | ------------ | --------- | ------------------- |
| GA   | Garuda Indonesia   | Full-service | Indonesia | National carrier    |
| JT   | Lion Air           | Low-cost     | Indonesia | Budget airline      |
| ID   | Batik Air          | Full-service | Indonesia | Lion Air subsidiary |
| QZ   | Indonesia AirAsia  | Low-cost     | Indonesia | AirAsia franchise   |
| SQ   | Singapore Airlines | Premium      | Singapore | Flag carrier        |
| MH   | Malaysia Airlines  | Full-service | Malaysia  | Flag carrier        |
| TG   | Thai Airways       | Full-service | Thailand  | Flag carrier        |
| VN   | Vietnam Airlines   | Full-service | Vietnam   | Flag carrier        |

### 5. Flight Schedules (8 entries)

| Flight  | Route     | Airline   | Departure | Arrival | Price  | Status    |
| ------- | --------- | --------- | --------- | ------- | ------ | --------- |
| GA-410  | CGK → DPS | Garuda    | 07:00     | 10:00   | Rp1.2M | SCHEDULED |
| GA-411  | DPS → CGK | Garuda    | 14:30     | 17:30   | Rp1.2M | SCHEDULED |
| GA-830  | CGK → SIN | Garuda    | 09:15     | 11:45   | Rp2.5M | SCHEDULED |
| JT-610  | CGK → MLG | Lion Air  | 06:30     | 09:00   | Rp800K | DELAYED   |
| JT-270  | CGK → KNO | Lion Air  | 08:45     | 11:15   | Rp900K | SCHEDULED |
| ID-7700 | CGK → BKK | Batik Air | 10:20     | 13:40   | Rp1.8M | SCHEDULED |
| QZ-8398 | CGK → KUL | AirAsia   | 13:50     | 16:30   | Rp750K | SCHEDULED |
| SQ-950  | SIN → CGK | Singapore | 19:25     | 21:45   | Rp3.2M | SCHEDULED |

### 6. Promotions (6 entries)

| Code        | Title            | Type       | Discount | Valid Until  | Status  |
| ----------- | ---------------- | ---------- | -------- | ------------ | ------- |
| EARLY2025   | Early Bird 2025  | Percentage | 30%      | Mar 31, 2025 | Active  |
| WEEKEND50   | Weekend Getaway  | Fixed      | 150k     | Dec 31, 2025 | Active  |
| STUDENT25   | Student Discount | Percentage | 25%      | Dec 31, 2025 | Active  |
| FLASH24H    | Flash Sale 24H   | Percentage | 40%      | Oct 21, 2025 | Active  |
| NEWYEAR2025 | New Year Special | Percentage | 35%      | Jan 15, 2026 | Active  |
| FAMILY20    | Family Package   | Percentage | 20%      | Aug 31, 2025 | Expired |

---

## 🔧 API Reference

### NPM Scripts

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:reset": "prisma migrate reset --force",

    "db:seed": "ts-node prisma/seed.ts",
    "db:seed-comprehensive": "ts-node prisma/seed-comprehensive.ts",

    "db:seed-modular": "ts-node prisma/seeds/index.ts",
    "db:seed-countries": "ts-node prisma/seeds/countries.ts",
    "db:seed-cities": "ts-node prisma/seeds/cities.ts",
    "db:seed-airports": "ts-node prisma/seeds/airports.ts",
    "db:seed-airlines": "ts-node prisma/seeds/airlines.ts",
    "db:seed-flights": "ts-node prisma/seeds/flightSchedules.ts",
    "db:seed-promotions": "ts-node prisma/seeds/promotions.ts"
  }
}
```

### Seeding Function Interface

```typescript
// Generic seeding function interface
interface SeedFunction {
  (): Promise<Array<DatabaseRecord>>;
}

// Example implementation
export async function seedCountries(): Promise<Country[]> {
  console.log("📍 Seeding countries...");

  const countries = await Promise.all([
    prisma.country.upsert({
      where: { code: "ID" },
      update: {},
      create: {
        /* country data */
      },
    }),
    // ... more countries
  ]);

  console.log(`✅ Seeded ${countries.length} countries`);
  return countries;
}
```

### Dependency Resolution

```typescript
// Master seeding with dependency resolution
async function masterSeed() {
  // 1. Independent entities first
  const countries = await seedCountries();
  const promotions = await seedPromotions();

  // 2. Entities dependent on countries
  const cities = await seedCities();
  const airlines = await seedAirlines();

  // 3. Entities dependent on cities
  const airports = await seedAirports();

  // 4. Entities dependent on airlines and airports
  const flightSchedules = await seedFlightSchedules();

  return {
    countries,
    cities,
    airports,
    airlines,
    flightSchedules,
    promotions,
  };
}
```

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. **Permission Errors**

**Problem:**

```
EPERM: operation not permitted, rename '...query_engine-windows.dll.node.tmp...'
```

**Solution:**

```bash
# Close all terminals and IDEs
# Run as administrator (Windows)
npm run db:generate

# Alternative: Clear node_modules
rm -rf node_modules
npm install
```

#### 2. **Database Connection Errors**

**Problem:**

```
Error: P1001: Can't reach database server at localhost:5432
```

**Solution:**

```bash
# Check PostgreSQL status
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql  # macOS

# Verify .env configuration
cat .env | grep DATABASE_URL
```

#### 3. **Foreign Key Constraint Errors**

**Problem:**

```
Foreign key constraint failed on the field: countryId
```

**Solution:**

```bash
# Use dependency-aware seeding
npm run db:seed-modular  # Handles dependencies automatically

# Manual approach
npm run db:seed-countries  # Always seed countries first
npm run db:seed-cities     # Then cities
# ... continue in dependency order
```

#### 4. **Duplicate Key Errors**

**Problem:**

```
Unique constraint failed on the constraint: countries_code_key
```

**Solution:**

```bash
# Seeds use upsert - this shouldn't happen normally
# If it does, reset and reseed
npm run db:reset
npm run db:seed-modular
```

#### 5. **TypeScript Compilation Errors**

**Problem:**

```
error TS2304: Cannot find name 'prisma'
```

**Solution:**

```bash
# Regenerate Prisma client
npm run db:generate

# Check tsconfig.json includes prisma
cat tsconfig.json
```

### Debug Commands

```bash
# Check database tables
npm run db:studio

# Verify Prisma client generation
ls node_modules/.prisma/client/

# Check environment variables
echo $DATABASE_URL

# Test database connection
npm run db:push

# View all npm scripts
npm run
```

---

## 🎯 Best Practices

### 1. Development Workflow

```bash
# Daily development setup
git pull
npm install
npm run db:push
npm run db:seed-modular
npm run dev
```

### 2. Testing Strategy

```bash
# Before running tests
npm run db:reset
npm run db:seed-modular

# Run specific component tests
npm run db:seed-airlines
npm test airline.spec.ts
```

### 3. Production Deployment

```bash
# Production seeding (use comprehensive for speed)
npm run db:seed-comprehensive

# Verify data integrity
npm run db:studio
```

### 4. Data Maintenance

```bash
# Update specific data without full reset
npm run db:seed-promotions  # Update just promotions

# Backup before major changes
pg_dump airbook_db > backup_$(date +%Y%m%d).sql
```

### 5. Performance Optimization

- Use `db:seed-comprehensive` for production (faster)
- Use `db:seed-modular` for development (better debugging)
- Run individual seeds during development to save time
- Use database transactions for large datasets

---

## 🤝 Contributing

### Adding New Seed Data

1. **Create new seed file:**

```typescript
// prisma/seeds/newEntity.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedNewEntity() {
  console.log("🆕 Seeding new entity...");

  const entities = await Promise.all([
    prisma.newEntity.upsert({
      where: { id: "unique-id" },
      update: {},
      create: {
        /* entity data */
      },
    }),
  ]);

  console.log(`✅ Seeded ${entities.length} new entities`);
  return entities;
}

// Standalone execution
if (require.main === module) {
  seedNewEntity()
    .then(() => console.log("✅ Complete!"))
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}
```

2. **Update master seeding:**

```typescript
// prisma/seeds/index.ts
import { seedNewEntity } from "./newEntity";

async function masterSeed() {
  // ... existing seeds
  const newEntities = await seedNewEntity();
  // ... rest of function
}
```

3. **Add NPM script:**

```json
{
  "scripts": {
    "db:seed-new-entity": "ts-node prisma/seeds/newEntity.ts"
  }
}
```

### Code Standards

- Use descriptive commit messages
- Follow TypeScript conventions
- Add proper error handling
- Include console logging for progress
- Use upsert operations for idempotency
- Document new seed files in README

### Testing Contributions

```bash
# Test new seed individually
npm run db:seed-new-entity

# Test integration with master seed
npm run db:reset
npm run db:seed-modular

# Verify data integrity
npm run db:studio
```

---

## 📝 Changelog

### Version 2.0 (October 2025)

- ✅ Added modular seeding system
- ✅ Created individual component seeds
- ✅ Added cross-platform batch scripts
- ✅ Enhanced NPM scripts
- ✅ Comprehensive documentation
- ✅ Added dependency resolution
- ✅ Improved error handling

### Version 1.0 (Initial)

- ✅ Basic comprehensive seeding
- ✅ Prisma integration
- ✅ PostgreSQL support
- ✅ Sample airline data

---

## 📞 Support

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/username/airbook/issues)
- **Discussions**: [GitHub Discussions](https://github.com/username/airbook/discussions)
- **Documentation**: This file and `/prisma/seeds/README.md`

### Quick Help Commands

```bash
# Check system status
npm run db:studio  # Visual database inspection
npm run dev        # Start development server
npm --version      # Check npm version
node --version     # Check Node.js version
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**🎯 Happy Seeding! Your AirBook database is now ready for takeoff! ✈️**
