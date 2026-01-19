import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  uhid: { type: String, required: true },
  date: { type: Date, default: Date.now },
  queueNumber: { type: Number, required: true },
  status: { type: String, enum: ['walkin', 'consulting', 'completed'], default: 'walkin' },
  visitType: { type: String, enum: ['new', 'followup'], default: 'new' }
}, { timestamps: true });

export const Appointment = mongoose.model('Appointment', appointmentSchema);