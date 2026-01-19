// import { Request, Response } from 'express';
// import { appointmentService } from '../services/appointment.service';
// import { sendSuccess, sendError } from '../../../utils/response';

// export class AppointmentController {
//   async getTodayAppointments(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const appointments = await appointmentService.getTodayAppointments(doctorId);
//       sendSuccess(res, appointments);
//     } catch (error: any) {
//       sendError(res, error.message);
//     }
//   }
  
//   async getQueue(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const queue = await appointmentService.getQueue(doctorId);
//       sendSuccess(res, queue);
//     } catch (error: any) {
//       sendError(res, error.message);
//     }
//   }
  
//   async updateStatus(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { id } = req.params;
//       const { status } = req.body;
//       const appointment = await appointmentService.updateStatus(id, status, doctorId);
//       sendSuccess(res, appointment, 'Status updated');
//     } catch (error: any) {
//       sendError(res, error.message, 404);
//     }
//   }
  
//   async callNextPatient(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const nextPatient = await appointmentService.callNextPatient(doctorId);
//       sendSuccess(res, nextPatient, 'Next patient called');
//     } catch (error: any) {
//       sendError(res, error.message, 404);
//     }
//   }
// }

// export const appointmentController = new AppointmentController();












// import { Request, Response } from 'express';
// import { appointmentService } from '../services/appointment.service';

// import { sendSuccess, sendError } from '../../../utils/response';

// export class AppointmentController {
//   async getTodayAppointments(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const appointments = await appointmentService.getTodayAppointments(doctorId);
//       sendSuccess(res, appointments);
//     } catch (error: any) {
//       sendError(res, error.message);
//     }
//   }

//   // ✅ NEW CONTROLLER METHOD
//   async getAllTodayAppointments(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const appointments = await appointmentService.getAllTodayAppointments(doctorId);
//       sendSuccess(res, appointments);
//     } catch (error: any) {
//       sendError(res, error.message);
//     }
//   }
  
//   async getQueue(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const queue = await appointmentService.getQueue(doctorId);
//       sendSuccess(res, queue);
//     } catch (error: any) {
//       sendError(res, error.message);
//     }
//   }
  
//   async updateStatus(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const { id } = req.params;
//       const { status } = req.body;
//       const appointment = await appointmentService.updateStatus(id, status, doctorId);
//       sendSuccess(res, appointment, 'Status updated');
//     } catch (error: any) {
//       sendError(res, error.message, 404);
//     }
//   }
  
//   async callNextPatient(req: Request, res: Response) {
//     try {
//       const doctorId = (req as any).doctor.id;
//       const nextPatient = await appointmentService.callNextPatient(doctorId);
//       sendSuccess(res, nextPatient, 'Next patient called');
//     } catch (error: any) {
//       sendError(res, error.message, 404);
//     }
//   }
// }





// export const appointmentController = new AppointmentController();






import { Request, Response } from 'express';
import { appointmentService } from '../services/appointment.service';
import { sendSuccess, sendError } from '../../../utils/response';

export class AppointmentController {
  async getTodayAppointments(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const appointments = await appointmentService.getTodayAppointments(doctorId);
      sendSuccess(res, appointments);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }

  async getAllTodayAppointments(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const appointments = await appointmentService.getAllTodayAppointments(doctorId);
      sendSuccess(res, appointments);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
  
  async getQueue(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const queue = await appointmentService.getQueue(doctorId);
      sendSuccess(res, queue);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
  
  async updateStatus(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { id } = req.params;
      const { status } = req.body;
      const appointment = await appointmentService.updateStatus(id, status, doctorId);
      sendSuccess(res, appointment, 'Status updated');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }
  
  async callNextPatient(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const nextPatient = await appointmentService.callNextPatient(doctorId);
      sendSuccess(res, nextPatient, 'Next patient called');
    } catch (error: any) {
      sendError(res, error.message, 404);
    }
  }
  
  // ✅ NEW: Create follow-up appointment
  async createFollowupAppointment(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { patientId } = req.body;
      
      // Validate
      if (!patientId) {
        return sendError(res, 'Patient ID is required', 400);
      }
      
      const appointment = await appointmentService.createFollowupAppointment(patientId, doctorId);
      sendSuccess(res, appointment, 'Follow-up appointment created');
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
  
  // ✅ NEW: Get today's appointment for a specific patient
  async getAppointmentByPatient(req: Request, res: Response) {
    try {
      const doctorId = (req as any).doctor.id;
      const { patientId } = req.params;
      
      const appointment = await appointmentService.getAppointmentByPatient(patientId, doctorId);
      sendSuccess(res, appointment);
    } catch (error: any) {
      sendError(res, error.message);
    }
  }
}

export const appointmentController = new AppointmentController();








