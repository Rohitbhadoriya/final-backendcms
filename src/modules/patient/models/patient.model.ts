import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  uhid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  mobile: String,
  address: String,
  aadhar: String,
  chiefComplaint: String,
  medicalHistory: String,
  allergies: String,
  height: String,
  weight: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }
}, { timestamps: true });

export const Patient = mongoose.model('Patient', patientSchema);