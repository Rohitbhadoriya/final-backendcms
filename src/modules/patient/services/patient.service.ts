// import { patientRepository } from '../repositories/patient.repository';
// import { generateUHID } from '../../../utils/generators';
// import { appointmentService } from '../../appointment/services/appointment.service';

// export class PatientService {
//   async registerPatient(data: any, doctorId: string) {
//     const count = await patientRepository.countByDoctor(doctorId);
//     const uhid = generateUHID(doctorId, count + 1);
    
//     const patientData = {
//       ...data,
//       uhid,
//       doctorId
//     };
    
//     const patient = await patientRepository.create(patientData);
    
//     // Fix: Cast patient to any to access _id
//     const patientObj = patient as any;
    
//     // Create appointment
//     const appointment = await appointmentService.createAppointment({
//       patientId: patientObj._id,
//       doctorId,
//       uhid,
//       visitType: 'new'
//     });
    
//     return { patient: patientObj, appointment };
//   }
  
//   async searchPatient(query: string, doctorId: string) {
//     return await patientRepository.search(query, doctorId);
//   }
  
//   async getPatientByUHID(uhid: string, doctorId: string) {
//     const patient = await patientRepository.findByUHID(uhid, doctorId);
//     if (!patient) throw new Error('Patient not found');
//     return patient;
//   }
  
//   async getPatientHistory(uhid: string, doctorId: string) {
//     const patient = await patientRepository.getPatientHistory(uhid, doctorId);
//     if (!patient) throw new Error('Patient not found');
//     return patient;
//   }
// }

// export const patientService = new PatientService();






// import { patientRepository } from '../repositories/patient.repository';
// import { generateUHID } from '../../../utils/generators';
// import { appointmentService } from '../../appointment/services/appointment.service';

// export class PatientService {
//   async registerPatient(data: any, doctorId: string) {
//     const count = await patientRepository.countByDoctor(doctorId);
//     const uhid = generateUHID(doctorId, count + 1);
    
//     const patientData = {
//       ...data,
//       uhid,
//       doctorId
//     };
    
//     const patient = await patientRepository.create(patientData);
    
//     const patientObj = patient as any;
    
//     // Create appointment
//     const appointment = await appointmentService.createAppointment({
//       patientId: patientObj._id,
//       doctorId,
//       uhid,
//       visitType: 'new'
//     });
    
//     return { patient: patientObj, appointment };
//   }
  
//   async searchPatient(query: string, doctorId: string) {
//     const patient = await patientRepository.search(query, doctorId);
    
//     // ✅ NEW: Check previous prescriptions
//     if (patient) {
//       const prescriptionService = await import('../../prescription/services/prescription.service');
//       const previousPrescriptions = await prescriptionService.prescriptionService.getPatientPrescriptions(
//         patient.uhid, 
//         doctorId
//       );
      
//       return {
//         ...patient.toObject(),
//         hasPrevious: previousPrescriptions.length > 0,
//         previousVisitCount: previousPrescriptions.length,
//         lastVisit: previousPrescriptions[0]?.createdAt || null
//       };
//     }
    
//     return null;
//   }
  
//   async getPatientByUHID(uhid: string, doctorId: string) {
//     const patient = await patientRepository.findByUHID(uhid, doctorId);
//     if (!patient) throw new Error('Patient not found');
//     return patient;
//   }
  
//   async getPatientHistory(uhid: string, doctorId: string) {
//     const patient = await patientRepository.getPatientHistory(uhid, doctorId);
//     if (!patient) throw new Error('Patient not found');
//     return patient;
//   }
// }

// export const patientService = new PatientService();











// import { patientRepository } from '../repositories/patient.repository';
// import { generateUHID } from '../../../utils/generators';
// import { appointmentService } from '../../appointment/services/appointment.service';

// export class PatientService {
//   async registerPatient(data: any, doctorId: string) {
//     const count = await patientRepository.countByDoctor(doctorId);
//     const uhid = generateUHID(doctorId, count + 1);
    
//     const patientData = {
//       ...data,
//       uhid,
//       doctorId
//     };
    
//     const patient = await patientRepository.create(patientData);
    
//     const patientObj = patient as any;
    
//     // Create appointment
//     const appointment = await appointmentService.createAppointment({
//       patientId: patientObj._id,
//       doctorId,
//       uhid,
//       visitType: 'new'
//     });
    
//     return { patient: patientObj, appointment };
//   }
  
