// import { appointmentRepository } from '../repositories/appointment.repository';

// export class AppointmentService {
//   async createAppointment(data: any) {
//     const queueNumber = await appointmentRepository.getNextQueueNumber(data.doctorId);
    
//     const appointmentData = {
//       ...data,
//       queueNumber,
//       date: new Date()
//     };
    
//     return await appointmentRepository.create(appointmentData);
//   }
  
//   async getTodayAppointments(doctorId: string) {
//     return await appointmentRepository.getTodayAppointments(doctorId);
//   }
  
//   async getQueue(doctorId: string) {
//     return await appointmentRepository.getQueue(doctorId);
//   }
  
//   async updateStatus(id: string, status: string, doctorId: string) {
//     const appointment = await appointmentRepository.updateStatus(id, status, doctorId);
//     if (!appointment) throw new Error('Appointment not found');
//     return appointment;
//   }
  
//   async callNextPatient(doctorId: string) {
//     const nextPatient = await appointmentRepository.getNextPatient(doctorId);
//     if (!nextPatient) throw new Error('No patients in queue');
    
//     await this.updateStatus(nextPatient._id.toString(), 'consulting', doctorId);
//     return nextPatient;
//   }
// }

// export const appointmentService = new AppointmentService();







// import { appointmentRepository } from '../repositories/appointment.repository';

// export class AppointmentService {
//   async createAppointment(data: any) {
//     const queueNumber = await appointmentRepository.getNextQueueNumber(data.doctorId);
    
//     const appointmentData = {
//       ...data,
//       queueNumber,
//       date: new Date()
//     };
    
//     return await appointmentRepository.create(appointmentData);
//   }
  
//   async getTodayAppointments(doctorId: string) {
//     return await appointmentRepository.getTodayAppointments(doctorId);
//   }
  
//   async getQueue(doctorId: string) {
//     return await appointmentRepository.getQueue(doctorId);
//   }
  
//   async updateStatus(id: string, status: string, doctorId: string) {
//     const appointment = await appointmentRepository.updateStatus(id, status, doctorId);
//     if (!appointment) throw new Error('Appointment not found');
//     return appointment;
//   }
  
//   async callNextPatient(doctorId: string) {
//     const nextPatient = await appointmentRepository.getNextPatient(doctorId);
//     if (!nextPatient) throw new Error('No patients in queue');
    
//     await this.updateStatus(nextPatient._id.toString(), 'consulting', doctorId);
//     return nextPatient;
//   }

//   // ✅ NEW METHOD: Get all appointments including completed
//   async getAllTodayAppointments(doctorId: string) {
//     return await appointmentRepository.getAllTodayAppointments(doctorId);
//   }
// }






// export const appointmentService = new AppointmentService();









// import { appointmentRepository } from '../repositories/appointment.repository';
// import { Appointment } from '../models/appointment.model'; 
// import { Patient } from '../../patient/models/patient.model';

// export class AppointmentService {
//   async createAppointment(data: any) {
//     const queueNumber = await appointmentRepository.getNextQueueNumber(data.doctorId);
    
//     const appointmentData = {
//       ...data,
//       queueNumber,
//       date: new Date()
//     };
    
//     return await appointmentRepository.create(appointmentData);
//   }
  
//   async getTodayAppointments(doctorId: string) {
//     return await appointmentRepository.getTodayAppointments(doctorId);
//   }
  
//   async getQueue(doctorId: string) {
//     return await appointmentRepository.getQueue(doctorId);
//   }
  
//   async updateStatus(id: string, status: string, doctorId: string) {
//     const appointment = await appointmentRepository.updateStatus(id, status, doctorId);
//     if (!appointment) throw new Error('Appointment not found');
//     return appointment;
//   }
  
//   async callNextPatient(doctorId: string) {
//     const nextPatient = await appointmentRepository.getNextPatient(doctorId);
//     if (!nextPatient) throw new Error('No patients in queue');
    
//     await this.updateStatus(nextPatient._id.toString(), 'consulting', doctorId);
//     return nextPatient;
//   }

//   async getAllTodayAppointments(doctorId: string) {
//     return await appointmentRepository.getAllTodayAppointments(doctorId);
//   }
  
//   // ✅ NEW: Create follow-up appointment
//   async createFollowupAppointment(patientId: string, doctorId: string) {
//     // 1. Patient data fetch karo
//     const patient = await Patient.findById(patientId);
    
//     if (!patient) {
//       throw new Error('Patient not found');
//     }
    
//     // 2. Patient ka UHID check karo - IMPORTANT!
//     if (!patient.uhid || patient.uhid.trim() === '') {
//       throw new Error('Patient UHID not found. Please register patient first.');
//     }
    
