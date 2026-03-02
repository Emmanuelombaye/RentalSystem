import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// --- AI Communication Hub ---

export const getAIConversations = async (req: AuthRequest, res: Response) => {
    try {
        const conversations = await prisma.aIConversation.findMany({
            include: {
                tenant: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        });
        res.json(conversations);
    } catch (error) {
        console.error('AI Conversations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createAIConversation = async (req: AuthRequest, res: Response) => {
    try {
        const { tenantId, message, response, type, status } = req.body;
        const conversation = await prisma.aIConversation.create({
            data: {
                tenantId,
                message,
                response,
                type,
                status
            }
        });
        res.json(conversation);
    } catch (error) {
        console.error('Create AI Conversation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// --- Rent Collection & Risk ---

export const getTenantRiskScores = async (req: AuthRequest, res: Response) => {
    try {
        const scores = await prisma.tenantRiskScore.findMany({
            include: {
                tenant: true
            },
            orderBy: {
                score: 'desc'
            }
        });
        res.json(scores);
    } catch (error) {
        console.error('Tenant Risk Scores error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// --- Maintenance Prediction ---

export const getMaintenancePredictions = async (req: AuthRequest, res: Response) => {
    try {
        const predictions = await prisma.maintenancePrediction.findMany({
            include: {
                unit: {
                    include: {
                        property: true
                    }
                }
            },
            orderBy: {
                probability: 'desc'
            }
        });
        res.json(predictions);
    } catch (error) {
        console.error('Maintenance Predictions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// --- Security Alerts ---

export const getSecurityAlerts = async (req: AuthRequest, res: Response) => {
    try {
        const alerts = await prisma.securityAlert.findMany({
            include: {
                property: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.json(alerts);
    } catch (error) {
        console.error('Security Alerts error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// --- M-Pesa Integration (Simulation) ---

export const initMpesaStkPush = async (req: AuthRequest, res: Response) => {
    try {
        const { amount, phone, tenantId } = req.body;

        // Simulating STK Push
        const checkoutId = `CH_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        const transaction = await prisma.mpesaTransaction.create({
            data: {
                merchantId: "MKT_LANDLORD_001",
                checkoutId,
                amount,
                phone,
                status: 'pending'
            }
        });

        // In a real app, this would call Safaricom API
        res.json({
            success: true,
            checkoutId,
            message: "STK Push initiated to your phone."
        });
    } catch (error) {
        console.error('M-Pesa STK Push error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// --- AI Dashboard Aggregated Stats ---

export const getAIDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const [
            totalRevenue,
            aiTasksCount,
            mpesaCount,
            riskBreakdown,
            recentAlerts,
            pendingPredictions
        ] = await Promise.all([
            prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'paid' } }),
            prisma.aIConversation.count(),
            prisma.mpesaTransaction.count(),
            prisma.tenantRiskScore.groupBy({ by: ['level'], _count: { id: true } }),
            prisma.securityAlert.findMany({ take: 3, orderBy: { createdAt: 'desc' } }),
            prisma.maintenancePrediction.findMany({ where: { status: 'pending' }, take: 5 })
        ]);

        res.json({
            revenue: totalRevenue._sum.amount || 0,
            aiTasks: aiTasksCount,
            mpesaTransactions: mpesaCount,
            riskLevels: riskBreakdown,
            recentAlerts,
            predictions: pendingPredictions
        });
    } catch (error) {
        console.error('AI Dashboard Stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
