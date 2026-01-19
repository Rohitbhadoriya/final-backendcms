import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { sendSuccess, sendError } from '../../../utils/response';

export class DashboardController {
  async getTodayStats(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const stats = await dashboardService.getTodayStats(doctorId);
      sendSuccess(res, stats);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
  
  async getWeeklyStats(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const stats = await dashboardService.getWeeklyStats(doctorId);
      sendSuccess(res, stats);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}

export const dashboardController = new DashboardController();