// import { prescriptionRepository } from '../repositories/prescription.repository';
// import { patientRepository } from '../../patient/repositories/patient.repository';
// import { appointmentService } from '../../appointment/services/appointment.service';
// import { billingService } from '../../billing/services/billing.service';
// import mongoose from 'mongoose';

// export class PrescriptionService {
  
//   // ✅ Create prescription with auto visit type detection
//   async createPrescription(data: any, doctorId: string) {
//     try {
//       // Validate required fields
//       if (!data.uhid) {
//         throw new Error('UHID is required');
//       }
      
//       // Find patient
//       const patient = await patientRepository.findByUHID(data.uhid, doctorId);
      
//       if (!patient) {
//         throw new Error(`Patient with UHID ${data.uhid} not found`);
//       }
      
//       // Check if patient has previous prescriptions
//       const hasPrevious = await prescriptionRepository.hasPreviousPrescriptions(
//         data.uhid, 
//         doctorId
//       );
      
//       // Auto-determine visit type if not provided
//       let visitType = data.visitType;
//       if (!visitType) {
//         visitType = hasPrevious ? 'followup' : 'new';
//       }
      
//       // Auto-adjust consultation fee for follow-up
//       let consultationFee = data.consultationFee || 0;
//       if (visitType === 'followup' && consultationFee === 0) {
//         consultationFee = 150; // Default follow-up fee
//       } else if (visitType === 'new' && consultationFee === 0) {
//         consultationFee = 300; // Default new patient fee
//       }
      
//       // Clean and validate medicines
//       const cleanedMedicines = data.medicines?.map((med: any) => ({
//         name: med.name?.trim(),
//         dosage: med.dosage?.trim(),
//         frequency: this.cleanFrequency(med.frequency),
//         duration: med.duration?.trim(),
//         instructions: med.instructions?.trim(),
//         price: Number(med.price) || 0,
//         isActive: true
//       })).filter((med: any) => med.name && med.dosage) || [];
      
//       // Calculate charges
//       const medicineCharges = cleanedMedicines.reduce(
//         (sum: number, med: any) => sum + (med.price || 0), 
//         0
//       );
      
//       const procedureCharges = data.procedureCharges || 0;
//       const totalAmount = consultationFee + medicineCharges + procedureCharges;
      
//       // Prepare prescription data
//       const prescriptionData = {
//         patientId: patient._id,
//         doctorId: new mongoose.Types.ObjectId(doctorId),
//         uhid: data.uhid.trim(),
//         visitType,
//         clinicalExamination: data.clinicalExamination?.trim(),
//         chiefComplaints: Array.isArray(data.chiefComplaints) 
//           ? data.chiefComplaints.filter(Boolean).map((c: string) => c.trim())
//           : [],
//         diagnosis: Array.isArray(data.diagnosis) 
//           ? data.diagnosis.filter(Boolean).map((d: string) => d.trim())
//           : [],
//         investigations: Array.isArray(data.investigations)
//           ? data.investigations.filter(Boolean).map((i: string) => i.trim())
//           : [],
//         procedures: Array.isArray(data.procedures)
//           ? data.procedures.filter(Boolean).map((p: string) => p.trim())
//           : [],
//         medicines: cleanedMedicines,
//         advice: data.advice?.trim(),
//         followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
//         followUpInstructions: data.followUpInstructions?.trim(),
//         consultationFee,
//         medicineCharges,
//         procedureCharges,
//         totalAmount,
//         isCompleted: data.isCompleted || false,
//         appointmentId: data.appointmentId 
//           ? new mongoose.Types.ObjectId(data.appointmentId)
//           : null,
//         referralDoctor: data.referralDoctor?.trim(),
//         referralReason: data.referralReason?.trim()
//       };
      
//       const prescription = await prescriptionRepository.create(prescriptionData);
      
//       // If completed, update appointment status
//       if (prescriptionData.isCompleted && data.appointmentId) {
//         try {
//           await appointmentService.updateStatus(
//             data.appointmentId, 
//             'completed', 
//             doctorId
//           );
//         } catch (error) {
//           console.error('Failed to update appointment status:', error);
//           // Don't throw error - prescription is saved successfully
//         }
//       }
      
//       return prescription;
      
//     } catch (error: any) {
//       console.error('Error in createPrescription:', error);
//       throw new Error(`Failed to create prescription: ${error.message}`);
//     }
//   }
  
//   // ✅ Clean medicine frequency
//   cleanFrequency(freq: string): string {
//     if (!freq) return 'BD';
    
//     freq = freq.toUpperCase().trim();
    
