-- =============================================================
-- AirBook Database Initialization Script
-- =============================================================

-- Create additional schemas if needed
CREATE SCHEMA IF NOT EXISTS airbook;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Set default schema
SET search_path TO public, airbook;

-- Grant privileges to airbook_user
GRANT ALL PRIVILEGES ON DATABASE airbook_db TO airbook_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO airbook_user;
GRANT ALL PRIVILEGES ON SCHEMA airbook TO airbook_user;

-- Create functions for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create indexes for better performance (will be created after Prisma migration)
-- These are examples - Prisma will handle most indexing

COMMENT ON DATABASE airbook_db IS 'AirBook Aviation Management System Database';