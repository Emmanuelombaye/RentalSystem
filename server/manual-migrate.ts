import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    connectionString: process.env.DATABASE_URL?.replace('?pgbouncer=true', ''), // Use session mode or direct
    ssl: { rejectUnauthorized: false },
});

async function migrate() {
    try {
        await client.connect();
        console.log('Connected to database for manual migration...');

        // 1. Create Enums
        await client.query(`
            DO $$ BEGIN
                CREATE TYPE "Role" AS ENUM ('ADMIN', 'LANDLORD', 'TENANT');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;

            DO $$ BEGIN
                CREATE TYPE "Status" AS ENUM ('active', 'inactive', 'pending');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        // 2. Create User table
        await client.query(`
            CREATE TABLE IF NOT EXISTS "User" (
                "id" TEXT PRIMARY KEY,
                "name" TEXT NOT NULL,
                "email" TEXT UNIQUE NOT NULL,
                "password" TEXT NOT NULL,
                "role" "Role" DEFAULT 'TENANT',
                "status" "Status" DEFAULT 'pending',
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
            );
        `);

        // 3. Create PasswordResetToken table
        await client.query(`
            CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
                "id" TEXT PRIMARY KEY,
                "token" TEXT UNIQUE NOT NULL,
                "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
                "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
            );
        `);

        // 4. Update existing tables
        await client.query(`
            ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "landlordId" TEXT REFERENCES "User"("id");
            ALTER TABLE "Tenant" ADD COLUMN IF NOT EXISTS "userId" TEXT UNIQUE REFERENCES "User"("id");
            ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "leaseId" TEXT REFERENCES "Lease"("id");
        `);

        // 5. Create Indexes
        await client.query(`
            CREATE INDEX IF NOT EXISTS "User_email_idx" ON "User"("email");
            CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
            CREATE INDEX IF NOT EXISTS "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");
            CREATE INDEX IF NOT EXISTS "Property_landlordId_idx" ON "Property"("landlordId");
            CREATE INDEX IF NOT EXISTS "Tenant_userId_idx" ON "Tenant"("userId");
            CREATE INDEX IF NOT EXISTS "Payment_leaseId_idx" ON "Payment"("leaseId");
        `);

        console.log('Manual migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await client.end();
    }
}

migrate();