//     const frequencyMap: { [key: string]: string } = {
//       'OD': 'OD', 'BD': 'BD', 'TDS': 'TDS', 'QID': 'QID', 
//       'SOS': 'SOS', 'HS': 'HS', 'AC': 'AC', 'PC': 'PC',
//       'ONCE': 'OD', 'TWICE': 'BD', 'THRICE': 'TDS', 
//       'FOUR': 'QID', 'BEDTIME': 'HS', 
//       'BEFORE FOOD': 'AC', 'AFTER FOOD': 'PC'
//     };
    
//     // Check direct match
//     if (frequencyMap[freq]) {
//       return frequencyMap[freq];
//     }
    
//     // Check if contains frequency
//     for (const [key, value] of Object.entries(frequencyMap)) {
//       if (freq.includes(`(${key})`) || freq.includes(key)) {
//         return value;
//       }
//     }
    
//     return 'BD'; // Default
//   }
  
//   // ✅ Create complete prescription with invoice
//   async createCompletePrescription(data: any, doctorId: string) {
//     try {
//       // First create prescription
//       const prescriptionData = {
//         ...data,
//         isCompleted: true
//       };
      
//       const prescription = await this.createPrescription(prescriptionData, doctorId) as any;
      
//       // Create invoice if total amount > 0
//       let invoice = null;
//       if (prescription.totalAmount > 0) {
//         try {
//           invoice = await billingService.createInvoice({
//             prescriptionId: prescription._id,
//             patientId: prescription.patientId,
//             doctorId,
//             uhid: prescription.uhid,
//             items: [
//               {
//                 name: `Consultation (${prescription.visitType})`,
//                 amount: prescription.consultationFee,
//                 type: 'consultation'
//               },
//               ...prescription.medicines.map((med: any) => ({
//                 name: `${med.name} - ${med.dosage}`,
//                 amount: med.price || 0,
//                 type: 'medicine'
//               }))
//             ],
//             totalAmount: prescription.totalAmount,
//             consultationFee: prescription.consultationFee,
//             medicineCharges: prescription.medicineCharges,
//             procedureCharges: prescription.procedureCharges || 0
//           });
//         } catch (error) {
//           console.error('Failed to create invoice:', error);
//           // Continue without invoice - prescription is saved
//         }
//       }
      
//       return { 
//         success: true, 
//         prescription, 
//         invoice,
//         message: 'Prescription completed successfully' 
//       };
      
//     } catch (error: any) {
//       console.error('Error in createCompletePrescription:', error);
//       throw new Error(`Failed to complete prescription: ${error.message}`);
//     }
//   }
  
//   // ✅ Get ALL prescriptions with pagination and filters
//   async getAllPrescriptions(
//     doctorId: string, 
//     page: number = 1, 
//     limit: number = 20,
//     startDate?: string,
//     endDate?: string,
//     patientName?: string,
//     diagnosis?: string
//   ) {
//     try {
//       const result = await prescriptionRepository.getAllPrescriptions(
//         doctorId,
//         page,
//         limit,
//         startDate,
//         endDate,
//         patientName,
//         diagnosis
//       );
      
//       return {
//         success: true,
//         ...result,
//         message: result.prescriptions.length > 0 
//           ? `${result.prescriptions.length} prescriptions found` 
//           : 'No prescriptions found'
//       };
      
//     } catch (error: any) {
//       console.error('Error in getAllPrescriptions:', error);
//       throw new Error(`Failed to get all prescriptions: ${error.message}`);
//     }
//   }
  
//   // ✅ Get patient's all prescriptions with pagination
//   async getPatientPrescriptions(
//     uhid: string, 
//     doctorId: string, 
//     page: number = 1, 
//     limit: number = 50
//   ) {
//     try {
//       if (!uhid) {
//         throw new Error('UHID is required');
//       }
      
//       // ✅ FIXED: Using correct method name findByPatient
//       const result = await prescriptionRepository.findByPatient(
//         uhid, 
//         doctorId, 
//         page, 
//         limit
//       );
      
//       return {
//         success: true,
//         ...result,
//         patientUHID: uhid,
//         message: result.prescriptions.length > 0 
//           ? `${result.prescriptions.length} prescriptions found for patient` 
//           : 'No prescriptions found for this patient'
//       };
      
//     } catch (error: any) {
//       console.error('Error in getPatientPrescriptions:', error);
//       throw new Error(`Failed to get patient prescriptions: ${error.message}`);
//     }
//   }
  
//   // ✅ Get patient's LAST prescription only
//   async getLastPrescription(uhid: string, doctorId: string) {
//     try {
//       if (!uhid) {
//         throw new Error('UHID is required');
//       }
      
//       const lastPrescription = await prescriptionRepository.findLastByPatient(
//         uhid, 
//         doctorId
//       );
      
//       if (!lastPrescription) {
//         return {
//           success: true,
//           message: 'No previous prescription found',
//           lastPrescription: null,
//           hasPrevious: false,
//           patientUHID: uhid
//         };
//       }
      
