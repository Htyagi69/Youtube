// setup-db.js - Run this to create better-auth tables
import pool from './db.js';

const createBetterAuthTables = async () => {
    try {
        // User table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
                name TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        // Account table (for passwords)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS account (
                id TEXT PRIMARY KEY, 
                "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                "accountId" TEXT NOT NULL,
                "providerId" TEXT NOT NULL,
                "accessToken" TEXT,
                "refreshToken" TEXT,
                "idToken" TEXT,
                "expiresAt" TIMESTAMP,
                password TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        // Session table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS session (
                id TEXT PRIMARY KEY,
                "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
                "expiresAt" TIMESTAMP NOT NULL,
                token TEXT NOT NULL UNIQUE,
                "ipAddress" TEXT,
                "userAgent" TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        // Verification table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS verification (
                id TEXT PRIMARY KEY,
                identifier TEXT NOT NULL,
                value TEXT NOT NULL,
                "expiresAt" TIMESTAMP NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `);

        console.log('✅ All better-auth tables created successfully!');
        console.log('You can now run your application.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        process.exit(1);
    }
};

createBetterAuthTables();
