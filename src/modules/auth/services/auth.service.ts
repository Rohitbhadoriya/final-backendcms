import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authRepository } from '../repositories/auth.repository';

export class AuthService {
  async registerDoctor(data: any) {
    const exists = await authRepository.emailExists(data.email);
    if (exists) throw new Error('Doctor already exists');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    const doctorData = {
      ...data,
      password: hashedPassword,
      role: 'admin'
    };
    
    const doctor = await authRepository.create(doctorData);
    
    const token = jwt.sign(
      { id: (doctor as any)._id, role: (doctor as any).role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );
    
    return { doctor, token };
  }
  
  async loginDoctor(email: string, password: string) {
    console.log('Login attempt for:', email); // Debug log
    
    const doctor = await authRepository.findByEmail(email);
    console.log('Doctor found:', doctor ? 'Yes' : 'No'); // Debug log
    
    if (!doctor) {
      console.log('No doctor found with email:', email);
      throw new Error('Invalid credentials');
    }
    
    const doctorAny = doctor as any;
    console.log('Stored password hash:', doctorAny.password); // Debug log
    
    // Direct bcrypt compare (agar comparePassword method kaam na kare)
    const isMatch = await bcrypt.compare(password, doctorAny.password);
    console.log('Password match:', isMatch); // Debug log
    
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    const token = jwt.sign(
      { id: doctorAny._id, role: doctorAny.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );
    
    return { doctor: doctorAny, token };
  }
  
  async getCurrentDoctor(id: string) {
    const doctor = await authRepository.findById(id);
    if (!doctor) throw new Error('Doctor not found');
    return doctor;
  }
}

export const authService = new AuthService();