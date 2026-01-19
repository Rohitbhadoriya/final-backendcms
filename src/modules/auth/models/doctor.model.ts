import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  clinicName: {
    type: String,
    default: 'My Clinic'
  },
  consultationFee: {
    type: Number,
    default: 500
  },
  role: {
    type: String,
    enum: ['admin', 'doctor'],
    default: 'doctor'
  }
}, {
  timestamps: true
});

doctorSchema.methods.comparePassword = async function(password: string) {
  return await bcrypt.compare(password, this.password);
};

export const Doctor = mongoose.model('Doctor', doctorSchema);