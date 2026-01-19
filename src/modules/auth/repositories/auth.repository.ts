import { Doctor } from '../models/doctor.model';

export class AuthRepository {
  async create(data: any) {
    return await Doctor.create(data);
  }
  
  async findByEmail(email: string) {
    return await Doctor.findOne({ email }).select('+password');
  }
  
  async findById(id: string) {
    return await Doctor.findById(id).select('-password');
  }
  
  async emailExists(email: string) {
    const doctor = await Doctor.findOne({ email });
    return !!doctor;
  }
}

export const authRepository = new AuthRepository();