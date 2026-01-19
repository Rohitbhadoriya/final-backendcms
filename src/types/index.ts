import { Document } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  specialization: string;
  clinicName: string;
  consultationFee: number;
  role: 'admin' | 'doctor';
  comparePassword(password: string): Promise<boolean>;
}

export interface IPatient extends Document {
  uhid: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  mobile?: string;
  address?: string;
  aadhar?: string;
  chiefComplaint?: string;
  medicalHistory?: string;
  allergies?: string;
  height?: string;
  weight?: string;
  doctorId: string;
}

export interface IMaster extends Document {
  type: 'diagnosis' | 'medicine' | 'investigation' | 'complaint' | 'history' | 'allergy';
  name: string;
  doctorId: string;
}

export interface IMedicine {
  name: string;
  dosage: string;
  frequency: 'OD' | 'BD' | 'TDS' | 'QID' | 'SOS';
  duration: string;
  instructions?: string;
  price?: number;
}

export interface IPrescription extends Document {
  patientId: string;
  doctorId: string;
  uhid: string;
  visitType: 'new' | 'followup';
  clinicalExamination: string;
  diagnosis: string[];
  investigations: string[];
  medicines: IMedicine[];
  followUpDate?: Date;
  followUpInstructions?: string;
  consultationFee: number;
  medicineCharges: number;
  totalAmount: number;
  isCompleted: boolean;
}

export interface IAppointment extends Document {
  patientId: string;
  doctorId: string;
  uhid: string;
  date: Date;
  queueNumber: number;
  status: 'walkin' | 'consulting' | 'completed';
  visitType: 'new' | 'followup';
}

export interface IInvoice extends Document {
  prescriptionId: string;
  patientId: string;
  doctorId: string;
  uhid: string;
  invoiceNumber: string;
  items: Array<{ name: string; amount: number }>;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending';
}