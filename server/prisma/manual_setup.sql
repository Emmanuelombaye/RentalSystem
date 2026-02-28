-- 📊 RENTAL MANAGEMENT SYSTEM SCHEMA (Supabase SQL Editor)
-- --------------------------------------------------

-- 1. Create Property table
CREATE TABLE IF NOT EXISTS "Property" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Tenant table
CREATE TABLE IF NOT EXISTS "Tenant" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "phone" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Unit table
CREATE TABLE IF NOT EXISTS "Unit" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "label" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL REFERENCES "Property"("id") ON DELETE CASCADE,
    "status" TEXT NOT NULL,
    "rent" DOUBLE PRECISION NOT NULL,
    "tenantId" TEXT REFERENCES "Tenant"("id") ON DELETE SET NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Payment table
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id") ON DELETE CASCADE,
    "unitId" TEXT NOT NULL REFERENCES "Unit"("id") ON DELETE CASCADE,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "date" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create MaintenanceRequest table
CREATE TABLE IF NOT EXISTS "MaintenanceRequest" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "unitId" TEXT NOT NULL REFERENCES "Unit"("id") ON DELETE CASCADE,
    "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id") ON DELETE CASCADE,
    "issue" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Seed initial data
INSERT INTO "Property" ("name", "address", "type", "status") VALUES 
('Elite Living Plaza', '123 Business Way, New York', 'Apartment', 'active'),
('Blue Horizon Towers', '45 Broadway St, New York', 'Commercial', 'active');
