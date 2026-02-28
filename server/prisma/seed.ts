import { supabase } from '../src/lib/supabase';

async function main() {
    console.log("Seeding Supabase via REST SDK (bypassing Prisma P1001)...");

    // 1. Create Properties
    const { data: prop1, error: e1 } = await supabase.from('Property').insert({
        name: "Elite Living Plaza",
        address: "123 Business Way, New York",
        type: "Apartment",
        status: "active"
    }).select().single();

    const { data: prop2, error: e2 } = await supabase.from('Property').insert({
        name: "Blue Horizon Towers",
        address: "45 Broadway St, New York",
        type: "Commercial",
        status: "active"
    }).select().single();

    if (e1 || e2) {
        console.error("Property error:", e1 || e2);
    }

    // 2. Create Tenants
    const { data: tenant1 } = await supabase.from('Tenant').insert({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1 234 567 890",
        status: "active"
    }).select().single();

    const { data: tenant2 } = await supabase.from('Tenant').insert({
        name: "Sarah Smith",
        email: "sarah@example.com",
        phone: "+1 345 678 901",
        status: "active"
    }).select().single();

    // 3. Create Units
    if (prop1 && tenant1) {
        await supabase.from('Unit').insert({
            label: "Unit 305",
            propertyId: prop1.id,
            status: "occupied",
            rent: 1200,
            tenantId: tenant1.id
        });
    }

    if (prop1 && tenant2) {
        await supabase.from('Unit').insert({
            label: "Unit 412",
            propertyId: prop1.id,
            status: "occupied",
            rent: 1450,
            tenantId: tenant2.id
        });
    }

    if (prop2) {
        await supabase.from('Unit').insert({
            label: "Unit 101",
            propertyId: prop2.id,
            status: "vacant",
            rent: 2100
        });
    }

    console.log("Seeding finished via SDK!");
}

main().catch(console.error);
