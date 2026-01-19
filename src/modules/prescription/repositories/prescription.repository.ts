// import { Prescription } from '../models/prescription.model';
// import mongoose from 'mongoose';

// export class PrescriptionRepository {
  
//   // ✅ Create new prescription
//   async create(data: any) {
//     return await Prescription.create(data);
//   }
  
//   // ✅ Find by ID with doctor check
//   async findById(id: string, doctorId: string) {
//     return await Prescription.findOne({ 
//       _id: new mongoose.Types.ObjectId(id), 
//       doctorId: new mongoose.Types.ObjectId(doctorId) 
//     }).populate('patientInfo', 'name age gender mobileNumber');
//   }
  
//   // ✅ Find all prescriptions for a patient with pagination
//   async findByPatient(
//     uhid: string, 
//     doctorId: string, 
//     page: number = 1, 
//     limit: number = 50
//   ) {
//     const skip = (page - 1) * limit;
    
//     const [prescriptions, total] = await Promise.all([
//       Prescription.find({ 
//         uhid, 
//         doctorId: new mongoose.Types.ObjectId(doctorId) 
//       })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .populate('patientInfo', 'name age gender mobileNumber')
//       .lean(),
      
//       Prescription.countDocuments({ 
//         uhid, 
//         doctorId: new mongoose.Types.ObjectId(doctorId) 
//       })
//     ]);
    
//     return {
//       prescriptions,
//       total,
//       page,
//       limit,
//       totalPages: Math.ceil(total / limit),
//       hasNextPage: page * limit < total,
//       hasPrevPage: page > 1
//     };
//   }
  
//   // ✅ Get last prescription only
//   async findLastByPatient(uhid: string, doctorId: string) {
//     return await Prescription.findOne({ 
//       uhid, 
//       doctorId: new mongoose.Types.ObjectId(doctorId),
//       isCompleted: true
//     })
//     .sort({ createdAt: -1 })
//     .populate('patientInfo', 'name age gender mobileNumber address')
//     .lean();
//   }
  
//   // ✅ Get today's prescriptions
//   async getTodayPrescriptions(doctorId: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     return await Prescription.aggregate([
//       {
//         $match: {
//           doctorId: new mongoose.Types.ObjectId(doctorId),
//           createdAt: { 
//             $gte: today, 
//             $lt: tomorrow 
//           },
//           // isCompleted: true
//         }
//       },
//       {
//         $lookup: {
//           from: 'patients',
//           localField: 'patientId',
//           foreignField: '_id',
//           as: 'patientData'
//         }
//       },
//       {
//         $unwind: {
//           path: '$patientData',
//           preserveNullAndEmptyArrays: true
//         }
//       },
//       {
//         $addFields: {
//           patientInfo: {
//             $cond: {
//               if: { $ne: ['$patientData', null] },
//               then: {
//                 _id: '$patientData._id',
//                 name: '$patientData.name',
//                 age: '$patientData.age',
//                 gender: '$patientData.gender',
//                 mobileNumber: '$patientData.mobileNumber'
//               },
//               else: null
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           patientData: 0,
//           'medicines.price': 0
//         }
//       },
//       {
//         $sort: { createdAt: -1 }
//       }
//     ]);
//   }
  
//   // ✅ Get ALL prescriptions with filters and pagination
//   async getAllPrescriptions(
//     doctorId: string, 
//     page: number = 1, 
//     limit: number = 20,
//     startDate?: string,
//     endDate?: string,
//     patientName?: string,
//     diagnosis?: string
//   ) {
//     const skip = (page - 1) * limit;
    
//     // Build match query
//     const matchQuery: any = {
//       doctorId: new mongoose.Types.ObjectId(doctorId),
//       isCompleted: true
//     };
    
//     // Add date filter if provided
//     if (startDate && endDate) {
//       const start = new Date(startDate);
//       start.setHours(0, 0, 0, 0);
      
