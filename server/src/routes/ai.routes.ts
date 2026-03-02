import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { authenticateJWT as authenticate } from '../middleware/auth';

const router = Router();

// Applying authentication middleware
router.use(authenticate);

// --- AI Communication Hub ---
router.get('/conversations', aiController.getAIConversations);
router.post('/conversations', aiController.createAIConversation);

// --- Rent & Risk ---
router.get('/risk-scores', aiController.getTenantRiskScores);
router.post('/mpesa/stk-push', aiController.initMpesaStkPush);

// --- Maintenance Prediction ---
router.get('/predictions', aiController.getMaintenancePredictions);

// --- Security Alerts ---
router.get('/alerts', aiController.getSecurityAlerts);

// --- Dashboard Aggregated AI Stats ---
router.get('/stats', aiController.getAIDashboardStats);

export default router;
