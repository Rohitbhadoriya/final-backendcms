// import { Appointment } from '../models/appointment.model';

// export class AppointmentRepository {
//   async create(data: any) {
//     return await Appointment.create(data);
//   }
  
//   async getTodayAppointments(doctorId: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     return await Appointment.find({
//       doctorId,
//       date: { $gte: today, $lt: tomorrow }
//     }).sort({ queueNumber: 1 });
//   }
  
//   async getQueue(doctorId: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     return await Appointment.find({
//       doctorId,
//       date: { $gte: today, $lt: tomorrow },
//       status: { $in: ['walkin', 'consulting'] }
//     }).sort({ queueNumber: 1 });
//   }
  
//   async updateStatus(id: string, status: string, doctorId: string) {
//     return await Appointment.findOneAndUpdate(
//       { _id: id, doctorId },
//       { status },
//       { new: true }
//     );
//   }
  
//   async getNextQueueNumber(doctorId: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     const count = await Appointment.countDocuments({
//       doctorId,
//       date: { $gte: today, $lt: tomorrow }
//     });
    
//     return count + 1;
//   }
  
//   async getNextPatient(doctorId: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     return await Appointment.findOne({
//       doctorId,
//       date: { $gte: today, $lt: tomorrow },
//       status: 'walkin'
//     }).sort({ queueNumber: 1 });
//   }
// }

// export const appointmentRepository = new AppointmentRepository();












// import { Appointment } from '../models/appointment.model';

// export class AppointmentRepository {
//   async create(data: any) {
//     return await Appointment.create(data);
//   }
  
//   async getTodayAppointments(doctorId: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     return await Appointment.find({
//       doctorId,
//       date: { $gte: today, $lt: tomorrow }
//     })
//     .populate('patientId', 'name age gender phone uhid chiefComplaint') // ✅ ADD POPULATE
//     .sort({ queueNumber: 1 })
//     .lean(); // ✅ ADD LEAN FOR BETTER PERFORMANCE
//   }
  
//   async getQueue(doctorId: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     return await Appointment.find({
//       doctorId,
//       date: { $gte: today, $lt: tomorrow },
//       status: { $in: ['walkin', 'consulting'] }
//     })
//     .populate('patientId', 'name age gender phone uhid chiefComplaint') // ✅ ADD POPULATE
//     .sort({ queueNumber: 1 })
//     .lean(); // ✅ ADD LEAN
//   }
  
//   async updateStatus(id: string, status: string, doctorId: string) {
//     return await Appointment.findOneAndUpdate(
//       { _id: id, doctorId },
//       { status },
//       { new: true }
//     );
//   }
  
//   async getNextQueueNumber(doctorId: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     const count = await Appointment.countDocuments({
//       doctorId,
//       date: { $gte: today, $lt: tomorrow }
//     });
    
//     return count + 1;
//   }
  
//   async getNextPatient(doctorId: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     return await Appointment.findOne({
//       doctorId,
//       date: { $gte: today, $lt: tomorrow },
//       status: 'walkin'
//     })
//     .populate('patientId', 'name age gender phone uhid chiefComplaint') // ✅ ADD POPULATE
//     .sort({ queueNumber: 1 })
//     .lean(); // ✅ ADD LEAN
//   }

//   // ✅ NEW METHOD: Get all appointments including completed (for frontend)
//   async getAllTodayAppointments(doctorId: string) {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);
    
//     return await Appointment.find({
//       doctorId,
//       date: { $gte: today, $lt: tomorrow }
//     })
//     .populate('patientId', 'name age gender phone uhid chiefComplaint') // ✅ POPULATE PATIENT DETAILS
//     .sort({ queueNumber: 1 })
//     .lean(); // ✅ LEAN FOR BETTER PERFORMANCE
//   }
// }

// export const appointmentRepository = new AppointmentRepository();









import { Appointment } from '../models/appointment.model';

export class AppointmentRepository {
  async create(data: any) {
    return await Appointment.create(data);
  }
  
  async getTodayAppointments(doctorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await Appointment.find({
      doctorId,
      date: { $gte: today, $lt: tomorrow }
    })
    .populate('patientId', 'name age gender phone uhid chiefComplaint')
    .sort({ queueNumber: 1 })
    .lean();
  }
  
  async getQueue(doctorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await Appointment.find({
      doctorId,
      date: { $gte: today, $lt: tomorrow },
      status: { $in: ['walkin', 'consulting'] }
    })
    .populate('patientId', 'name age gender phone uhid chiefComplaint')
    .sort({ queueNumber: 1 })
    .lean();
  }
  
  async updateStatus(id: string, status: string, doctorId: string) {
    return await Appointment.findOneAndUpdate(
      { _id: id, doctorId },
      { status },
      { new: true }
    );
  }
  
  async getNextQueueNumber(doctorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const count = await Appointment.countDocuments({
      doctorId,
      date: { $gte: today, $lt: tomorrow }
    });
    
    return count + 1;
  }
  
  async getNextPatient(doctorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await Appointment.findOne({
      doctorId,
      date: { $gte: today, $lt: tomorrow },
      status: 'walkin'
    })
    .populate('patientId', 'name age gender phone uhid chiefComplaint')
    .sort({ queueNumber: 1 })
    .lean();
  }

  async getAllTodayAppointments(doctorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return await Appointment.find({
      doctorId,
      date: { $gte: today, $lt: tomorrow }
    })
    .populate('patientId', 'name age gender phone uhid chiefComplaint')
    .sort({ queueNumber: 1 })
    .lean();
  }
  
  // ✅ NEW: Find appointments with conditions
  async find(conditions: any) {
    return await Appointment.find(conditions)
      .populate('patientId', 'name age gender phone uhid chiefComplaint')
      .lean();
  }
}

export const appointmentRepository = new AppointmentRepository();