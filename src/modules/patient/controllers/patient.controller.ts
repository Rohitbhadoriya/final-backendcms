// import { Request, Response } from 'express';
// import { patientService } from '../services/patient.service';
// import { sendSuccess, sendError } from '../../../utils/response';

// export class PatientController {
//   async registerPatient(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const result = await patientService.registerPatient(req.body, doctorId);
//       res.status(201).json({
//         success: true,
//         message: 'Patient registered',
//         data: result
//       });
//     } catch (error: any) {
//       sendError(res, error.message, 400);
//     }
//   }
  
//   async searchPatient(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { q } = req.query;
//       const patients = await patientService.searchPatient(q as string, doctorId);
//       sendSuccess(res, patients);
//     } catch (error: any) {
//       sendError(res, error.message);
//     }
//   }
  
//   async getPatientByUHID(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { uhid } = req.params;
//       const patient = await patientService.getPatientByUHID(uhid, doctorId);
//       sendSuccess(res, patient);
//     } catch (error: any) {
//       sendError(res, error.message, 404);
//     }
//   }
  
//   async getPatientHistory(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { uhid } = req.params;
//       const patient = await patientService.getPatientHistory(uhid, doctorId);
//       sendSuccess(res, patient);
//     } catch (error: any) {
//       sendError(res, error.message, 404);
//     }
//   }
// }

// export const patientController = new PatientController();





// import { Request, Response } from 'express';
// import { patientService } from '../services/patient.service';
// import { sendSuccess, sendError } from '../../../utils/response';

// export class PatientController {
//   async registerPatient(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const result = await patientService.registerPatient(req.body, doctorId);
//       res.status(201).json({
//         success: true,
//         message: 'Patient registered',
//         data: result
//       });
//     } catch (error: any) {
//       sendError(res, error.message, 400);
//     }
//   }
  
//   // Existing search (with query params)
//   async searchPatient(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { q } = req.query;
//       const patients = await patientService.searchPatient(q as string, doctorId);
//       sendSuccess(res, patients);
//     } catch (error: any) {
//       sendError(res, error.message);
//     }
//   }
  
//   // ✅ NEW: Direct search (with route params)
//   async searchPatientDirect(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { query } = req.params;
//       const patient = await patientService.searchPatient(query, doctorId);
      
//       if (patient) {
//         res.json({
//           success: true,
//           data: patient
//         });
//       } else {
//         res.json({
//           success: false,
//           message: 'Patient not found'
//         });
//       }
//     } catch (error: any) {
//       sendError(res, error.message);
//     }
//   }
  
//   async getPatientByUHID(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { uhid } = req.params;
//       const patient = await patientService.getPatientByUHID(uhid, doctorId);
//       sendSuccess(res, patient);
//     } catch (error: any) {
//       sendError(res, error.message, 404);
//     }
//   }
  
//   async getPatientHistory(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { uhid } = req.params;
//       const patient = await patientService.getPatientHistory(uhid, doctorId);
//       sendSuccess(res, patient);
//     } catch (error: any) {
//       sendError(res, error.message, 404);
//     }
//   }
// }

// export const patientController = new PatientController();






import { Request, Response } from 'express';
import { patientService } from '../services/patient.service';
import { patientRepository } from '../repositories/patient.repository';
import { sendSuccess, sendError } from '../../../utils/response';

export class PatientController {
  async registerPatient(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const result = await patientService.registerPatient(req.body, doctorId);
      res.status(201).json({
        success: true,
        message: 'Patient registered',
        data: result
      });
    } catch (error: any) {
      sendError(res, error.message, 400);
    }
  }
  
  // Existing search (with query params)
  async searchPatient(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { q } = req.query;
      const patients = await patientService.searchPatient(q as string, doctorId);
      sendSuccess(res, patients);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
  
  // ✅ NEW: Direct search (with route params)
  async searchPatientDirect(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { query } = req.params;
      const patient = await patientService.searchPatient(query, doctorId);
      
      if (patient) {
        res.json({
          success: true,
          data: patient
        });
      } else {
        res.json({
          success: false,
          message: 'Patient not found'
        });
      }
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
  
  async getPatientByUHID(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { uhid } = req.params;
      const patient = await patientService.getPatientByUHID(uhid, doctorId);
      sendSuccess(res, patient);
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }
  
  async getPatientHistory(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { uhid } = req.params;
      const patient = await patientService.getPatientHistory(uhid, doctorId);
      sendSuccess(res, patient);
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }
  
  // ✅ NEW: Get patient by ID
  async getPatientById(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { id } = req.params;
      
      // Use the repository method
      const patient = await patientRepository.findById(id, doctorId);
      
      if (!patient) {
        return res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      }
      
      // Check previous prescriptions
      try {
        const prescriptionService = await import('../../prescription/services/prescription.service');
        const prescriptionsResponse = await prescriptionService.prescriptionService.getPatientPrescriptions(
          patient.uhid, 
          doctorId
        );
        
        const prescriptions = prescriptionsResponse.prescriptions || [];
        const previousVisitCount = prescriptions.length;
        
        const patientWithHistory = {
          ...patient.toObject(),
          hasPrevious: previousVisitCount > 0,
          previousVisitCount,
          prescriptionCount: previousVisitCount,
          lastVisit: previousVisitCount > 0 ? prescriptions[0]?.createdAt || null : null
        };
        
        return res.status(200).json({
          success: true,
          data: patientWithHistory
        });
        
      } catch (prescriptionError) {
        console.error('Error fetching prescriptions:', prescriptionError);
        // Return patient without prescription data
        return res.status(200).json({
          success: true,
          data: {
            ...patient.toObject(),
            hasPrevious: false,
            previousVisitCount: 0,
            prescriptionCount: 0
          }
        });
      }
      
    } catch (error: any) {
      console.error('Error in getPatientById:', error);
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to fetch patient'
      });
    }
  }
}

export const patientController = new PatientController();