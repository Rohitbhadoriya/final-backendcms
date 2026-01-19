import { Request, Response } from 'express';
import { billingService } from '../services/billing.service';
import { sendSuccess, sendError } from '../../../utils/response';

export class BillingController {
  async getTodayCollection(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const collection = await billingService.getTodayCollection(doctorId);
      sendSuccess(res, collection);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}

export const billingController = new BillingController();