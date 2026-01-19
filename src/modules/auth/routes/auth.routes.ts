import express from 'express';
import { authController } from '../controllers/auth.controller';
import { protect } from '../../../middleware/auth';

const router = express.Router();

router.post('/register', authController.registerDoctor.bind(authController));
router.post('/login', authController.loginDoctor.bind(authController));
router.get('/me', protect, authController.getMe.bind(authController));

export default router;