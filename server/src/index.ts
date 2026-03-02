import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";

dotenv.config();

import { supabase } from "./lib/supabase";
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import tenantRoutes from './routes/tenant.routes';
import landlordRoutes from './routes/landlord.routes';
import aiRoutes from './routes/ai.routes';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// --- Security Middleware ---
app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST.split(',') : true,
    credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// --- Rate Limiting ---
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", limiter);

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/landlord', landlordRoutes);
app.use('/api/ai', aiRoutes);

// --- Connection Health Check ---
app.get("/api/health", async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            status: "ok",
            database: "connected",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Database connection failed" });
    }
});

// --- Legacy Dashboard Stats Endpoint (Supabase SDK Fallback) ---
// Note: Keeping this for now to avoid breaking existing frontend calls if any
app.get("/api/dashboard/stats", async (req, res) => {
    try {
        const { count: totalProperties } = await supabase.from("Property").select("*", { count: "exact", head: true });
        const { count: totalUnits } = await supabase.from("Unit").select("*", { count: "exact", head: true });
        const { count: occupiedUnits } = await supabase.from("Unit").select("*", { count: "exact", head: true }).eq("status", "occupied");
        const { count: vacantUnits } = await supabase.from("Unit").select("*", { count: "exact", head: true }).eq("status", "vacant");

        const { data: recentPayments } = await supabase
            .from("Payment")
            .select("*, Tenant(name), Unit(label)")
            .order("date", { ascending: false })
            .limit(5);

        const { data: maintenanceRequests } = await supabase
            .from("MaintenanceRequest")
            .select("*, Unit(label)")
            .order("createdAt", { ascending: false })
            .limit(4);

        const revenueData = [
            { month: "Jan", revenue: 45000, expenses: 28000 },
            { month: "Feb", revenue: 52000, expenses: 31000 },
            { month: "Mar", revenue: 48000, expenses: 29000 },
            { month: "Apr", revenue: 61000, expenses: 34000 },
            { month: "May", revenue: 55000, expenses: 32000 },
            { month: "Jun", revenue: 67000, expenses: 36000 },
            { month: "Jul", revenue: 72000, expenses: 72450 },
        ];

        res.json({
            metrics: {
                totalRevenue: 72450,
                totalProperties: totalProperties || 0,
                totalUnits: totalUnits || 0,
                occupiedUnits: occupiedUnits || 0,
                vacantUnits: vacantUnits || 0,
                overdueCount: 6,
                overdueAmount: 8250,
            },
            revenueData,
            occupancyData: [
                { name: "Occupied", value: occupiedUnits || 0, color: "#3b82f6" },
                { name: "Vacant", value: vacantUnits || 0, color: "#94a3b8" },
                { name: "Maintenance", value: 8, color: "#f59e0b" },
            ],
            paymentActivity: (recentPayments || []).map((p: any) => ({
                name: p.Tenant?.name || "Tenant",
                unit: p.Unit?.label || "Unit",
                amount: p.amount,
                status: p.status,
                time: "Just now"
            })),
            maintenanceRequests: (maintenanceRequests || []).map((r: any) => ({
                id: r.id,
                unit: r.Unit?.label || "Unit",
                issue: r.issue,
                priority: r.priority,
                status: r.status
            }))
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
});

// --- Centralized Error Handler ---
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
});

export { app, prisma };

if (process.env.NODE_ENV !== 'production' || process.env.RUN_LOCAL === 'true') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