//       const end = new Date(endDate);
//       end.setHours(23, 59, 59, 999);
      
//       matchQuery.createdAt = { $gte: start, $lte: end };
//     }
    
//     // Add diagnosis filter if provided
//     if (diagnosis) {
//       matchQuery.diagnosis = { $regex: diagnosis, $options: 'i' };
//     }
    
//     // First, get all prescriptions with basic filter
//     const [allPrescriptions, total] = await Promise.all([
//       Prescription.find(matchQuery)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .populate('patientInfo', 'name age gender mobileNumber uhid')
//         .lean(),
      
//       Prescription.countDocuments(matchQuery)
//     ]);
    
//     // If patient name filter is provided, filter in memory
//     let filteredPrescriptions = allPrescriptions;
//     if (patientName) {
//       filteredPrescriptions = allPrescriptions.filter((prescription: any) => {
//         const patient = prescription.patientInfo;
//         return patient && patient.name && 
//                patient.name.toLowerCase().includes(patientName.toLowerCase());
//       });
//     }
    
//     return {
//       prescriptions: filteredPrescriptions,
//       total: patientName ? filteredPrescriptions.length : total,
//       page,
//       limit,
//       totalPages: Math.ceil((patientName ? filteredPrescriptions.length : total) / limit),
//       hasNextPage: page * limit < (patientName ? filteredPrescriptions.length : total),
//       hasPrevPage: page > 1,
//       filters: {
//         startDate,
//         endDate,
//         patientName,
//         diagnosis
//       }
//     };
//   }
  
//   // ✅ Check if patient has previous prescriptions
//   async hasPreviousPrescriptions(uhid: string, doctorId: string): Promise<boolean> {
//     const count = await Prescription.countDocuments({
//       uhid,
//       doctorId: new mongoose.Types.ObjectId(doctorId),
//       isCompleted: true
//     });
//     return count > 0;
//   }
  
//   // ✅ Mark prescription as printed
//   async markAsPrinted(id: string, doctorId: string) {
//     return await Prescription.findOneAndUpdate(
//       { 
//         _id: new mongoose.Types.ObjectId(id), 
//         doctorId: new mongoose.Types.ObjectId(doctorId) 
//       },
//       { 
//         isPrinted: true,
//         updatedAt: new Date() 
//       },
//       { new: true }
//     );
//   }
  
//   // ✅ Get dashboard statistics
//   async getDashboardStats(doctorId: string, period: string = 'today') {
//     const now = new Date();
//     let startDate = new Date();
    
//     switch (period) {
//       case 'today':
//         startDate.setHours(0, 0, 0, 0);
//         break;
//       case 'week':
//         startDate.setDate(now.getDate() - 7);
//         break;
//       case 'month':
//         startDate.setMonth(now.getMonth() - 1);
//         break;
//       case 'year':
//         startDate.setFullYear(now.getFullYear() - 1);
//         break;
//       default:
//         startDate.setHours(0, 0, 0, 0);
//     }
    
//     const matchStage = {
//       doctorId: new mongoose.Types.ObjectId(doctorId),
//       isCompleted: true,
//       createdAt: { $gte: startDate }
//     };
    