//     // 3. Check karo kya aaj ka appointment already hai
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     const existingAppointments = await appointmentRepository.find({
//       patientId,
//       doctorId,
//       date: { $gte: today, $lt: tomorrow }
//     });
    
//     if (existingAppointments && existingAppointments.length > 0) {
//       throw new Error('Patient already has an appointment for today');
//     }
    
//     // 4. Queue number get karo
//     const queueNumber = await appointmentRepository.getNextQueueNumber(doctorId);
    
//     // 5. Create follow-up appointment - SAME UHID use karo
//     const appointmentData = {
//       patientId,
//       doctorId,
//       uhid: patient.uhid, // ✅ Same UHID as patient
//       date: new Date(),
//       queueNumber,
//       status: 'walkin',
//       visitType: 'followup'
//     };
    
//     return await appointmentRepository.create(appointmentData);
//   }

//   // ✅ MODIFIED: Create OR UPDATE follow-up appointment

  
//   // ✅ NEW: Get today's appointment for a patient
//   async getAppointmentByPatient(patientId: string, doctorId: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     return await appointmentRepository.find({
//       patientId,
//       doctorId,
//       date: { $gte: today, $lt: tomorrow }
//     });
//   }
// }

// export const appointmentService = new AppointmentService();



import { appointmentRepository } from '../repositories/appointment.repository';
import { Appointment } from '../models/appointment.model'; 
import { Patient } from '../../patient/models/patient.model';

export class AppointmentService {
  async createAppointment(data: any) {
    const queueNumber = await appointmentRepository.getNextQueueNumber(data.doctorId);
    
    const appointmentData = {
      ...data,
      queueNumber,
      date: new Date()
    };
    
    return await appointmentRepository.create(appointmentData);
  }
  
  async getTodayAppointments(doctorId: string) {
    return await appointmentRepository.getTodayAppointments(doctorId);
  }
  
  async getQueue(doctorId: string) {
    return await appointmentRepository.getQueue(doctorId);
  }
  
  async updateStatus(id: string, status: string, doctorId: string) {
    const appointment = await appointmentRepository.updateStatus(id, status, doctorId);
    if (!appointment) throw new Error('Appointment not found');
    return appointment;
  }
  
  async callNextPatient(doctorId: string) {
    const nextPatient = await appointmentRepository.getNextPatient(doctorId);
    if (!nextPatient) throw new Error('No patients in queue');
    
    await this.updateStatus(nextPatient._id.toString(), 'consulting', doctorId);
    return nextPatient;
  }

  async getAllTodayAppointments(doctorId: string) {
    return await appointmentRepository.getAllTodayAppointments(doctorId);
  }
  
  // ✅ MODIFIED: Create OR UPDATE follow-up appointment
  async createFollowupAppointment(patientId: string, doctorId: string) {
    // 1. Patient data fetch karo
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    // 2. Patient ka UHID check karo - IMPORTANT!
    if (!patient.uhid || patient.uhid.trim() === '') {
      throw new Error('Patient UHID not found. Please register patient first.');
    }
    
    // 3. Check karo kya aaj ka appointment already hai
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingAppointments = await appointmentRepository.find({
      patientId,
      doctorId,
      date: { $gte: today, $lt: tomorrow }
    });
    
    // ✅ MODIFICATION START
    if (existingAppointments && existingAppointments.length > 0) {
      // Patient ka already appointment hai - UPDATE KARO
      const existingAppointment = existingAppointments[0];
      
      // Update appointment
      const updated = await appointmentRepository.updateStatus(
        existingAppointment._id.toString(),
        'walkin', // Reset to walkin for new consultation
        doctorId
      );
      
      // Also update visit type to followup
      if (updated) {
        await Appointment.findByIdAndUpdate(
          existingAppointment._id,
          { 
            visitType: 'followup',
            updatedAt: new Date()
          }
        );
      }
      
      return updated || existingAppointment;
    }
    // ✅ MODIFICATION END
    
    // 4. Queue number get karo
    const queueNumber = await appointmentRepository.getNextQueueNumber(doctorId);
    
    // 5. Create NEW follow-up appointment
    const appointmentData = {
      patientId,
      doctorId,
      uhid: patient.uhid, // ✅ Same UHID as patient
      date: new Date(),
      queueNumber,
      status: 'walkin',
      visitType: 'followup'
    };
    
    return await appointmentRepository.create(appointmentData);
  }
  
  // ✅ NEW: Get today's appointment for a patient
  async getAppointmentByPatient(patientId: string, doctorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await appointmentRepository.find({
      patientId,
      doctorId,
      date: { $gte: today, $lt: tomorrow }
    });
  }
  
  // ✅ NEW: Get or create appointment for patient
  async getOrCreateAppointment(patientId: string, doctorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check existing appointment
    const existingAppointments = await appointmentRepository.find({
      patientId,
      doctorId,
      date: { $gte: today, $lt: tomorrow }
    });
    
    if (existingAppointments && existingAppointments.length > 0) {
      // Return existing appointment
      return existingAppointments[0];
    }
    
    // Create new appointment
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    if (!patient.uhid || patient.uhid.trim() === '') {
      throw new Error('Patient UHID not found');
    }
    
    const queueNumber = await appointmentRepository.getNextQueueNumber(doctorId);
    
    const appointmentData = {
      patientId,
      doctorId,
      uhid: patient.uhid,
      date: new Date(),
      queueNumber,
      status: 'walkin',
      visitType: 'new' // Default to new, frontend will change if needed
    };
    
    return await appointmentRepository.create(appointmentData);
  }
}

export const appointmentService = new AppointmentService();