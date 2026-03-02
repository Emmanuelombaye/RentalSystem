import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@eliteliving.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123456', 10);
        await prisma.user.create({
            data: {
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
                status: 'active'
            }
        });
        console.log('✅ Admin user created: admin@eliteliving.com / admin123456');
    } else {
        console.log('ℹ️ Admin user already exists.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