//       return {
//         success: true,
//         lastPrescription,
//         hasPrevious: true,
//         lastVisitDate: lastPrescription.createdAt,
//         lastDiagnosis: lastPrescription.diagnosis || [],
//         lastMedicines: lastPrescription.medicines || [],
//         patientUHID: uhid,
//         message: 'Last prescription found'
//       };
      
//     } catch (error: any) {
//       console.error('Error in getLastPrescription:', error);
//       throw new Error(`Failed to get last prescription: ${error.message}`);
//     }
//   }
  
//   // ✅ Get today's prescriptions
//   async getTodayPrescriptions(doctorId: string) {
//     try {
//       const result = await prescriptionRepository.getTodayPrescriptions(doctorId);
      
//       return {
//         success: true,
//         count: result.length,
//         date: new Date().toISOString().split('T')[0],
//         prescriptions: result,
//         message: result.length > 0 
//           ? `${result.length} prescriptions today` 
//           : 'No prescriptions today'
//       };
      
//     } catch (error: any) {
//       console.error('Error in getTodayPrescriptions:', error);
//       throw new Error(`Failed to get today\'s prescriptions: ${error.message}`);
//     }
//   }
  
//   // ✅ Get prescription for print
//   async getPrescriptionForPrint(id: string, doctorId: string) {
//     try {
//       const prescription = await prescriptionRepository.findById(id, doctorId);
      
//       if (!prescription) {
//         throw new Error('Prescription not found');
//       }
      
//       // Mark as printed
//       await prescriptionRepository.markAsPrinted(id, doctorId);
      
//       // ✅ FIXED: Using patientRepository.findById (now exists)
//       const patient = await patientRepository.findById(
//         prescription.patientId.toString(), 
//         doctorId
//       );
      
//       return {
//         success: true,
//         prescription: {
//           ...prescription.toObject(),
//           patientInfo: patient
//         },
//         printDate: new Date(),
//         printCount: 1,
//         message: 'Prescription ready for print'
//       };
      
//     } catch (error: any) {
//       console.error('Error in getPrescriptionForPrint:', error);
//       throw new Error(`Failed to get prescription for print: ${error.message}`);
//     }
//   }
  
//   // ✅ Get dashboard statistics
//   async getDashboardStats(doctorId: string, period: string = 'today') {
//     try {
//       const stats = await prescriptionRepository.getDashboardStats(doctorId, period);
      
//       return {
//         success: true,
//         period,
//         stats,
//         message: 'Dashboard statistics retrieved'
//       };
      
//     } catch (error: any) {
//       console.error('Error in getDashboardStats:', error);
//       throw new Error(`Failed to get dashboard stats: ${error.message}`);
//     }
//   }
  
//   // ✅ Search prescriptions
//   async searchPrescriptions(
//     doctorId: string, 
//     query?: string, 
//     type: string = 'all'
//   ) {
//     try {
//       if (!query || query.trim() === '') {
//         throw new Error('Search query is required');
//       }
      
//       const results = await prescriptionRepository.searchPrescriptions(
//         doctorId,
//         query.trim(),
//         type
//       );
      
//       return {
//         success: true,
//         query,
//         type,
//         count: results.length,
//         results,
//         message: results.length > 0 
//           ? `${results.length} results found for "${query}"` 
//           : `No results found for "${query}"`
//       };
      
//     } catch (error: any) {
//       console.error('Error in searchPrescriptions:', error);
//       throw new Error(`Failed to search prescriptions: ${error.message}`);
//     }
//   }
  
//   // ✅ Get prescription statistics
//   async getPrescriptionStats(doctorId: string, startDate?: string, endDate?: string) {
//     try {
//       const start = startDate ? new Date(startDate) : undefined;
//       const end = endDate ? new Date(endDate) : undefined;
      
//       const stats = await prescriptionRepository.getDashboardStats(doctorId, 'custom');
      
//       return {
//         success: true,
//         stats,
//         dateRange: {
//           startDate: start?.toISOString().split('T')[0],
//           endDate: end?.toISOString().split('T')[0]
//         }
//       };
      
//     } catch (error: any) {
//       console.error('Error in getPrescriptionStats:', error);
//       throw new Error(`Failed to get prescription stats: ${error.message}`);
//     }
//   }
// }

// export const prescriptionService = new PrescriptionService();


import { prescriptionRepository } from '../repositories/prescription.repository';
import { patientRepository } from '../../patient/repositories/patient.repository';
import { appointmentService } from '../../appointment/services/appointment.service';
import mongoose from 'mongoose';

export class PrescriptionService {
  
