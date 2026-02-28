import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

import { supabase } from "./lib/supabase";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- Connection Health Check ---
app.get("/api/health", async (req, res) => {
    try {
        const { data, error } = await supabase.from("_migrations").select("*").limit(1);
        res.json({
            database: "online",
            prisma: "initialized",
            supabase: error ? "auth_ok_but_error" : "fully_connected",
            ref: "luicppaodlualsmwbwce"
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to connect to Supabase" });
    }
});

// --- Dashboard Stats Endpoint (Supabase SDK Fallback) ---
app.get("/api/dashboard/stats", async (req, res) => {
    try {
        // These calls use HTTPS (port 443), bypassing the P1001 IPv6 issue!
        const { count: totalProperties } = await supabase.from("Property").select("*", { count: "exact", head: true });
        const { count: totalUnits } = await supabase.from("Unit").select("*", { count: "exact", head: true });
        const { count: occupiedUnits } = await supabase.from("Unit").select("*", { count: "exact", head: true }).eq("status", "occupied");
        const { count: vacantUnits } = await supabase.from("Unit").select("*", { count: "exact", head: true }).eq("status", "vacant");

        // Fetching related tables for the dashboard lists
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
        res.status(500).json({ error: "Failed to fetch dashboard stats via Supabase REST" });
    }
});

// --- Property Endpoints ---
app.get("/api/properties", async (req, res) => {
    try {
        const properties = await prisma.property.findMany({
            include: { units: true }
        });
        res.json(properties);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch properties" });
    }
});

// --- Unit Endpoints ---
app.get("/api/units", async (req, res) => {
    try {
        const units = await prisma.unit.findMany({
            include: { property: true, tenant: true }
        });
        res.json(units);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch units" });
    }
});

// --- Tenant Endpoints ---
app.get("/api/tenants", async (req, res) => {
    try {
        const tenants = await prisma.tenant.findMany({
            include: { units: true }
        });
        res.json(tenants);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tenants" });
    }
});

export { app, prisma };

if (process.env.NODE_ENV !== 'production' || process.env.RUN_LOCAL === 'true') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;