//     const stats = await Prescription.aggregate([
//       { $match: matchStage },
//       {
//         $facet: {
//           totalStats: [
//             {
//               $group: {
//                 _id: null,
//                 totalPrescriptions: { $sum: 1 },
//                 totalRevenue: { $sum: '$totalAmount' },
//                 totalPatients: { $addToSet: '$patientId' },
//                 newPatients: { 
//                   $sum: { $cond: [{ $eq: ['$visitType', 'new'] }, 1, 0] } 
//                 },
//                 followupPatients: { 
//                   $sum: { $cond: [{ $eq: ['$visitType', 'followup'] }, 1, 0] } 
//                 },
//                 avgConsultationFee: { $avg: '$consultationFee' }
//               }
//             }
//           ],
//           dailyStats: [
//             {
//               $group: {
//                 _id: { 
//                   $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } 
//                 },
//                 count: { $sum: 1 },
//                 revenue: { $sum: '$totalAmount' }
//               }
//             },
//             { $sort: { _id: -1 } },
//             { $limit: 7 }
//           ],
//           topDiagnoses: [
//             { $unwind: '$diagnosis' },
//             {
//               $group: {
//                 _id: '$diagnosis',
//                 count: { $sum: 1 }
//               }
//             },
//             { $sort: { count: -1 } },
//             { $limit: 5 }
//           ],
//           topMedicines: [
//             { $unwind: '$medicines' },
//             {
//               $group: {
//                 _id: '$medicines.name',
//                 count: { $sum: 1 }
//               }
//             },
//             { $sort: { count: -1 } },
//             { $limit: 5 }
//           ]
//         }
//       }
//     ]);
    
//     const result = stats[0];
    
//     return {
//       period,
//       totalPrescriptions: result.totalStats[0]?.totalPrescriptions || 0,
//       totalRevenue: result.totalStats[0]?.totalRevenue || 0,
//       totalPatients: result.totalStats[0]?.totalPatients?.length || 0,
//       newPatients: result.totalStats[0]?.newPatients || 0,
//       followupPatients: result.totalStats[0]?.followupPatients || 0,
//       avgConsultationFee: result.totalStats[0]?.avgConsultationFee 
//         ? Math.round(result.totalStats[0].avgConsultationFee * 100) / 100 
//         : 0,
//       dailyStats: result.dailyStats || [],
//       topDiagnoses: result.topDiagnoses || [],
//       topMedicines: result.topMedicines || []
//     };
//   }
  
//   // ✅ Search prescriptions
//   async searchPrescriptions(doctorId: string, query: string, type: string = 'all') {
//     const searchQuery: any = {
//       doctorId: new mongoose.Types.ObjectId(doctorId),
//       isCompleted: true
//     };
    
//     // Build search based on type
//     if (type === 'patient') {
//       // Search by patient name (need to join with patients collection)
//       const patientSearch = await Prescription.aggregate([
//         {
//           $lookup: {
//             from: 'patients',
//             localField: 'patientId',
//             foreignField: '_id',
//             as: 'patientData'
//           }
//         },
//         { $unwind: '$patientData' },
//         {
//           $match: {
//             'patientData.name': { $regex: query, $options: 'i' },
//             doctorId: new mongoose.Types.ObjectId(doctorId),
//             isCompleted: true
//           }
//         },
//         {
//           $addFields: {
//             patientInfo: {
//               _id: '$patientData._id',
//               name: '$patientData.name',
//               age: '$patientData.age',
//               gender: '$patientData.gender',
//               mobileNumber: '$patientData.mobileNumber',
//               uhid: '$patientData.uhid'
//             }
//           }
//         },
//         { $project: { patientData: 0 } },
//         { $sort: { createdAt: -1 } },
//         { $limit: 50 }
//       ]);
      
//       return patientSearch;
      
//     } else if (type === 'diagnosis') {
//       searchQuery.diagnosis = { $regex: query, $options: 'i' };
//     } else if (type === 'medicine') {
//       searchQuery['medicines.name'] = { $regex: query, $options: 'i' };
//     } else {
//       // Search all fields
//       searchQuery.$or = [
//         { uhid: { $regex: query, $options: 'i' } },
//         { diagnosis: { $regex: query, $options: 'i' } },
//         { 'medicines.name': { $regex: query, $options: 'i' } }
//       ];
//     }
    
//     return await Prescription.find(searchQuery)
//       .sort({ createdAt: -1 })
//       .limit(50)
//       .populate('patientInfo', 'name age gender mobileNumber uhid')
//       .lean();
//   }
// }

// export const prescriptionRepository = new PrescriptionRepository();