  // ✅ Create prescription with auto visit type detection
  async createPrescription(data: any, doctorId: string) {
    try {
      // Validate required fields
      if (!data.uhid) {
        throw new Error('UHID is required');
      }
      
      // Find patient
      const patient = await patientRepository.findByUHID(data.uhid, doctorId);
      
      if (!patient) {
        throw new Error(`Patient with UHID ${data.uhid} not found`);
      }
      
      // Check if patient has previous prescriptions
      const hasPrevious = await prescriptionRepository.hasPreviousPrescriptions(
        data.uhid, 
        doctorId
      );
      
      // Auto-determine visit type if not provided
      let visitType = data.visitType;
      if (!visitType) {
        visitType = hasPrevious ? 'followup' : 'new';
      }
      
      // Auto-adjust consultation fee for follow-up
      let consultationFee = data.consultationFee || 0;
      if (visitType === 'followup' && consultationFee === 0) {
        consultationFee = 150; // Default follow-up fee
      } else if (visitType === 'new' && consultationFee === 0) {
        consultationFee = 300; // Default new patient fee
      }
      
      // Clean and validate medicines (NO PRICE TRACKING)
      const cleanedMedicines = data.medicines?.map((med: any) => ({
        name: med.name?.trim(),
        dosage: med.dosage?.trim(),
        frequency: this.cleanFrequency(med.frequency),
        duration: med.duration?.trim(),
        instructions: med.instructions?.trim(),
        isActive: true
      })).filter((med: any) => med.name && med.dosage) || [];
      
      // Prepare prescription data
      const prescriptionData = {
        patientId: patient._id,
        doctorId: new mongoose.Types.ObjectId(doctorId),
        uhid: data.uhid.trim(),
        visitType,
        clinicalExamination: data.clinicalExamination?.trim(),
        chiefComplaints: Array.isArray(data.chiefComplaints) 
          ? data.chiefComplaints.filter(Boolean).map((c: string) => c.trim())
          : [],
        diagnosis: Array.isArray(data.diagnosis) 
          ? data.diagnosis.filter(Boolean).map((d: string) => d.trim())
          : [],
        investigations: Array.isArray(data.investigations)
          ? data.investigations.filter(Boolean).map((i: string) => i.trim())
          : [],
        procedures: Array.isArray(data.procedures)
          ? data.procedures.filter(Boolean).map((p: string) => p.trim())
          : [],
        medicines: cleanedMedicines,
        advice: data.advice?.trim(),
        followUpDate: data.followUpDate ? new Date(data.followUpDate) : null,
        followUpInstructions: data.followUpInstructions?.trim(),
        consultationFee, // Only doctor fees
        isPaid: data.isPaid || false, // Payment status
        paymentMethod: data.paymentMethod || 'cash', // How patient paid
        isCompleted: data.isCompleted || false,
        appointmentId: data.appointmentId 
          ? new mongoose.Types.ObjectId(data.appointmentId)
          : null,
        referralDoctor: data.referralDoctor?.trim(),
        referralReason: data.referralReason?.trim(),
        isEdited: false,
        correctionPrescriptionId: null
      };
      
      const prescription = await prescriptionRepository.create(prescriptionData);
      
      // If completed, update appointment status
      if (prescriptionData.isCompleted && data.appointmentId) {
        try {
          await appointmentService.updateStatus(
            data.appointmentId, 
            'completed', 
            doctorId
          );
        } catch (error) {
          console.error('Failed to update appointment status:', error);
          // Don't throw error - prescription is saved successfully
        }
      }
      
      return prescription;
      
    } catch (error: any) {
      console.error('Error in createPrescription:', error);
      throw new Error(`Failed to create prescription: ${error.message}`);
    }
  }
  
  // ✅ Clean medicine frequency
  cleanFrequency(freq: string): string {
    if (!freq) return 'BD';
    
    freq = freq.toUpperCase().trim();
    
    const frequencyMap: { [key: string]: string } = {
      'OD': 'OD', 'BD': 'BD', 'TDS': 'TDS', 'QID': 'QID', 
      'SOS': 'SOS', 'HS': 'HS', 'AC': 'AC', 'PC': 'PC',
      'ONCE': 'OD', 'TWICE': 'BD', 'THRICE': 'TDS', 
      'FOUR': 'QID', 'BEDTIME': 'HS', 
      'BEFORE FOOD': 'AC', 'AFTER FOOD': 'PC'
    };
    
    // Check direct match
    if (frequencyMap[freq]) {
      return frequencyMap[freq];
    }
    
    // Check if contains frequency
    for (const [key, value] of Object.entries(frequencyMap)) {
      if (freq.includes(`(${key})`) || freq.includes(key)) {
        return value;
      }
    }
    
    return 'BD'; // Default
  }
  
  // ✅ Create complete prescription (NO INVOICE)
  async createCompletePrescription(data: any, doctorId: string) {
    try {
      // First create prescription
      const prescriptionData = {
        ...data,
        isCompleted: true
      };
      
      const prescription = await this.createPrescription(prescriptionData, doctorId);
      
      return { 
        success: true, 
        prescription,
        message: 'Prescription completed successfully' 
      };
      
    } catch (error: any) {
      console.error('Error in createCompletePrescription:', error);
      throw new Error(`Failed to complete prescription: ${error.message}`);
    }
  }
  
