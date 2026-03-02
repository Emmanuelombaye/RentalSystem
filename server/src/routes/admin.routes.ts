import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

// Protect all admin routes
router.use(authenticateJWT);
router.use(authorizeRole(['ADMIN']));

// 🏢 Property & Unit Management
router.post('/properties', adminController.createProperty);
router.put('/properties/:id', adminController.updateProperty);
router.delete('/properties/:id', adminController.deleteProperty);
router.post('/units', adminController.createUnit);

// 👥 Tenant Management
router.post('/create-tenant', adminController.createTenantAcc);

// 📄 Lease Management
router.post('/leases', adminController.createLease);

// 💳 Payment Management
router.post('/payments/manual', adminController.recordManualPayment);

// 🛠 Maintenance Management
router.put('/maintenance/:id', adminController.updateMaintenanceStatus);

// 📊 Reports & Analytics
router.get('/stats', adminController.getSystemStats);

export default router;