//   async searchPatient(query: string, doctorId: string) {
//     const patient = await patientRepository.search(query, doctorId);
    
//     // ✅ FIXED: Check previous prescriptions
//     if (patient) {
//       try {
//         const prescriptionService = await import('../../prescription/services/prescription.service');
//         const prescriptionsResponse = await prescriptionService.prescriptionService.getPatientPrescriptions(
//           patient.uhid, 
//           doctorId
//         );
        
//         // ✅ FIXED: Access prescriptions array properly
//         const prescriptions = prescriptionsResponse.prescriptions || [];
//         const previousVisitCount = prescriptions.length;
//         const lastVisit = previousVisitCount > 0 ? prescriptions[0]?.createdAt || null : null;
        
//         return {
//           ...patient.toObject(),
//           hasPrevious: previousVisitCount > 0,
//           previousVisitCount,
//           lastVisit,
//           prescriptionCount: previousVisitCount
//         };
        
//       } catch (error) {
//         console.error('Error checking previous prescriptions:', error);
//         // Continue without prescription data
//         return {
//           ...patient.toObject(),
//           hasPrevious: false,
//           previousVisitCount: 0,
//           lastVisit: null,
//           prescriptionCount: 0
//         };
//       }
//     }
    
//     return null;
//   }
  
//   async getPatientByUHID(uhid: string, doctorId: string) {
//     const patient = await patientRepository.findByUHID(uhid, doctorId);
//     if (!patient) throw new Error('Patient not found');
//     return patient;
//   }
  
//   async getPatientHistory(uhid: string, doctorId: string) {
//     const patient = await patientRepository.getPatientHistory(uhid, doctorId);
//     if (!patient) throw new Error('Patient not found');
//     return patient;
//   }
  
//   // ✅ NEW: Get patient with prescriptions
//   async getPatientWithPrescriptions(uhid: string, doctorId: string) {
//     const patient = await patientRepository.findByUHID(uhid, doctorId);
//     if (!patient) throw new Error('Patient not found');
    
//     try {
//       const prescriptionService = await import('../../prescription/services/prescription.service');
//       const prescriptionsResponse = await prescriptionService.prescriptionService.getPatientPrescriptions(
//         uhid, 
//         doctorId
//       );
      
//       return {
//         patient: patient.toObject(),
//         prescriptions: prescriptionsResponse.prescriptions || [],
//         prescriptionCount: prescriptionsResponse.prescriptions?.length || 0,
//         hasPrevious: (prescriptionsResponse.prescriptions?.length || 0) > 0
//       };
      
//     } catch (error) {
//       console.error('Error fetching prescriptions:', error);
//       return {
//         patient: patient.toObject(),
//         prescriptions: [],
//         prescriptionCount: 0,
//         hasPrevious: false
//       };
//     }
//   }
  
//   // ✅ NEW: Get patient's last prescription
//   async getPatientLastPrescription(uhid: string, doctorId: string) {
//     try {
//       const prescriptionService = await import('../../prescription/services/prescription.service');
//       const lastPrescriptionResponse = await prescriptionService.prescriptionService.getLastPrescription(
//         uhid, 
//         doctorId
//       );
      
//       return {
//         success: true,
//         lastPrescription: lastPrescriptionResponse.lastPrescription,
//         hasPrevious: lastPrescriptionResponse.hasPrevious,
//         lastVisitDate: lastPrescriptionResponse.lastVisitDate,
//         message: lastPrescriptionResponse.message
//       };
      
//     } catch (error) {
//       console.error('Error fetching last prescription:', error);
//       return {
//         success: false,
//         lastPrescription: null,
//         hasPrevious: false,
//         message: 'Failed to fetch last prescription'
//       };
//     }
//   }
// }

// export const patientService = new PatientService();




import { patientRepository } from '../repositories/patient.repository';
import { generateUHID } from '../../../utils/generators';
import { appointmentService } from '../../appointment/services/appointment.service';

export class PatientService {
  async registerPatient(data: any, doctorId: string) {
    const count = await patientRepository.countByDoctor(doctorId);
    const uhid = generateUHID();
    
    const patientData = {
      ...data,
      uhid,
      doctorId
    };
    
    const patient = await patientRepository.create(patientData);
    
    const patientObj = patient as any;
    
    // Create appointment
    const appointment = await appointmentService.createAppointment({
      patientId: patientObj._id,
      doctorId,
      uhid,
      visitType: 'new'
    });
    
    return { patient: patientObj, appointment };
  }
  