  // ✅ NEW: Edit prescription (within 24 hours) - SIMPLIFIED
  async editPrescription(prescriptionId: string, data: any, doctorId: string) {
    try {
      // 1. Check if prescription exists
      const prescription = await prescriptionRepository.findById(prescriptionId, doctorId);
      
      if (!prescription) {
        throw new Error('Prescription not found');
      }
      
      // 2. Check if within edit time limit (24 hours)
      const prescriptionDate = new Date(prescription.createdAt);
      const currentDate = new Date();
      const hoursDifference = (currentDate.getTime() - prescriptionDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursDifference > 24) {
        throw new Error('Cannot edit prescription after 24 hours. Please create a correction prescription.');
      }
      
      // 3. Check if prescription is already paid
      if (prescription.isPaid) {
        throw new Error('Cannot edit paid prescription');
      }
      
      // 4. Clean medicines if provided (NO PRICE)
      let cleanedMedicines = prescription.medicines;
      if (data.medicines) {
        cleanedMedicines = data.medicines.map((med: any) => ({
          name: med.name?.trim(),
          dosage: med.dosage?.trim(),
          frequency: this.cleanFrequency(med.frequency),
          duration: med.duration?.trim(),
          instructions: med.instructions?.trim(),
          isActive: true
        })).filter((med: any) => med.name && med.dosage);
      }
      
      // 5. Update prescription
      const updateData = {
        ...data,
        medicines: cleanedMedicines,
        consultationFee: data.consultationFee || prescription.consultationFee,
        isEdited: true,
        lastEditedAt: new Date(),
        updatedAt: new Date(),
        editReason: data.editReason || 'Prescription corrected'
      };
      
      const updatedPrescription = await prescriptionRepository.update(
        prescriptionId,
        doctorId,
        updateData
      );
      
      return {
        success: true,
        message: 'Prescription updated successfully',
        prescription: updatedPrescription
      };
      
    } catch (error: any) {
      console.error('Error in editPrescription:', error);
      throw new Error(`Failed to edit prescription: ${error.message}`);
    }
  }
  
  // ✅ NEW: Edit medicines only (Most common requirement)
  async editMedicinesOnly(prescriptionId: string, medicines: any[], doctorId: string, reason?: string) {
    try {
      const prescription = await prescriptionRepository.findById(prescriptionId, doctorId);
      
      if (!prescription) {
        throw new Error('Prescription not found');
      }
      
      // Check time limit (24 hours)
      const prescriptionDate = new Date(prescription.createdAt);
      const currentDate = new Date();
      const hoursDifference = (currentDate.getTime() - prescriptionDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursDifference > 24) {
        throw new Error('Cannot edit medicines after 24 hours. Please create a correction prescription.');
      }
      
      // Check if prescription is paid
      if (prescription.isPaid) {
        throw new Error('Cannot edit medicines in paid prescription');
      }
      
      // Clean and validate medicines (NO PRICE)
      const cleanedMedicines = medicines.map((med: any) => ({
        name: med.name?.trim(),
        dosage: med.dosage?.trim(),
        frequency: this.cleanFrequency(med.frequency),
        duration: med.duration?.trim(),
        instructions: med.instructions?.trim(),
        isActive: true
      })).filter((med: any) => med.name && med.dosage);
      
      // Update prescription
      const updatedPrescription = await prescriptionRepository.updateMedicines(
        prescriptionId,
        doctorId,
        {
          medicines: cleanedMedicines,
          isEdited: true,
          lastEditedAt: new Date(),
          editReason: reason || 'Medicines corrected'
        }
      );
      
      return {
        success: true,
        message: 'Medicines updated successfully',
        prescription: updatedPrescription
      };
      
    } catch (error: any) {
      console.error('Error in editMedicinesOnly:', error);
      throw new Error(`Failed to edit medicines: ${error.message}`);
    }
  }
  
