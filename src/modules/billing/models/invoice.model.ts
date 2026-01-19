// import mongoose from 'mongoose';

// const invoiceSchema = new mongoose.Schema({
//   prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true },
//   patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
//   doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
//   uhid: { type: String, required: true },
//   invoiceNumber: { type: String, required: true, unique: true },
//   items: [{
//     name: String,
//     amount: Number
//   }],
//   totalAmount: { type: Number, required: true },
//   paymentStatus: { type: String, enum: ['paid', 'pending'], default: 'pending' },
//   paymentDate: Date
// }, { timestamps: true });

// export const Invoice = mongoose.model('Invoice', invoiceSchema);


import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  prescriptionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Prescription',
    required: true 
  },
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient',
    required: true 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor',
    required: true 
  },
  uhid: { 
    type: String, 
    trim: true 
  },
  invoiceNumber: { 
    type: String, 
    unique: true,
    default: function() {
      return `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  },
  totalAmount: { 
    type: Number, 
    required: true,
    min: 0 
  },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending' 
  },
  isPaid: { 
    type: Boolean, 
    default: false 
  },
  paidAt: { 
    type: Date 
  },
  paymentMethod: { 
    type: String,
    enum: ['cash', 'card', 'upi', 'insurance', 'other'],
    default: 'cash'
  },
  paymentNotes: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Indexes
invoiceSchema.index({ prescriptionId: 1 });
invoiceSchema.index({ patientId: 1 });
invoiceSchema.index({ doctorId: 1 });
invoiceSchema.index({ createdAt: -1 });
invoiceSchema.index({ isPaid: 1 });

// Virtual for prescription info
invoiceSchema.virtual('prescriptionInfo', {
  ref: 'Prescription',
  localField: 'prescriptionId',
  foreignField: '_id',
  justOne: true
});

// Virtual for patient info
invoiceSchema.virtual('patientInfo', {
  ref: 'Patient',
  localField: 'patientId',
  foreignField: '_id',
  justOne: true
});

export const Invoice = mongoose.model('Invoice', invoiceSchema);