  async searchPatient(query: string, doctorId: string) {
    const patient = await patientRepository.search(query, doctorId);
    
    // ✅ FIXED: Check previous prescriptions
    if (patient) {
      try {
        const prescriptionService = await import('../../prescription/services/prescription.service');
        const prescriptionsResponse = await prescriptionService.prescriptionService.getPatientPrescriptions(
          patient.uhid, 
          doctorId
        );
        
        // ✅ FIXED: Access prescriptions array properly
        const prescriptions = prescriptionsResponse.prescriptions || [];
        const previousVisitCount = prescriptions.length;
        const lastVisit = previousVisitCount > 0 ? prescriptions[0]?.createdAt || null : null;
        
        return {
          ...patient.toObject(),
          hasPrevious: previousVisitCount > 0,
          previousVisitCount,
          lastVisit,
          prescriptionCount: previousVisitCount
        };
        
      } catch (error) {
        console.error('Error checking previous prescriptions:', error);
        // Continue without prescription data
        return {
          ...patient.toObject(),
          hasPrevious: false,
          previousVisitCount: 0,
          lastVisit: null,
          prescriptionCount: 0
        };
      }
    }
    
    return null;
  }
  
  async getPatientByUHID(uhid: string, doctorId: string) {
    const patient = await patientRepository.findByUHID(uhid, doctorId);
    if (!patient) throw new Error('Patient not found');
    return patient;
  }
  
  async getPatientHistory(uhid: string, doctorId: string) {
    const patient = await patientRepository.getPatientHistory(uhid, doctorId);
    if (!patient) throw new Error('Patient not found');
    return patient;
  }
  
  // ✅ NEW: Get patient by ID (REQUIRED for prescription page)
  async getPatientById(id: string, doctorId: string) {
    const patient = await patientRepository.findById(id, doctorId);
    
    if (!patient) {
      throw new Error('Patient not found');
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
      const lastVisit = previousVisitCount > 0 ? prescriptions[0]?.createdAt || null : null;
      
      return {
        ...patient.toObject(),
        hasPrevious: previousVisitCount > 0,
        previousVisitCount,
        prescriptionCount: previousVisitCount,
        lastVisit,
        isFollowupCandidate: previousVisitCount > 0
      };
      
    } catch (error) {
      console.error('Error checking prescriptions:', error);
      // Return patient without prescription data
      return {
        ...patient.toObject(),
        hasPrevious: false,
        previousVisitCount: 0,
        prescriptionCount: 0,
        lastVisit: null,
        isFollowupCandidate: false
      };
    }
  }
  
  // ✅ NEW: Get patient with prescriptions
  async getPatientWithPrescriptions(uhid: string, doctorId: string) {
    const patient = await patientRepository.findByUHID(uhid, doctorId);
    if (!patient) throw new Error('Patient not found');
    
    try {
      const prescriptionService = await import('../../prescription/services/prescription.service');
      const prescriptionsResponse = await prescriptionService.prescriptionService.getPatientPrescriptions(
        uhid, 
        doctorId
      );
      
      return {
        patient: patient.toObject(),
        prescriptions: prescriptionsResponse.prescriptions || [],
        prescriptionCount: prescriptionsResponse.prescriptions?.length || 0,
        hasPrevious: (prescriptionsResponse.prescriptions?.length || 0) > 0
      };
      
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      return {
        patient: patient.toObject(),
        prescriptions: [],
        prescriptionCount: 0,
        hasPrevious: false
      };
    }
  }
  
  // ✅ NEW: Get patient's last prescription
  async getPatientLastPrescription(uhid: string, doctorId: string) {
    try {
      const prescriptionService = await import('../../prescription/services/prescription.service');
      const lastPrescriptionResponse = await prescriptionService.prescriptionService.getLastPrescription(
        uhid, 
        doctorId
      );
      
      return {
        success: true,
        lastPrescription: lastPrescriptionResponse.lastPrescription,
        hasPrevious: lastPrescriptionResponse.hasPrevious,
        lastVisitDate: lastPrescriptionResponse.lastVisitDate,
        message: lastPrescriptionResponse.message
      };
      
    } catch (error) {
      console.error('Error fetching last prescription:', error);
      return {
        success: false,
        lastPrescription: null,
        hasPrevious: false,
        message: 'Failed to fetch last prescription'
      };
    }
  }
}

export const patientService = new PatientService();







