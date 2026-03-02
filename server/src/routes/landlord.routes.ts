import { Router } from 'express';
import * as landlordController from '../controllers/landlord.controller';
import { authenticateJWT, authorizeRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.use(authorizeRole(['LANDLORD', 'ADMIN']));

router.get('/properties', landlordController.getProperties);
router.get('/revenue-summary', landlordController.getRevenueSummary);

export default router;
