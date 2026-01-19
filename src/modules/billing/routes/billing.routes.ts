import express from 'express';
import { billingController } from '../controllers/billing.controller';
import { protect } from '../../../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/today', billingController.getTodayCollection.bind(billingController));

export default router;