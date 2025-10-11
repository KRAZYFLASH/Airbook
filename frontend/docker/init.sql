-- Initialization script for airbook PostgreSQL database
-- This script will be executed when the PostgreSQL container starts for the first time

-- Create database if not exists (optional, since POSTGRES_DB already creates it)
-- CREATE DATABASE IF NOT EXISTS airbook_db;

-- Switch to the airbook_db database
\c airbook_db;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any initial SQL commands here
-- For example, creating additional schemas, users, or initial data

-- Note: Prisma will handle the table creation through migrations
-- This file is mainly for any custom initialization you might need

COMMENT ON DATABASE airbook_db IS 'airbook Application Database';