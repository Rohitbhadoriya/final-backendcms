// import { Request, Response } from 'express';
// import { masterService } from '../services/master.service';
// import { sendSuccess, sendError } from '../../../utils/response';

// export class MasterController {
//   async getList(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { type } = req.params;
//       const items = await masterService.getList(type, doctorId);
//       sendSuccess(res, items);
//     } catch (error: any) {
//       sendError(res, error.message);
//     }
//   }
  
//   async addItem(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { type } = req.params;
//       const { name } = req.body;
//       const item = await masterService.addItem(type, name, doctorId);
//       res.status(201).json({
//         success: true,
//         message: 'Item added',
//         data: item
//       });
//     } catch (error: any) {
//       sendError(res, error.message, 400);
//     }
//   }
  
//   async updateItem(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { type, id } = req.params;
//       const item = await masterService.updateItem(id, type, req.body, doctorId);
//       sendSuccess(res, item, 'Item updated');
//     } catch (error: any) {
//       sendError(res, error.message, 404);
//     }
//   }
  
//   async deleteItem(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { type, id } = req.params;
//       await masterService.deleteItem(id, type, doctorId);
//       sendSuccess(res, null, 'Item deleted');
//     } catch (error: any) {
//       sendError(res, error.message, 404);
//     }
//   }
// }

// export const masterController = new MasterController();












import { Request, Response } from 'express';
import { masterService } from '../services/master.service';
import { sendSuccess, sendError } from '../../../utils/response';

export class MasterController {
  async getList(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { type } = req.params;
      const items = await masterService.getList(type, doctorId);
      sendSuccess(res, items);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
  
  // ✅ CHANGED: Category body से लो
  async addItem(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { type } = req.params;
      const { name, category = 'other' } = req.body; // ✅ Category लो (default 'other')
      
      const item = await masterService.addItem(type, name, doctorId, category);
      
      res.status(201).json({
        success: true,
        message: 'Item added',
        data: item
      });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
  
  async updateItem(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { type, id } = req.params;
      const item = await masterService.updateItem(id, type, req.body, doctorId);
      sendSuccess(res, item, 'Item updated');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }
  
  async deleteItem(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { type, id } = req.params;
      await masterService.deleteItem(id, type, doctorId);
      sendSuccess(res, null, 'Item deleted');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }
  
  // ✅ NEW: Get items by category
  async getByCategory(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { type, category } = req.params;
      const items = await masterService.getByCategory(type, category, doctorId);
      sendSuccess(res, items);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}

export const masterController = new MasterController();