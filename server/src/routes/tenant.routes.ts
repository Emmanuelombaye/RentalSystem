import { Router } from 'express';
import * as tenantController from '../controllers/tenant.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

// Protect all tenant routes
router.use(authenticateJWT);
router.use(authorizeRole(['TENANT']));

// 📊 1️⃣ Tenant Dashboard
router.get('/dashboard', tenantController.getDashboard);

// 💳 2️⃣ Payments
router.get('/payments', tenantController.getPayments);
// Invoices and Receipts can be handled via the same payments endpoint or specialized ones if needed

// 📄 3️⃣ Lease Information
router.get('/lease', tenantController.getLeaseDetails);

// 🛠 4️⃣ Maintenance Requests
router.post('/maintenance', tenantController.createMaintenanceRequest);
router.get('/maintenance', tenantController.getMaintenanceRequests);

// 👤 6️⃣ Profile Settings
router.put('/profile', tenantController.updateProfile);

export default router;
