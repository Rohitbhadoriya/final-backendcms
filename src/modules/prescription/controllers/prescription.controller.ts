// import { Request, Response } from 'express';
// import { prescriptionService } from '../services/prescription.service';

// export class PrescriptionController {
  
//   // ✅ Create prescription
//   async createPrescription(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const prescription = await prescriptionService.createPrescription(req.body, doctorId);
      
//       res.status(201).json({
//         success: true,
//         message: 'Prescription saved successfully',
//         data: prescription
//       });
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message || 'Failed to create prescription',
//         error: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     }
//   }
  
//   // ✅ Create complete prescription with invoice
//   async createCompletePrescription(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const result = await prescriptionService.createCompletePrescription(req.body, doctorId);
      
//       res.status(201).json({
//         success: true,
//         message: 'Prescription completed successfully',
//         data: result
//       });
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message || 'Failed to complete prescription',
//         error: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     }
//   }
  
//   // ✅ Get ALL prescriptions
//   async getAllPrescriptions(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { 
//         page = '1', 
//         limit = '20',
//         startDate,
//         endDate,
//         patientName,
//         diagnosis
//       } = req.query;
      
//       const result = await prescriptionService.getAllPrescriptions(
//         doctorId,
//         parseInt(page as string),
//         parseInt(limit as string),
//         startDate as string,
//         endDate as string,
//         patientName as string,
//         diagnosis as string
//       );
      
//       res.status(200).json(result);
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message || 'Failed to get prescriptions',
//         error: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     }
//   }
  
//   // ✅ Get patient's all prescriptions
//   async getPatientPrescriptions(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { uhid } = req.params;
//       const { page = '1', limit = '50' } = req.query;
      
//       const result = await prescriptionService.getPatientPrescriptions(
//         uhid, 
//         doctorId,
//         parseInt(page as string),
//         parseInt(limit as string)
//       );
      
//       res.status(200).json(result);
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message || 'Failed to get patient prescriptions',
//         error: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     }
//   }
  
//   // ✅ Get patient's LAST prescription only
//   async getLastPrescription(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { uhid } = req.params;
      
//       const result = await prescriptionService.getLastPrescription(uhid, doctorId);
      
//       res.status(200).json(result);
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message || 'Failed to get last prescription',
//         error: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     }
//   }
  
//   // ✅ Get today's prescriptions
//   async getTodayPrescriptions(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
      
//       const result = await prescriptionService.getTodayPrescriptions(doctorId);
      
//       res.status(200).json(result);
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message || 'Failed to get today prescriptions',
//         error: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     }
//   }
  
//   // ✅ Get prescription for print
//   async printPrescription(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { id } = req.params;
      
//       const result = await prescriptionService.getPrescriptionForPrint(id, doctorId);
      
//       res.status(200).json(result);
//     } catch (error: any) {
//       res.status(404).json({
//         success: false,
//         message: error.message || 'Prescription not found',
//         error: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     }
//   }
  
//   // ✅ Get dashboard statistics
//   async getDashboardStats(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { period = 'today' } = req.query;
      
//       const result = await prescriptionService.getDashboardStats(
//         doctorId, 
//         period as string
//       );
      
//       res.status(200).json(result);
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message || 'Failed to get dashboard stats',
//         error: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     }
//   }
  
//   // ✅ Search prescriptions
//   async searchPrescriptions(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { 
//         query,
//         type = 'all'
//       } = req.query;
      
//       const result = await prescriptionService.searchPrescriptions(
//         doctorId,
//         query as string,
//         type as string
//       );
      
//       res.status(200).json(result);
//     } catch (error: any) {
//       res.status(400).json({
//         success: false,
//         message: error.message || 'Failed to search prescriptions',
//         error: process.env.NODE_ENV === 'development' ? error.stack : undefined
//       });
//     }
//   }
// }

// export const prescriptionController = new PrescriptionController();
import { Request, Response } from 'express';
import { prescriptionService } from '../services/prescription.service';

export class PrescriptionController {
  
  // ✅ Create prescription
  async createPrescription(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      const prescription = await prescriptionService.createPrescription(req.body, doctorId);
      
      res.status(201).json({
        success: true,
        message: 'Prescription saved successfully',
        data: prescription
      });
    } catch (error: any) {
      console.error('Controller Error - createPrescription:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to create prescription',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Create complete prescription (NO INVOICE - fixed)
  async createCompletePrescription(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      const result = await prescriptionService.createCompletePrescription(req.body, doctorId);
      
      res.status(201).json({
        success: true,
        message: 'Prescription completed successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Controller Error - createCompletePrescription:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to complete prescription',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Edit prescription (within 24 hours)
  async editPrescription(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { id } = req.params;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Prescription ID is required'
        });
      }
      
      const result = await prescriptionService.editPrescription(id, req.body, doctorId);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error: any) {
      console.error('Controller Error - editPrescription:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 
                         error.message.includes('Cannot edit') ? 403 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to edit prescription',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Edit medicines only (Most common requirement)
  async editMedicines(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { id } = req.params;
      const { medicines, reason } = req.body;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Prescription ID is required'
        });
      }
      
      if (!medicines || !Array.isArray(medicines)) {
        return res.status(400).json({
          success: false,
          message: 'Valid medicines array is required'
        });
      }
      
      const result = await prescriptionService.editMedicinesOnly(id, medicines, doctorId, reason);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error: any) {
      console.error('Controller Error - editMedicines:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 
                         error.message.includes('Cannot edit') ? 403 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to edit medicines',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Create correction prescription (After 24 hours)
  async createCorrectionPrescription(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { id } = req.params;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Original prescription ID is required'
        });
      }
      
      const result = await prescriptionService.createCorrectionPrescription(id, req.body, doctorId);
      
      res.status(201).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error: any) {
      console.error('Controller Error - createCorrectionPrescription:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to create correction prescription',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Get edit history of a prescription
  async getEditHistory(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { id } = req.params;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Prescription ID is required'
        });
      }
      
