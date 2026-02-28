import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const regions = [
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3',
    'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
    'sa-east-1', 'ca-central-1', 'af-south-1', 'me-south-1'
];

async function tryRegion(region: string, pass: string) {
    const client = new Client({
        user: 'postgres.luicppaodlualsmwbwce',
        password: pass,
        host: `aws-0-${region}.pooler.supabase.com`,
        port: 6543,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
    });

    try {
        await client.connect();
        console.log(`FOUND! Region is ${region} with password: ${pass}`);
        await client.end();
        return true;
    } catch (err: any) {
        if (!err.message.includes('getaddrinfo ENOTFOUND')) {
            console.log(`${region} (${pass}): ${err.message}`);
        }
        return false;
    }
}

async function main() {
    const passwords = ['2LBV!ymWBB*AAxB', '[2LBV!ymWBB*AAxB]'];
    for (const pass of passwords) {
        for (const region of regions) {
            if (await tryRegion(region, pass)) return;
        }
    }
    console.log('None worked.');
}

main();
