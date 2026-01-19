import express from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { protect } from '../../../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/today', dashboardController.getTodayStats.bind(dashboardController));
router.get('/weekly', dashboardController.getWeeklyStats.bind(dashboardController));

export default router;