      const result = await prescriptionService.getEditHistory(id, doctorId);
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - getEditHistory:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to get edit history',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Get ALL prescriptions with pagination and filters
  async getAllPrescriptions(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { 
        page = '1', 
        limit = '20',
        startDate,
        endDate,
        patientName,
        diagnosis,
        isPaid,
        visitType
      } = req.query;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      // Parse page and limit with validation
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
      
      const result = await prescriptionService.getAllPrescriptions(
        doctorId,
        pageNum,
        limitNum,
        startDate as string,
        endDate as string,
        patientName as string,
        diagnosis as string
      );
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - getAllPrescriptions:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get prescriptions',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Get patient's all prescriptions with pagination
  async getPatientPrescriptions(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { uhid } = req.params;
      const { page = '1', limit = '50' } = req.query;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      if (!uhid) {
        return res.status(400).json({
          success: false,
          message: 'Patient UHID is required'
        });
      }
      
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 50));
      
      const result = await prescriptionService.getPatientPrescriptions(
        uhid, 
        doctorId,
        pageNum,
        limitNum
      );
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - getPatientPrescriptions:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to get patient prescriptions',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Get patient's LAST prescription only
  async getLastPrescription(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { uhid } = req.params;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      if (!uhid) {
        return res.status(400).json({
          success: false,
          message: 'Patient UHID is required'
        });
      }
      
      const result = await prescriptionService.getLastPrescription(uhid, doctorId);
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - getLastPrescription:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to get last prescription',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Get today's prescriptions
  async getTodayPrescriptions(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      const result = await prescriptionService.getTodayPrescriptions(doctorId);
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - getTodayPrescriptions:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get today prescriptions',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Get prescription for print
  async printPrescription(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { id } = req.params;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Prescription ID is required'
        });
      }
      
      const result = await prescriptionService.getPrescriptionForPrint(id, doctorId);
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - printPrescription:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to get prescription for print',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Get dashboard statistics
  async getDashboardStats(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { period = 'today' } = req.query;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      const result = await prescriptionService.getDashboardStats(
        doctorId, 
        period as string
      );
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - getDashboardStats:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get dashboard stats',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ NEW: Get today's collection report
  async getTodayCollection(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      const result = await prescriptionService.getTodayCollection(doctorId);
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - getTodayCollection:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get today collection',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ NEW: Get week collection report
  async getWeekCollection(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      const result = await prescriptionService.getWeekCollection(doctorId);
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - getWeekCollection:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get week collection',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ NEW: Get month collection report
  async getMonthCollection(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      const result = await prescriptionService.getMonthCollection(doctorId);
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - getMonthCollection:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get month collection',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ NEW: Mark prescription as paid
  async markPrescriptionAsPaid(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { id } = req.params;
      const { paymentMethod, notes } = req.body;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Prescription ID is required'
        });
      }
      
      if (!paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Payment method is required'
        });
      }
      
      const result = await prescriptionService.markPrescriptionAsPaid(
        id, 
        { paymentMethod, notes }, 
        doctorId
      );
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error: any) {
      console.error('Controller Error - markPrescriptionAsPaid:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 
                         error.message.includes('already paid') ? 409 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to mark prescription as paid',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ NEW: Get prescription statistics
  async getPrescriptionStats(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { startDate, endDate } = req.query;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      const result = await prescriptionService.getPrescriptionStats(
        doctorId,
        startDate as string,
        endDate as string
      );
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - getPrescriptionStats:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to get prescription statistics',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ Search prescriptions
  async searchPrescriptions(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { 
        query,
        type = 'all'
      } = req.query;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      if (!query || (query as string).trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }
      
      const result = await prescriptionService.searchPrescriptions(
        doctorId,
        query as string,
        type as string
      );
      
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Controller Error - searchPrescriptions:', error);
      
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to search prescriptions',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ NEW: Get prescription by ID
  async getPrescriptionById(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor?.id;
      const { id } = req.params;
      
      if (!doctorId) {
        return res.status(401).json({
          success: false,
          message: 'Doctor authentication required'
        });
      }
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Prescription ID is required'
        });
      }
      
      // Using service layer (need to add this method in service)
      const prescription = await prescriptionService.getPrescriptionForPrint(id, doctorId);
      
      res.status(200).json({
        success: true,
        data: prescription
      });
    } catch (error: any) {
      console.error('Controller Error - getPrescriptionById:', error);
      
      const statusCode = error.message.includes('not found') ? 404 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to get prescription',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
  
  // ✅ NEW: Health check endpoint
  async healthCheck(req: Request, res: Response) {
    try {
      res.status(200).json({
        success: true,
        message: 'Prescription controller is working',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Health check failed',
        error: error.message
      });
    }
  }
}

export const prescriptionController = new PrescriptionController();