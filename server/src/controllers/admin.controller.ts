import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { hashPassword } from '../utils/auth';

const prisma = new PrismaClient();

/**
 * 🏢 1️⃣ PROPERTY & UNIT MANAGEMENT (ADMIN)
 */

export const createProperty = async (req: Request, res: Response) => {
    const { name, address, type, landlordId, images } = req.body;
    try {
        const property = await prisma.property.create({
            data: {
                name,
                address,
                type,
                status: 'active',
                landlordId,
                images: images ? JSON.stringify(images) : null
            }
        });
        res.status(201).json(property);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

export const updateProperty = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const property = await prisma.property.update({
            where: { id },
            data: updateData
        });
        res.json(property);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

export const deleteProperty = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // Check for active leases in units of this property
        const unitsWithLeases = await prisma.unit.findMany({
            where: {
                propertyId: id,
                leases: { some: { status: 'active' } }
            }
        });

        if (unitsWithLeases.length > 0) {
            return res.status(400).json({ error: 'Cannot delete property with active leases. Terminate leases first.' });
        }

        await prisma.property.delete({ where: { id } });
        res.json({ message: 'Property deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

export const createUnit = async (req: Request, res: Response) => {
    const { label, propertyId, rent, status } = req.body;
    try {
        const unit = await prisma.unit.create({
            data: {
                label,
                propertyId,
                rent,
                status: status || 'vacant'
            }
        });
        res.status(201).json(unit);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

/**
 * 👥 2️⃣ TENANT MANAGEMENT (ADMIN)
 */

export const createTenantAcc = async (req: Request, res: Response) => {
    const { name, email, phone, unitId } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) return res.status(400).json({ error: 'Account with this email already exists' });

        // Admin cannot see password, generating a cryptographically secure random string
        const randomPass = crypto.randomBytes(32).toString('hex');
        const hashedPassword = await hashPassword(randomPass);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'TENANT',
                status: 'pending',
                tenantProfile: {
                    create: { name, email, phone, status: 'active' }
                }
            },
            include: { tenantProfile: true }
        });

        const token = crypto.randomBytes(32).toString('hex');
        await prisma.passwordResetToken.create({
            data: {
                token,
                userId: newUser.id,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
        });

        if (unitId && newUser.tenantProfile) {
            await prisma.unit.update({
                where: { id: unitId },
                data: { tenantId: newUser.tenantProfile.id, status: 'occupied' }
            });
        }

        res.status(201).json({
            message: 'Tenant account created successfully. Send the activation link below.',
            activationLink: `/activate-account?token=${token}`,
            tenantId: newUser.tenantProfile?.id
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

/**
 * 📄 3️⃣ LEASE MANAGEMENT (ADMIN)
 */

export const createLease = async (req: Request, res: Response) => {
    const { unitId, tenantId, startDate, endDate, rentAmount, depositAmount, dueDay, lateFee, contractUrl } = req.body;
    try {
        const lease = await prisma.lease.create({
            data: {
                unitId,
                tenantId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                rentAmount,
                depositAmount,
                dueDay: dueDay || 1,
                lateFee: lateFee || 0,
                contractUrl,
                status: 'active'
            }
        });

        // Ensure unit is linked and marked occupied
        await prisma.unit.update({
            where: { id: unitId },
            data: { status: 'occupied', tenantId }
        });

        res.status(201).json(lease);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

export const terminateLease = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const lease = await prisma.lease.update({
            where: { id },
            data: { status: 'terminated' }
        });

        // Set unit status back to vacant if no other active lease
        await prisma.unit.update({
            where: { id: lease.unitId },
            data: { status: 'vacant', tenantId: null }
        });

        res.json({ message: 'Lease terminated successfully', lease });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

/**
 * 💳 4️⃣ PAYMENT MANAGEMENT (ADMIN)
 */

export const recordManualPayment = async (req: Request, res: Response) => {
    const { tenantId, unitId, leaseId, amount, paymentType, method, reference } = req.body;
    try {
        const payment = await prisma.payment.create({
            data: {
                tenantId,
                unitId,
                leaseId,
                amount,
                paymentType: paymentType || 'rent',
                method,
                reference,
                status: 'paid',
                date: new Date()
            }
        });
        res.status(201).json(payment);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

/**
 * 🛠 5️⃣ MAINTENANCE MANAGEMENT (ADMIN)
 */

export const getMaintenanceRequests = async (req: Request, res: Response) => {
    try {
        const requests = await prisma.maintenanceRequest.findMany({
            include: {
                unit: { select: { label: true, property: { select: { name: true } } } },
                tenant: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

export const updateMaintenanceStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, assignedTechnician, cost, adminNotes } = req.body;
    try {
        const request = await prisma.maintenanceRequest.update({
            where: { id },
            data: {
                status,
                assignedTechnician,
                cost,
                description: adminNotes ? { append: `\n[Admin Note]: ${adminNotes}` } : undefined
            }
        });
        res.json(request);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};

/**
 * 📊 6️⃣ REPORTS & ANALYTICS (ADMIN)
 */

export const getAdminStats = async (req: Request, res: Response) => {
    try {
        const totalProperties = await prisma.property.count();
        const totalUnits = await prisma.unit.count();
        const occupiedUnits = await prisma.unit.count({ where: { status: 'occupied' } });
        const vacantUnits = await prisma.unit.count({ where: { status: 'vacant' } });
        const maintenanceUnits = await prisma.unit.count({ where: { status: 'maintenance' } });

        const totalRevenue = await prisma.payment.aggregate({
            where: { status: 'paid' },
            _sum: { amount: true }
        });

        const recentPayments = await prisma.payment.findMany({
            include: {
                tenant: { select: { name: true } },
                unit: { select: { label: true } }
            },
            orderBy: { date: 'desc' },
            take: 5
        });

        const recentMaintenance = await prisma.maintenanceRequest.findMany({
            include: { unit: { select: { label: true } } },
            orderBy: { createdAt: 'desc' },
            take: 4
        });

        // Mock revenue data for the chart (In a real system, you'd aggregate by month)
        const revenueData = [
            { month: "Jan", revenue: 45000, expenses: 28000 },
            { month: "Feb", revenue: 52000, expenses: 31000 },
            { month: "Mar", revenue: 48000, expenses: 29000 },
            { month: "Apr", revenue: 61000, expenses: 34000 },
            { month: "May", revenue: 55000, expenses: 32000 },
            { month: "Jun", revenue: 67000, expenses: 36000 },
            { month: "Jul", revenue: 72000, expenses: 38000 },
        ];

        res.json({
            metrics: {
                totalRevenue: totalRevenue._sum.amount || 0,
                totalProperties,
                totalUnits,
                occupiedUnits,
                vacantUnits,
                overdueCount: 0, // Logic to be implemented
                overdueAmount: 0,
            },
            revenueData,
            occupancyData: [
                { name: "Occupied", value: occupiedUnits, color: "#3b82f6" },
                { name: "Vacant", value: vacantUnits, color: "#94a3b8" },
                { name: "Maintenance", value: maintenanceUnits, color: "#f59e0b" },
            ],
            paymentActivity: recentPayments.map(p => ({
                name: p.tenant?.name || "Unknown",
                unit: p.unit?.label || "N/A",
                amount: p.amount,
                status: p.status,
                time: "Recently"
            })),
            maintenanceRequests: recentMaintenance.map(r => ({
                id: r.id,
                unit: r.unit?.label || "N/A",
                issue: r.issue,
                priority: r.priority,
                status: r.status
            }))
        });
    } catch (error: any) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