  // ✅ NEW: Create correction prescription (After 24 hours)
  async createCorrectionPrescription(originalPrescriptionId: string, data: any, doctorId: string) {
    try {
      // 1. Get original prescription
      const original = await prescriptionRepository.findById(originalPrescriptionId, doctorId);
      
      if (!original) {
        throw new Error('Original prescription not found');
      }
      
      // 2. Get patient info
      const patient = await patientRepository.findById(original.patientId.toString(), doctorId);
      
      if (!patient) {
        throw new Error('Patient not found');
      }
      
      // 3. Clean medicines for correction (NO PRICE)
      const cleanedMedicines = data.medicines?.map((med: any) => ({
        name: med.name?.trim(),
        dosage: med.dosage?.trim(),
        frequency: this.cleanFrequency(med.frequency),
        duration: med.duration?.trim(),
        instructions: med.instructions?.trim(),
        isActive: true
      })).filter((med: any) => med.name && med.dosage) || [];
      
      // 4. Create correction prescription data
      const correctionData = {
        patientId: original.patientId,
        doctorId: original.doctorId,
        uhid: original.uhid,
        visitType: 'correction',
        clinicalExamination: data.clinicalExamination || original.clinicalExamination,
        chiefComplaints: ['Prescription Correction'],
        diagnosis: data.diagnosis || original.diagnosis,
        investigations: data.investigations || original.investigations,
        procedures: data.procedures || original.procedures,
        medicines: cleanedMedicines,
        advice: data.advice || `Correction to prescription dated ${new Date(original.createdAt).toLocaleDateString()}`,
        followUpDate: data.followUpDate || original.followUpDate,
        followUpInstructions: data.followUpInstructions || original.followUpInstructions,
        consultationFee: 0, // No fee for correction
        isPaid: false,
        isCompleted: true,
        isCorrection: true,
        originalPrescriptionId: original._id,
        correctionReason: data.correctionReason || 'Medicine correction required',
        referralDoctor: data.referralDoctor || original.referralDoctor,
        referralReason: data.referralReason || original.referralReason
      };
      
      // 5. Save correction prescription
      const correctionResult = await prescriptionRepository.create(correctionData);
      
      // Handle the returned value properly
      const correction = Array.isArray(correctionResult) ? correctionResult[0] : correctionResult;
      
      // 6. Mark original as having correction
      await prescriptionRepository.update(originalPrescriptionId, doctorId, {
        hasCorrection: true,
        correctionPrescriptionId: correction._id,
        correctionDate: new Date()
      });
      
      return {
        success: true,
        message: 'Correction prescription created successfully',
        correctionPrescription: correction,
        originalPrescriptionId: original._id
      };
      
    } catch (error: any) {
      console.error('Error in createCorrectionPrescription:', error);
      throw new Error(`Failed to create correction prescription: ${error.message}`);
    }
  }
  
  // ✅ NEW: Get edit history of a prescription
  async getEditHistory(prescriptionId: string, doctorId: string) {
    try {
      const prescription = await prescriptionRepository.findById(prescriptionId, doctorId);
      
      if (!prescription) {
        throw new Error('Prescription not found');
      }
      
      // Check if prescription was edited
      const editInfo = {
        isEdited: prescription.isEdited || false,
        lastEditedAt: prescription.lastEditedAt || null,
        editReason: prescription.editReason || null,
        hasCorrection: prescription.hasCorrection || false,
        correctionPrescriptionId: prescription.correctionPrescriptionId || null
      };
      
      // If has correction, get correction prescription details
      let correctionDetails = null;
      if (prescription.hasCorrection && prescription.correctionPrescriptionId) {
        correctionDetails = await prescriptionRepository.findById(
          prescription.correctionPrescriptionId.toString(),
          doctorId
        );
      }
      
      return {
        success: true,
        prescriptionId,
        prescriptionDetails: {
          uhid: prescription.uhid,
          createdAt: prescription.createdAt,
          ...editInfo
        },
        correctionDetails,
        message: editInfo.isEdited || editInfo.hasCorrection
          ? 'Edit history found'
          : 'No edits made to this prescription'
      };
      
    } catch (error: any) {
      console.error('Error in getEditHistory:', error);
      throw new Error(`Failed to get edit history: ${error.message}`);
    }
  }
  
