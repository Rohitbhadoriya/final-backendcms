import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendError } from '../../../utils/response';

export class AuthController {
  async registerDoctor(req: Request, res: Response) {
    try {
      const result = await authService.registerDoctor(req.body);
      res.status(201).json({
        success: true,
        message: 'Doctor registered',
        data: result
      });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
  
  async loginDoctor(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.loginDoctor(email, password);
      sendSuccess(res, result, 'Login successful');
    } catch (error: any) {
      sendError(res, error.message, 401);
    }
  }
  
  async getMe(req: Request, res: Response) {
    try {
      const doctor = await authService.getCurrentDoctor((req as any).doctor.id);
      sendSuccess(res, doctor);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}

export const authController = new AuthController();