import { prescriptionRepository } from '../../prescription/repositories/prescription.repository';
import { appointmentRepository } from '../../appointment/repositories/appointment.repository';
import { patientRepository } from '../../patient/repositories/patient.repository';

export class DashboardService {
  async getTodayStats(doctorId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Today's prescriptions
    const todayPrescriptions = await prescriptionRepository.getTodayPrescriptions(doctorId);
    const todayPatients = todayPrescriptions.length;
    
    // Today's collection
    const todayCollection = todayPrescriptions.reduce((sum, pres) => sum + pres.totalAmount, 0);
    
    // Pending appointments
    const queue = await appointmentRepository.getQueue(doctorId);
    const pendingAppointments = queue.length;
    
    // Follow-up patients
    const followUpPatients = todayPrescriptions.filter(pres => pres.visitType === 'followup').length;
    
    return {
      todayPatients,
      todayCollection,
      pendingAppointments,
      followUpPatients
    };
  }
  
  async getWeeklyStats(doctorId: string) {
    const stats = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Mock data for now - in real app, query database for each date
      stats.push({
        date: date.toISOString().split('T')[0],
        patients: Math.floor(Math.random() * 20) + 10,
        collection: Math.floor(Math.random() * 10000) + 5000
      });
    }
    
    return stats;
  }
}

export const dashboardService = new DashboardService();