import { Prescription } from '../models/prescription.model';
import mongoose from 'mongoose';

export class PrescriptionRepository {
  
  // ✅ Create new prescription
  async create(data: any) {
    try {
      return await Prescription.create(data);
    } catch (error: any) {
      console.error('Error in create:', error);
      throw new Error(`Failed to create prescription: ${error.message}`);
    }
  }
  
  // ✅ Find by ID with doctor check
  async findById(id: string, doctorId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new Error('Invalid ID format');
      }
      
      return await Prescription.findOne({ 
        _id: new mongoose.Types.ObjectId(id), 
        doctorId: new mongoose.Types.ObjectId(doctorId) 
      })
      .populate('patientInfo', 'name age gender mobileNumber uhid')
      .populate('doctorInfo', 'name specialization clinicName')
      .lean();
    } catch (error: any) {
      console.error('Error in findById:', error);
      throw new Error(`Failed to find prescription: ${error.message}`);
    }
  }
  
  // ✅ Update prescription
  async update(prescriptionId: string, doctorId: string, data: any) {
    try {
      if (!mongoose.Types.ObjectId.isValid(prescriptionId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new Error('Invalid ID format');
      }
      
      const updateData = { ...data };
      delete updateData._id; // Prevent ID update
      delete updateData.createdAt; // Prevent creation date change
      
      return await Prescription.findOneAndUpdate(
        { 
          _id: new mongoose.Types.ObjectId(prescriptionId), 
          doctorId: new mongoose.Types.ObjectId(doctorId) 
        },
        { 
          ...updateData,
          updatedAt: new Date()
        },
        { 
          new: true, 
          runValidators: true 
        }
      )
      .populate('patientInfo', 'name age gender mobileNumber uhid')
      .populate('doctorInfo', 'name specialization clinicName')
      .lean();
    } catch (error: any) {
      console.error('Error in update:', error);
      throw new Error(`Failed to update prescription: ${error.message}`);
    }
  }
  
  // ✅ Update medicines only
  async updateMedicines(prescriptionId: string, doctorId: string, data: any) {
    try {
      if (!mongoose.Types.ObjectId.isValid(prescriptionId) || !mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new Error('Invalid ID format');
      }
      
      const updateData: any = {
        $set: {
          medicines: data.medicines,
          isEdited: data.isEdited || true,
          lastEditedAt: data.lastEditedAt || new Date(),
          editReason: data.editReason || 'Medicines updated',
          updatedAt: new Date()
        }
      };
      
      // Add optional fields only if they exist
      if (data.medicineCharges !== undefined) {
        updateData.$set.medicineCharges = data.medicineCharges;
      }
      if (data.totalAmount !== undefined) {
        updateData.$set.totalAmount = data.totalAmount;
      }
      
      return await Prescription.findOneAndUpdate(
        { 
          _id: new mongoose.Types.ObjectId(prescriptionId), 
          doctorId: new mongoose.Types.ObjectId(doctorId) 
        },
        updateData,
        { 
          new: true, 
          runValidators: true 
        }
      )
      .populate('patientInfo', 'name age gender mobileNumber uhid')
      .lean();
    } catch (error: any) {
      console.error('Error in updateMedicines:', error);
      throw new Error(`Failed to update medicines: ${error.message}`);
    }
  }
  
  // ✅ Find all prescriptions for a patient with pagination
  async findByPatient(
    uhid: string, 
    doctorId: string, 
    page: number = 1, 
    limit: number = 50
  ) {
    try {
      if (!uhid || !doctorId) {
        throw new Error('UHID and Doctor ID are required');
      }
      
      const skip = (page - 1) * limit;
      
      const query = { 
        uhid: uhid.trim(), 
        doctorId: new mongoose.Types.ObjectId(doctorId) 
      };
      
      const [prescriptions, total] = await Promise.all([
        Prescription.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('patientInfo', 'name age gender mobileNumber uhid')
          .populate('doctorInfo', 'name specialization clinicName')
          .lean(),
        
        Prescription.countDocuments(query)
      ]);
      
      return {
        prescriptions,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      };
    } catch (error: any) {
      console.error('Error in findByPatient:', error);
      throw new Error(`Failed to find patient prescriptions: ${error.message}`);
    }
  }
  
  // ✅ Get last prescription only
  async findLastByPatient(uhid: string, doctorId: string) {
    try {
      if (!uhid || !doctorId) {
        throw new Error('UHID and Doctor ID are required');
      }
      
      return await Prescription.findOne({ 
        uhid: uhid.trim(), 
        doctorId: new mongoose.Types.ObjectId(doctorId),
        isCompleted: true
      })
      .sort({ createdAt: -1 })
      .populate('patientInfo', 'name age gender mobileNumber uhid address')
      .populate('doctorInfo', 'name specialization clinicName')
      .lean();
    } catch (error: any) {
      console.error('Error in findLastByPatient:', error);
      throw new Error(`Failed to find last prescription: ${error.message}`);
    }
  }
  
  // ✅ Get today's prescriptions
  async getTodayPrescriptions(doctorId: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return await Prescription.aggregate([
        {
          $match: {
            doctorId: new mongoose.Types.ObjectId(doctorId),
            createdAt: { 
              $gte: today, 
              $lt: tomorrow 
            },
          }
        },
        {
          $lookup: {
            from: 'patients',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patientData'
          }
        },
        {
          $unwind: {
            path: '$patientData',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctorData'
          }
        },
        {
          $unwind: {
            path: '$doctorData',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            patientInfo: {
              $cond: {
                if: { $ne: ['$patientData', null] },
                then: {
                  _id: '$patientData._id',
                  name: '$patientData.name',
                  age: '$patientData.age',
                  gender: '$patientData.gender',
                  mobileNumber: '$patientData.mobileNumber',
                  uhid: '$patientData.uhid'
                },
                else: null
              }
            },
            doctorInfo: {
              $cond: {
                if: { $ne: ['$doctorData', null] },
                then: {
                  _id: '$doctorData._id',
                  name: '$doctorData.name',
                  specialization: '$doctorData.specialization',
                  clinicName: '$doctorData.clinicName'
                },
                else: null
              }
            }
          }
        },
        {
          $project: {
            patientData: 0,
            doctorData: 0,
            'medicines.price': 0 // Hide medicine prices if not needed
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]);
    } catch (error: any) {
      console.error('Error in getTodayPrescriptions:', error);
      throw new Error(`Failed to get today's prescriptions: ${error.message}`);
    }
  }
  
  // ✅ Get prescriptions by date range (for collection reports)
  async getPrescriptionsByDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ) {
    try {
      return await Prescription.find({
        doctorId: new mongoose.Types.ObjectId(doctorId),
        createdAt: { 
          $gte: startDate, 
          $lt: endDate 
        },
        isCompleted: true
      })
      .populate('patientInfo', 'name uhid')
      .lean();
    } catch (error: any) {
      console.error('Error in getPrescriptionsByDateRange:', error);
      throw new Error(`Failed to get prescriptions by date range: ${error.message}`);
    }
  }
  
  // ✅ Get ALL prescriptions with filters and pagination
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
      const skip = (page - 1) * limit;
      
      // Build match query
      const matchQuery: any = {
        doctorId: new mongoose.Types.ObjectId(doctorId),
        isCompleted: true
      };
      
      // Add date filter if provided
      if (startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        matchQuery.createdAt = { $gte: start, $lte: end };
      } else if (startDate) {
        // Only start date provided
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        matchQuery.createdAt = { $gte: start };
      } else if (endDate) {
        // Only end date provided
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        matchQuery.createdAt = { $lte: end };
      }
      
      // Add diagnosis filter if provided
      if (diagnosis) {
        matchQuery.diagnosis = { $regex: diagnosis, $options: 'i' };
      }
      
      // First, get all matching prescriptions
      const query = Prescription.find(matchQuery)
        .sort({ createdAt: -1 })
        .populate('patientInfo', 'name age gender mobileNumber uhid')
        .populate('doctorInfo', 'name specialization clinicName');
      
      // Clone for count
      const countQuery = Prescription.countDocuments(matchQuery);
      
      const [allPrescriptions, total] = await Promise.all([
        query.skip(skip).limit(limit).lean(),
        countQuery
      ]);
      
      // If patient name filter is provided, filter in memory
      let filteredPrescriptions = allPrescriptions;
      let filteredTotal = total;
      
      if (patientName && patientName.trim() !== '') {
        const searchName = patientName.toLowerCase().trim();
        filteredPrescriptions = allPrescriptions.filter((prescription: any) => {
          const patient = prescription.patientInfo;
          return patient && patient.name && 
                 patient.name.toLowerCase().includes(searchName);
        });
        filteredTotal = filteredPrescriptions.length;
      }
      
      return {
        prescriptions: filteredPrescriptions,
        total: filteredTotal,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(filteredTotal / limit),
        hasNextPage: page * limit < filteredTotal,
        hasPrevPage: page > 1,
        filters: {
          startDate,
          endDate,
          patientName,
          diagnosis
        }
      };
    } catch (error: any) {
      console.error('Error in getAllPrescriptions:', error);
      throw new Error(`Failed to get all prescriptions: ${error.message}`);
    }
  }
  
  // ✅ Check if patient has previous prescriptions
  async hasPreviousPrescriptions(uhid: string, doctorId: string): Promise<boolean> {
    try {
      const count = await Prescription.countDocuments({
        uhid: uhid.trim(),
        doctorId: new mongoose.Types.ObjectId(doctorId),
        isCompleted: true,
        visitType: { $ne: 'correction' } // Exclude correction prescriptions
      });
      return count > 0;
    } catch (error: any) {
      console.error('Error in hasPreviousPrescriptions:', error);
      return false; // Return false on error to avoid blocking prescription creation
    }
  }
  
  // ✅ Mark prescription as printed
  async markAsPrinted(id: string, doctorId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new Error('Invalid ID format');
      }
      
      return await Prescription.findOneAndUpdate(
        { 
          _id: new mongoose.Types.ObjectId(id), 
          doctorId: new mongoose.Types.ObjectId(doctorId) 
        },
        { 
          $inc: { printCount: 1 },
          lastPrintedAt: new Date(),
          updatedAt: new Date() 
        },
        { new: true }
      );
    } catch (error: any) {
      console.error('Error in markAsPrinted:', error);
      throw new Error(`Failed to mark prescription as printed: ${error.message}`);
    }
  }
  
  // ✅ Get dashboard statistics
  async getDashboardStats(doctorId: string, period: string = 'today') {
    try {
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        default:
          startDate.setHours(0, 0, 0, 0);
      }
      
      const matchStage = {
        doctorId: new mongoose.Types.ObjectId(doctorId),
        isCompleted: true,
        createdAt: { $gte: startDate }
      };
      
      const stats = await Prescription.aggregate([
        { $match: matchStage },
        {
          $facet: {
            totalStats: [
              {
                $group: {
                  _id: null,
                  totalPrescriptions: { $sum: 1 },
                  totalRevenue: { $sum: { $ifNull: ['$consultationFee', 0] } },
                  totalPatients: { $addToSet: '$patientId' },
                  newPatients: { 
                    $sum: { $cond: [{ $eq: ['$visitType', 'new'] }, 1, 0] } 
                  },
                  followupPatients: { 
                    $sum: { $cond: [{ $eq: ['$visitType', 'followup'] }, 1, 0] } 
                  },
                  correctionPrescriptions: {
                    $sum: { $cond: [{ $eq: ['$visitType', 'correction'] }, 1, 0] } 
                  },
                  editedPrescriptions: {
                    $sum: { $cond: [{ $eq: ['$isEdited', true] }, 1, 0] } 
                  },
                  paidPrescriptions: {
                    $sum: { $cond: [{ $eq: ['$isPaid', true] }, 1, 0] } 
                  },
                  pendingAmount: {
                    $sum: { 
                      $cond: [
                        { $eq: ['$isPaid', false] }, 
                        { $ifNull: ['$consultationFee', 0] }, 
                        0
                      ] 
                    }
                  },
                  avgConsultationFee: { $avg: { $ifNull: ['$consultationFee', 0] } }
                }
              }
            ],
            dailyStats: [
              {
                $group: {
                  _id: { 
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } 
                  },
                  count: { $sum: 1 },
                  revenue: { $sum: { $ifNull: ['$consultationFee', 0] } },
                  paid: { 
                    $sum: { 
                      $cond: [
                        { $eq: ['$isPaid', true] }, 
                        { $ifNull: ['$consultationFee', 0] }, 
                        0
                      ] 
                    } 
                  }
                }
              },
              { $sort: { _id: -1 } },
              { $limit: 7 }
            ],
            topDiagnoses: [
              { $unwind: '$diagnosis' },
              {
                $group: {
                  _id: '$diagnosis',
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 5 }
            ],
            topMedicines: [
              { $unwind: '$medicines' },
              {
                $group: {
                  _id: '$medicines.name',
                  count: { $sum: 1 }
                }
              },
              { $sort: { count: -1 } },
              { $limit: 5 }
            ],
            paymentMethods: [
              {
                $match: { isPaid: true }
              },
              {
                $group: {
                  _id: '$paymentMethod',
                  count: { $sum: 1 },
                  amount: { $sum: { $ifNull: ['$consultationFee', 0] } }
                }
              }
            ]
          }
        }
      ]);
      
      const result = stats[0];
      
      return {
        period,
        totalPrescriptions: result.totalStats[0]?.totalPrescriptions || 0,
        totalRevenue: result.totalStats[0]?.totalRevenue || 0,
        totalPatients: result.totalStats[0]?.totalPatients?.length || 0,
        newPatients: result.totalStats[0]?.newPatients || 0,
        followupPatients: result.totalStats[0]?.followupPatients || 0,
        correctionPrescriptions: result.totalStats[0]?.correctionPrescriptions || 0,
        editedPrescriptions: result.totalStats[0]?.editedPrescriptions || 0,
        paidPrescriptions: result.totalStats[0]?.paidPrescriptions || 0,
        pendingAmount: result.totalStats[0]?.pendingAmount || 0,
        avgConsultationFee: result.totalStats[0]?.avgConsultationFee 
          ? Math.round(result.totalStats[0].avgConsultationFee * 100) / 100 
          : 0,
        dailyStats: result.dailyStats || [],
        topDiagnoses: result.topDiagnoses || [],
        topMedicines: result.topMedicines || [],
        paymentMethods: result.paymentMethods || []
      };
    } catch (error: any) {
      console.error('Error in getDashboardStats:', error);
      throw new Error(`Failed to get dashboard stats: ${error.message}`);
    }
  }
  
  // ✅ Search prescriptions
  async searchPrescriptions(doctorId: string, query: string, type: string = 'all') {
    try {
      if (!query || query.trim() === '') {
        throw new Error('Search query is required');
      }
      
      const searchQuery: any = {
        doctorId: new mongoose.Types.ObjectId(doctorId),
        isCompleted: true
      };
      
      const searchTerm = query.trim();
      
      // Build search based on type
      if (type === 'patient') {
        // Search by patient name using aggregation
        return await Prescription.aggregate([
          {
            $lookup: {
              from: 'patients',
              localField: 'patientId',
              foreignField: '_id',
              as: 'patientData'
            }
          },
          { $unwind: '$patientData' },
          {
            $match: {
              'patientData.name': { $regex: searchTerm, $options: 'i' },
              doctorId: new mongoose.Types.ObjectId(doctorId),
              isCompleted: true
            }
          },
          {
            $lookup: {
              from: 'doctors',
              localField: 'doctorId',
              foreignField: '_id',
              as: 'doctorData'
            }
          },
          { $unwind: { path: '$doctorData', preserveNullAndEmptyArrays: true } },
          {
            $addFields: {
              patientInfo: {
                _id: '$patientData._id',
                name: '$patientData.name',
                age: '$patientData.age',
                gender: '$patientData.gender',
                mobileNumber: '$patientData.mobileNumber',
                uhid: '$patientData.uhid'
              },
              doctorInfo: {
                _id: '$doctorData._id',
                name: '$doctorData.name',
                specialization: '$doctorData.specialization',
                clinicName: '$doctorData.clinicName'
              }
            }
          },
          { $project: { patientData: 0, doctorData: 0 } },
          { $sort: { createdAt: -1 } },
          { $limit: 50 }
        ]);
        
      } else if (type === 'diagnosis') {
        searchQuery.diagnosis = { $regex: searchTerm, $options: 'i' };
      } else if (type === 'medicine') {
        searchQuery['medicines.name'] = { $regex: searchTerm, $options: 'i' };
      } else if (type === 'uhid') {
        searchQuery.uhid = { $regex: searchTerm, $options: 'i' };
      } else {
        // Search all fields
        searchQuery.$or = [
          { uhid: { $regex: searchTerm, $options: 'i' } },
          { diagnosis: { $regex: searchTerm, $options: 'i' } },
          { 'medicines.name': { $regex: searchTerm, $options: 'i' } },
          { chiefComplaints: { $regex: searchTerm, $options: 'i' } }
        ];
      }
      
      return await Prescription.find(searchQuery)
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('patientInfo', 'name age gender mobileNumber uhid')
        .populate('doctorInfo', 'name specialization clinicName')
        .lean();
    } catch (error: any) {
      console.error('Error in searchPrescriptions:', error);
      throw new Error(`Failed to search prescriptions: ${error.message}`);
    }
  }
  
  // ✅ Get prescription with all details (for print/view)
  async getPrescriptionWithDetails(id: string, doctorId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(doctorId)) {
        throw new Error('Invalid ID format');
      }
      
      const prescription = await Prescription.findOne({
        _id: new mongoose.Types.ObjectId(id),
        doctorId: new mongoose.Types.ObjectId(doctorId)
      })
      .populate('patientInfo', 'name age gender mobileNumber uhid address bloodGroup emergencyContact')
      .populate('doctorInfo', 'name specialization clinicName address contactNumber qualification registrationNumber')
      .lean();
      
      if (!prescription) {
        throw new Error('Prescription not found');
      }
      
      // Get previous prescriptions of the same patient
      const previousPrescriptions = await Prescription.find({
        patientId: prescription.patientId,
        doctorId: new mongoose.Types.ObjectId(doctorId),
        _id: { $ne: prescription._id },
        isCompleted: true
      })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('createdAt diagnosis medicines chiefComplaints')
      .lean();
      
      return {
        ...prescription,
        patientHistory: previousPrescriptions
      };
    } catch (error: any) {
      console.error('Error in getPrescriptionWithDetails:', error);
      throw new Error(`Failed to get prescription details: ${error.message}`);
    }
  }
  
  // ✅ Get prescriptions count for specific conditions
  async getCountByCondition(doctorId: string, condition: any) {
    try {
      return await Prescription.countDocuments({
        doctorId: new mongoose.Types.ObjectId(doctorId),
        ...condition
      });
    } catch (error: any) {
      console.error('Error in getCountByCondition:', error);
      return 0;
    }
  }
}

export const prescriptionRepository = new PrescriptionRepository();