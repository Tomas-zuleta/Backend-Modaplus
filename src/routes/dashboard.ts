import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/metrics', authorize('dashboard', 'view'), dashboardController.getMetrics);
router.get('/performance', authorize('dashboard', 'view'), dashboardController.getPerformanceIndicators);

export default router;
