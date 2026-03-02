import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import { hashPassword } from '../utils/auth';

const prisma = new PrismaClient();

/**
 * 📊 TENANT DASHBOARD
 * Tenant sees own lease, rent, due date, balance, etc.
 */
export const getDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { userId: req.user?.id },
            include: {
                units: {
                    include: { property: true }
                },
                leases: {
                    where: { status: 'active' }
                },
                payments: {
                    orderBy: { date: 'desc' },
                    take: 5
                },
                maintenance: {
                    orderBy: { createdAt: 'desc' },
                    take: 3
                }
            }
        });

        if (!tenant) return res.status(404).json({ error: 'Tenant record not found' });

        // Calculate outstanding balance logically (mock logic for now)
        const activeLease = tenant.leases[0];
        const dashboardData = {
            profile: {
                name: tenant.name,
                email: tenant.email,
                phone: tenant.phone
            },
            lease: activeLease ? {
                unit: tenant.units[0]?.label,
                property: tenant.units[0]?.property.name,
                rent: activeLease.rentAmount, // Assuming we add rentAmount to Lease model or pull from Unit
                startDate: activeLease.startDate,
                endDate: activeLease.endDate,
                status: activeLease.status
            } : null,
            recentPayments: tenant.payments,
            activeMaintenance: tenant.maintenance,
            notifications: [] // Placeholder
        };

        res.json(dashboardData);
    } catch (error) {
        console.error('Tenant dashboard error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * 💳 PAYMENTS
 */
export const getPayments = async (req: AuthRequest, res: Response) => {
    try {
        const tenant = await prisma.tenant.findUnique({ where: { userId: req.user?.id } });
        if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

        const payments = await prisma.payment.findMany({
            where: { tenantId: tenant.id },
            include: { unit: { select: { label: true } } },
            orderBy: { date: 'desc' }
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * 📄 LEASE INFORMATION
 */
export const getLeaseDetails = async (req: AuthRequest, res: Response) => {
    try {
        const tenant = await prisma.tenant.findUnique({ where: { userId: req.user?.id } });
        if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

        const leases = await prisma.lease.findMany({
            where: { tenantId: tenant.id },
            include: { unit: { include: { property: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(leases);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * 🛠 MAINTENANCE REQUESTS
 */
export const createMaintenanceRequest = async (req: AuthRequest, res: Response) => {
    const { unitId, issue, description, priority } = req.body;
    try {
        const tenant = await prisma.tenant.findUnique({ where: { userId: req.user?.id } });
        if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

        const request = await prisma.maintenanceRequest.create({
            data: {
                unitId,
                tenantId: tenant.id,
                issue,
                description,
                priority,
                status: 'pending'
            }
        });
        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMaintenanceRequests = async (req: AuthRequest, res: Response) => {
    try {
        const tenant = await prisma.tenant.findUnique({ where: { userId: req.user?.id } });
        if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

        const requests = await prisma.maintenanceRequest.findMany({
            where: { tenantId: tenant.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * 👤 PROFILE SETTINGS
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
    const { phone, password } = req.body;
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const updateData: any = {};
        if (phone) {
            await prisma.tenant.update({
                where: { userId },
                data: { phone }
            });
        }

        if (password) {
            if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
            updateData.password = await hashPassword(password);
            await prisma.user.update({
                where: { id: userId },
                data: { password: updateData.password }
            });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
