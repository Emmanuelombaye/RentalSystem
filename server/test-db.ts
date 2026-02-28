import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
    user: 'postgres.luicppaodlualsmwbwce',
    password: '2LBV!ymWBB*AAxB',
    host: 'aws-0-us-east-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
});

async function test() {
    try {
        console.log('Testing connection to Virginia (us-east-1) pooler...');
        await client.connect();
        console.log('Successfully connected to the database!');
        const res = await client.query('SELECT NOW()');
        console.log('Result:', res.rows[0]);
        await client.end();
    } catch (err: any) {
        console.error('Connection error:', err.message);
    }
}

test();
