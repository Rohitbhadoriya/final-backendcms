// import { Patient } from '../models/patient.model';

// export class PatientRepository {
//   async create(data: any) {
//     return await Patient.create(data);
//   }
  
//   async findByUHID(uhid: string, doctorId: string) {
//     return await Patient.findOne({ uhid, doctorId });
//   }
  
//   async search(query: string, doctorId: string) {
//     return await Patient.find({
//       doctorId,
//       $or: [
//         { uhid: { $regex: query, $options: 'i' } },
//         { name: { $regex: query, $options: 'i' } }
//       ]
//     }).limit(10);
//   }
  
//   async countByDoctor(doctorId: string) {
//     return await Patient.countDocuments({ doctorId });
//   }
  
//   async getPatientHistory(uhid: string, doctorId: string) {
//     return await Patient.findOne({ uhid, doctorId });
//   }
// }

// export const patientRepository = new PatientRepository();






// import { Patient } from '../models/patient.model';

// export class PatientRepository {
//   async create(data: any) {
//     return await Patient.create(data);
//   }
  
//   async findByUHID(uhid: string, doctorId: string) {
//     return await Patient.findOne({ uhid, doctorId });
//   }
  
//   // ✅ NEW METHOD: Phone se search
//   async findByPhone(phone: string, doctorId: string) {
//     return await Patient.findOne({ mobile: phone, doctorId });
//   }
  
//   // ✅ UPDATED METHOD: Smart search
//   async search(query: string, doctorId: string) {
//     // Pehle UHID se try
//     let patient = await this.findByUHID(query, doctorId);
    
//     // Agar nahi mila, to phone se try
//     if (!patient) {
//       patient = await this.findByPhone(query, doctorId);
//     }
    
//     // Agar phir bhi nahi mila, to name se search
//     if (!patient) {
//       patient = await Patient.findOne({
//         doctorId,
//         name: { $regex: query, $options: 'i' }
//       });
//     }
    
//     return patient;
//   }
  
//   async countByDoctor(doctorId: string) {
//     return await Patient.countDocuments({ doctorId });
//   }
  
//   async getPatientHistory(uhid: string, doctorId: string) {
//     return await Patient.findOne({ uhid, doctorId });
//   }
// }

// export const patientRepository = new PatientRepository();









import { Patient } from '../models/patient.model';
import mongoose from 'mongoose'; // ✅ IMPORTANT: Add this

export class PatientRepository {
  
  // ✅ Create patient
  async create(data: any) {
    return await Patient.create(data);
  }
  
  // ✅ Find by UHID
  async findByUHID(uhid: string, doctorId: string) {
    return await Patient.findOne({ 
      uhid: uhid.trim(),
      doctorId: new mongoose.Types.ObjectId(doctorId) 
    });
  }
  
  // ✅ NEW: Find by ID (REQUIRED for prescription service)
  async findById(id: string, doctorId: string) {
    try {
      return await Patient.findOne({ 
        _id: new mongoose.Types.ObjectId(id), 
        doctorId: new mongoose.Types.ObjectId(doctorId) 
      });
    } catch (error) {
      console.error('Error in findById:', error);
      return null;
    }
  }
  
  // ✅ Find by phone
  async findByPhone(phone: string, doctorId: string) {
    return await Patient.findOne({ 
      mobile: phone.trim(),
      doctorId: new mongoose.Types.ObjectId(doctorId) 
    });
  }
  
  // ✅ Smart search
  async search(query: string, doctorId: string) {
    const cleanQuery = query.trim();
    
    // Pehle UHID se try
    let patient = await this.findByUHID(cleanQuery, doctorId);
    
    // Agar nahi mila, to phone se try
    if (!patient) {
      patient = await this.findByPhone(cleanQuery, doctorId);
    }
    
    // Agar phir bhi nahi mila, to name se search
    if (!patient) {
      patient = await Patient.findOne({
        doctorId: new mongoose.Types.ObjectId(doctorId),
        name: { $regex: cleanQuery, $options: 'i' }
      });
    }
    
    return patient;
  }
  
  // ✅ NEW: Search multiple patients
  async searchPatients(query: string, doctorId: string, limit: number = 20) {
    const searchQuery = {
      doctorId: new mongoose.Types.ObjectId(doctorId),
      $or: [
        { uhid: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { mobile: { $regex: query, $options: 'i' } }
      ]
    };
    
    return await Patient.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
  
  // ✅ Count patients by doctor
  async countByDoctor(doctorId: string) {
    return await Patient.countDocuments({ 
      doctorId: new mongoose.Types.ObjectId(doctorId) 
    });
  }
  
  // ✅ Get patient history
  async getPatientHistory(uhid: string, doctorId: string) {
    return await Patient.findOne({ 
      uhid: uhid.trim(),
      doctorId: new mongoose.Types.ObjectId(doctorId) 
    });
  }
  
  // ✅ NEW: Update patient
  async updatePatient(id: string, doctorId: string, data: any) {
    return await Patient.findOneAndUpdate(
      { 
        _id: new mongoose.Types.ObjectId(id), 
        doctorId: new mongoose.Types.ObjectId(doctorId) 
      },
      data,
      { new: true, runValidators: true }
    );
  }
  
  // ✅ NEW: Get patient with stats
  async getPatientWithStats(uhid: string, doctorId: string) {
    const [patient, prescriptionCount] = await Promise.all([
      Patient.findOne({ 
        uhid: uhid.trim(),
        doctorId: new mongoose.Types.ObjectId(doctorId) 
      }),
      
      mongoose.model('Prescription').countDocuments({
        uhid: uhid.trim(),
        doctorId: new mongoose.Types.ObjectId(doctorId),
        isCompleted: true
      })
    ]);
    
    if (!patient) return null;
    
    return {
      ...patient.toObject(),
      prescriptionCount
    };
  }
}

export const patientRepository = new PatientRepository();