  // ✅ NEW: Get today's collection
  async getTodayCollection(doctorId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Get today's completed prescriptions
      const prescriptions = await prescriptionRepository.getPrescriptionsByDateRange(
        doctorId,
        today,
        tomorrow
      );
      
      // Calculate collection
      const totalAmount = prescriptions.reduce((sum, pres) => sum + (pres.consultationFee || 0), 0);
      const paidPrescriptions = prescriptions.filter(pres => pres.isPaid === true);
      const paidAmount = paidPrescriptions.reduce((sum, pres) => sum + (pres.consultationFee || 0), 0);
      const pendingAmount = totalAmount - paidAmount;
      
      // Payment method breakdown
      const cashAmount = paidPrescriptions
        .filter(pres => pres.paymentMethod === 'cash')
        .reduce((sum, pres) => sum + (pres.consultationFee || 0), 0);
      
      const onlineAmount = paidPrescriptions
        .filter(pres => ['card', 'upi', 'online'].includes(pres.paymentMethod || ''))
        .reduce((sum, pres) => sum + (pres.consultationFee || 0), 0);
      
      return {
        success: true,
        date: today.toISOString().split('T')[0],
        totalAmount,
        cashAmount,
        onlineAmount,
        pendingAmount,
        prescriptionCount: prescriptions.length,
        paidPrescriptionCount: paidPrescriptions.length,
        pendingPrescriptionCount: prescriptions.length - paidPrescriptions.length,
        message: 'Today\'s collection retrieved successfully'
      };
      
    } catch (error: any) {
      console.error('Error in getTodayCollection:', error);
      return {
        success: false,
        message: 'Failed to get today\'s collection',
        error: error.message
      };
    }
  }
  
  // ✅ NEW: Get week collection
  async getWeekCollection(doctorId: string) {
    try {
      const today = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);
      
      // Get week's prescriptions
      const prescriptions = await prescriptionRepository.getPrescriptionsByDateRange(
        doctorId,
        weekAgo,
        today
      );
      
      const totalAmount = prescriptions.reduce((sum, pres) => sum + (pres.consultationFee || 0), 0);
      const paidAmount = prescriptions
        .filter(pres => pres.isPaid === true)
        .reduce((sum, pres) => sum + (pres.consultationFee || 0), 0);
      
      return {
        success: true,
        period: 'week',
        totalAmount,
        paidAmount,
        pendingAmount: totalAmount - paidAmount,
        prescriptionCount: prescriptions.length,
        paidPrescriptionCount: prescriptions.filter(pres => pres.isPaid === true).length,
        message: 'Week collection retrieved successfully'
      };
      
    } catch (error: any) {
      console.error('Error in getWeekCollection:', error);
      throw new Error(`Failed to get week collection: ${error.message}`);
    }
  }
  
  // ✅ NEW: Get month collection
  async getMonthCollection(doctorId: string) {
    try {
      const today = new Date();
      const monthAgo = new Date();
      monthAgo.setMonth(today.getMonth() - 1);
      monthAgo.setHours(0, 0, 0, 0);
      
      // Get month's prescriptions
      const prescriptions = await prescriptionRepository.getPrescriptionsByDateRange(
        doctorId,
        monthAgo,
        today
      );
      
      const totalAmount = prescriptions.reduce((sum, pres) => sum + (pres.consultationFee || 0), 0);
      const paidAmount = prescriptions
        .filter(pres => pres.isPaid === true)
        .reduce((sum, pres) => sum + (pres.consultationFee || 0), 0);
      
      return {
        success: true,
        period: 'month',
        totalAmount,
        paidAmount,
        pendingAmount: totalAmount - paidAmount,
        prescriptionCount: prescriptions.length,
        paidPrescriptionCount: prescriptions.filter(pres => pres.isPaid === true).length,
        message: 'Month collection retrieved successfully'
      };
      
    } catch (error: any) {
      console.error('Error in getMonthCollection:', error);
      throw new Error(`Failed to get month collection: ${error.message}`);
    }
  }
  
  // ✅ NEW: Mark prescription as paid
  async markPrescriptionAsPaid(prescriptionId: string, paymentData: any, doctorId: string) {
    try {
      const prescription = await prescriptionRepository.findById(prescriptionId, doctorId);
      
      if (!prescription) {
        throw new Error('Prescription not found');
      }
      
      if (prescription.isPaid) {
        throw new Error('Prescription is already paid');
      }
      
      const updatedPrescription = await prescriptionRepository.update(
        prescriptionId,
        doctorId,
        {
          isPaid: true,
          paymentMethod: paymentData.paymentMethod || 'cash',
          paymentNotes: paymentData.notes,
          updatedAt: new Date()
        }
      );
      
      return {
        success: true,
        message: 'Prescription marked as paid successfully',
        prescription: updatedPrescription
      };
      
    } catch (error: any) {
      console.error('Error in markPrescriptionAsPaid:', error);
      throw new Error(`Failed to mark prescription as paid: ${error.message}`);
    }
  }
  
  // ✅ Get ALL prescriptions with pagination and filters
  async getAllPrescriptions(
    doctorId: string, 
    page: number = 1, 
    limit: number = 20,
    startDate?: string,
    endDate?: string,
    patientName?: string,
    diagnosis?: string
  ) {
    try {
      const result = await prescriptionRepository.getAllPrescriptions(
        doctorId,
        page,
        limit,
        startDate,
        endDate,
        patientName,
        diagnosis
      );
      
      return {
        success: true,
        ...result,
        message: result.prescriptions.length > 0 
          ? `${result.prescriptions.length} prescriptions found` 
          : 'No prescriptions found'
      };
      
    } catch (error: any) {
      console.error('Error in getAllPrescriptions:', error);
      throw new Error(`Failed to get all prescriptions: ${error.message}`);
    }
  }
  
  // ✅ Get patient's all prescriptions with pagination
  async getPatientPrescriptions(
    uhid: string, 
    doctorId: string, 
    page: number = 1, 
    limit: number = 50
  ) {
    try {
      if (!uhid) {
        throw new Error('UHID is required');
      }
      
      const result = await prescriptionRepository.findByPatient(
        uhid, 
        doctorId, 
        page, 
        limit
      );
      
      return {
        success: true,
        ...result,
        patientUHID: uhid,
        message: result.prescriptions.length > 0 
          ? `${result.prescriptions.length} prescriptions found for patient` 
          : 'No prescriptions found for this patient'
      };
      
    } catch (error: any) {
      console.error('Error in getPatientPrescriptions:', error);
      throw new Error(`Failed to get patient prescriptions: ${error.message}`);
    }
  }
  
  // ✅ Get patient's LAST prescription only
  async getLastPrescription(uhid: string, doctorId: string) {
    try {
      if (!uhid) {
        throw new Error('UHID is required');
      }
      
      const lastPrescription = await prescriptionRepository.findLastByPatient(
        uhid, 
        doctorId
      );
      
      if (!lastPrescription) {
        return {
          success: true,
          message: 'No previous prescription found',
          lastPrescription: null,
          hasPrevious: false,
          patientUHID: uhid
        };
      }
      
      return {
        success: true,
        lastPrescription,
        hasPrevious: true,
        lastVisitDate: lastPrescription.createdAt,
        lastDiagnosis: lastPrescription.diagnosis || [],
        lastMedicines: lastPrescription.medicines || [],
        patientUHID: uhid,
        message: 'Last prescription found'
      };
      
    } catch (error: any) {
      console.error('Error in getLastPrescription:', error);
      throw new Error(`Failed to get last prescription: ${error.message}`);
    }
  }
  
  // ✅ Get today's prescriptions
  async getTodayPrescriptions(doctorId: string) {
    try {
      const result = await prescriptionRepository.getTodayPrescriptions(doctorId);
      
      return {
        success: true,
        count: result.length,
        date: new Date().toISOString().split('T')[0],
        prescriptions: result,
        message: result.length > 0 
          ? `${result.length} prescriptions today` 
          : 'No prescriptions today'
      };
      
    } catch (error: any) {
      console.error('Error in getTodayPrescriptions:', error);
      throw new Error(`Failed to get today\'s prescriptions: ${error.message}`);
    }
  }
  
  // ✅ Get prescription for print - FIXED
  async getPrescriptionForPrint(id: string, doctorId: string) {
    try {
      const prescription = await prescriptionRepository.findById(id, doctorId);
      
      if (!prescription) {
        throw new Error('Prescription not found');
      }
      
      // Mark as printed
      await prescriptionRepository.markAsPrinted(id, doctorId);
      
      const patient = await patientRepository.findById(
        prescription.patientId.toString(), 
        doctorId
      );
      
      return {
        success: true,
        prescription: {
          ...prescription, // ✅ FIXED: Removed .toObject()
          patientInfo: patient
        },
        printDate: new Date(),
        printCount: 1,
        message: 'Prescription ready for print'
      };
      
    } catch (error: any) {
      console.error('Error in getPrescriptionForPrint:', error);
      throw new Error(`Failed to get prescription for print: ${error.message}`);
    }
  }
  
  // ✅ Get dashboard statistics
  async getDashboardStats(doctorId: string, period: string = 'today') {
    try {
      const stats = await prescriptionRepository.getDashboardStats(doctorId, period);
      
      return {
        success: true,
        period,
        stats,
        message: 'Dashboard statistics retrieved'
      };
      
    } catch (error: any) {
      console.error('Error in getDashboardStats:', error);
      throw new Error(`Failed to get dashboard stats: ${error.message}`);
    }
  }
  
  // ✅ Search prescriptions
  async searchPrescriptions(
    doctorId: string, 
    query?: string, 
    type: string = 'all'
  ) {
    try {
      if (!query || query.trim() === '') {
        throw new Error('Search query is required');
      }
      
      const results = await prescriptionRepository.searchPrescriptions(
        doctorId,
        query.trim(),
        type
      );
      
      return {
        success: true,
        query,
        type,
        count: results.length,
        results,
        message: results.length > 0 
          ? `${results.length} results found for "${query}"` 
          : `No results found for "${query}"`
      };
      
    } catch (error: any) {
      console.error('Error in searchPrescriptions:', error);
      throw new Error(`Failed to search prescriptions: ${error.message}`);
    }
  }
  
  // ✅ Get prescription statistics
  async getPrescriptionStats(doctorId: string, startDate?: string, endDate?: string) {
    try {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      
      const stats = await prescriptionRepository.getDashboardStats(doctorId, 'custom');
      
      return {
        success: true,
        stats,
        dateRange: {
          startDate: start?.toISOString().split('T')[0],
          endDate: end?.toISOString().split('T')[0]
        }
      };
      
    } catch (error: any) {
      console.error('Error in getPrescriptionStats:', error);
      throw new Error(`Failed to get prescription stats: ${error.message}`);
    }
  }
}

export const prescriptionService = new PrescriptionService();