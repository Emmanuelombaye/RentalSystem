import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAI() {
    console.log("Seeding Diani Rent AI data...");

    const p = prisma as any;

    // 1. Get or Create a Landlord User
    let landlord = await p.user.findFirst({ where: { role: 'LANDLORD' } });
    if (!landlord) {
        landlord = await p.user.create({
            data: {
                name: "Coastal Manager",
                email: "manager@diani.ai",
                password: "hashed_password",
                role: 'LANDLORD',
                status: 'active'
            }
        });
    }

    // 2. Create a Property in Diani
    const property = await p.property.create({
        data: {
            name: "Diani Beachfront Villas",
            address: "Beach Road, Diani",
            type: "Villa",
            status: "active",
            landlordId: landlord.id
        }
    });

    // 3. Create a Tenant
    const tenant = await p.tenant.create({
        data: {
            name: "Alice Mwangi",
            email: "alice@diani.ai",
            phone: "+254700000000",
            status: "active"
        }
    });

    // 4. Create a Unit
    const unit = await p.unit.create({
        data: {
            label: "Villa 4B",
            propertyId: property.id,
            status: "occupied",
            rent: 150000,
            tenantId: tenant.id
        }
    });

    // 5. Seed AI Conversations
    await p.aIConversation.createMany({
        data: [
            {
                tenantId: tenant.id,
                message: "The sink is leaking in the kitchen.",
                response: "I've logged this as a high-priority maintenance task. A technician (Juma) has been notified.",
                type: "maintenance",
                status: "ai_handled"
            },
            {
                tenantId: tenant.id,
                message: "I'll pay the rent via M-Pesa tomorrow.",
                response: "Thank you for the update, Alice. I've noted this in your payment schedule.",
                type: "payment",
                status: "auto_replied"
            }
        ]
    });

    // 6. Seed Risk Score
    await p.tenantRiskScore.create({
        data: {
            tenantId: tenant.id,
            score: 95,
            level: "Low",
            factors: JSON.stringify(["Consistently pays on time", "No noise complaints"])
        }
    });

    // 7. Seed Maintenance Prediction
    await p.maintenancePrediction.create({
        data: {
            unitId: unit.id,
            component: "Water Pump",
            probability: 0.85,
            reason: "Vibration patterns detected in sensor data (last serviced 8 months ago)",
            suggestedAt: new Date(),
            status: "pending"
        }
    });

    // 8. Seed Security Alert
    await p.securityAlert.create({
        data: {
            propertyId: property.id,
            type: "unusual_motion",
            severity: "low",
            snapshotUrl: "https://example.com/snapshot.jpg",
            isResolved: false
        }
    });

    console.log("Diani Rent AI seeding complete!");
}

seedAI()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
