import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getProperties = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        const where: any = {};
        if (role === 'LANDLORD') {
            where.landlordId = userId;
        }

        const properties = await prisma.property.findMany({
            where,
            include: {
                units: {
                    include: {
                        tenant: true
                    }
                }
            }
        });
        res.json(properties);
    } catch (error) {
        console.error('Landlord properties error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getRevenueSummary = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;

        const whereClause: any = role === 'LANDLORD' ? { landlordId: userId } : {};
        const properties = await prisma.property.findMany({
            where: whereClause,
            select: { id: true }
        });

        const propertyIds = properties.map(p => p.id);

        const summary = await prisma.payment.aggregate({
            where: {
                unit: {
                    propertyId: { in: propertyIds }
                },
                status: 'paid'
            },
            _sum: {
                amount: true
            },
            _count: {
                id: true
            }
        });

        res.json({
            totalRevenue: summary._sum.amount || 0,
            paymentCount: summary._count.id,
            propertyCount: propertyIds.length
        });
    } catch (error) {
        console.error('Revenue summary error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
