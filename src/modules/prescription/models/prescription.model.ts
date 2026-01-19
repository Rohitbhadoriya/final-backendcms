// import mongoose from 'mongoose';

// const medicineSchema = new mongoose.Schema({
//   name: { 
//     type: String, 
//     required: true,
//     trim: true
//   },
//   dosage: { 
//     type: String, 
//     required: true,
//     trim: true
//   },
//   frequency: { 
//     type: String, 
//     enum: ['OD', 'BD', 'TDS', 'QID', 'SOS', 'HS', 'AC', 'PC'],
//     default: 'BD'
//   },
//   duration: { 
//     type: String, 
//     required: true,
//     trim: true
//   },
//   instructions: { 
//     type: String, 
//     trim: true
//   },
//   price: { 
//     type: Number, 
//     default: 0,
//     min: 0
//   },
//   isActive: { 
//     type: Boolean, 
//     default: true 
//   }
// }, { _id: false });

// const prescriptionSchema = new mongoose.Schema({
//   patientId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Patient', 
//     required: true 
//   },
//   doctorId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Doctor', 
//     required: true 
//   },
//   uhid: { 
//     type: String, 
//     required: true,
//     trim: true,
//     index: true
//   },
//   visitType: { 
//     type: String, 
//     enum: ['new', 'followup', 'emergency', 'review'],
//     default: 'new' 
//   },
//   clinicalExamination: { 
//     type: String, 
//     trim: true
//   },
//     chiefComplaints: [{ 
//       type: String, 
//       trim: true 
//     }],
//   diagnosis: [{ 
//     type: String, 
//     trim: true 
//   }],
//   investigations: [{ 
//     type: String, 
//     trim: true 
//   }],
//   procedures: [{ 
//     type: String, 
//     trim: true 
//   }],
//   medicines: [medicineSchema],
//   advice: { 
//     type: String, 
//     trim: true 
//   },
//   followUpDate: { 
//     type: Date 
//   },
//   followUpInstructions: { 
//     type: String, 
//     trim: true 
//   },
//   consultationFee: { 
//     type: Number, 
//     default: 0,
//     min: 0 
//   },
//   medicineCharges: { 
//     type: Number, 
//     default: 0,
//     min: 0 
//   },
//   procedureCharges: { 
//     type: Number, 
//     default: 0,
//     min: 0 
//   },
//   totalAmount: { 
//     type: Number, 
//     default: 0,
//     min: 0 
//   },
//   isCompleted: { 
//     type: Boolean, 
//     default: false,
//     index: true
//   },
//   isPrinted: { 
//     type: Boolean, 
//     default: false 
//   },
//   appointmentId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Appointment' 
//   },
//   referralDoctor: { 
//     type: String, 
//     trim: true 
//   },
//   referralReason: { 
//     type: String, 
//     trim: true 
//   },
//   createdAt: { 
//     type: Date, 
//     default: Date.now,
//     index: true
//   },
//   updatedAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// }, {
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // Indexes for faster queries
// prescriptionSchema.index({ uhid: 1, doctorId: 1, createdAt: -1 });
// prescriptionSchema.index({ doctorId: 1, createdAt: -1 });
// prescriptionSchema.index({ patientId: 1, createdAt: -1 });
// prescriptionSchema.index({ isCompleted: 1, createdAt: -1 });
// prescriptionSchema.index({ 'diagnosis': 'text' });

// // Virtual for patient info
// prescriptionSchema.virtual('patientInfo', {
//   ref: 'Patient',
//   localField: 'patientId',
//   foreignField: '_id',
//   justOne: true
// });

// // Virtual for doctor info
// prescriptionSchema.virtual('doctorInfo', {
//   ref: 'Doctor',
//   localField: 'doctorId',
//   foreignField: '_id',
//   justOne: true
// });

// // ✅ FIXED: Updated pre-save hook (Mongoose v6+ compatible)
// prescriptionSchema.pre('save', function() {
//   // 'this' refers to the document being saved
//   const prescription = this as any;
  
//   // Update updatedAt timestamp
//   if (prescription.isModified()) {
//     prescription.updatedAt = new Date();
//   }
  
//   // Calculate total amount if needed
//   if (prescription.isModified('consultationFee') || 
//       prescription.isModified('medicineCharges') || 
//       prescription.isModified('procedureCharges')) {
//     prescription.totalAmount = 
//       (prescription.consultationFee || 0) + 
//       (prescription.medicineCharges || 0) + 
//       (prescription.procedureCharges || 0);
//   }
// });

// // ✅ ALTERNATIVE: If above doesn't work, use async function
// // prescriptionSchema.pre('save', async function() {
// //   const prescription = this as any;
// //   prescription.updatedAt = new Date();
// // });

// // ✅ OPTION 2: Simple fix without parameters
// // prescriptionSchema.pre('save', function() {
// //   const prescription = this as any;
// //   prescription.updatedAt = new Date();
// // });

// export const Prescription = mongoose.model('Prescription', prescriptionSchema);
import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  dosage: { 
    type: String, 
    required: true,
    trim: true
  },
  frequency: { 
    type: String, 
    enum: ['OD', 'BD', 'TDS', 'QID', 'SOS', 'HS', 'AC', 'PC'],
    default: 'BD'
  },
  duration: { 
    type: String, 
    required: true,
    trim: true
  },
  instructions: { 
    type: String, 
    trim: true
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
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
    required: true,
    trim: true,
    index: true
  },
  visitType: { 
    type: String, 
    enum: ['new', 'followup', 'emergency', 'review', 'correction'],
    default: 'new' 
  },
  clinicalExamination: { 
    type: String, 
    trim: true
  },
  chiefComplaints: [{ 
    type: String, 
    trim: true 
  }],
  diagnosis: [{ 
    type: String, 
    trim: true 
  }],
  investigations: [{ 
    type: String, 
    trim: true 
  }],
  procedures: [{ 
    type: String, 
    trim: true 
  }],
  medicines: [medicineSchema],
  advice: { 
    type: String, 
    trim: true 
  },
  followUpDate: { 
    type: Date 
  },
  followUpInstructions: { 
    type: String, 
    trim: true 
  },
  consultationFee: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  medicineCharges: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  procedureCharges: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  totalAmount: { 
    type: Number, 
    default: 0,
    min: 0 
  },
  
  // NEW FIELDS ADDED
  isPaid: { 
    type: Boolean, 
    default: false,
    index: true
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'upi', 'online', 'insurance', 'pending'],
    default: 'pending',
    index: true
  },
  paymentDate: { 
    type: Date 
  },
  paymentNotes: { 
    type: String, 
    trim: true 
  },
  transactionId: { 
    type: String, 
    trim: true 
  },
  
  isCompleted: { 
    type: Boolean, 
    default: false,
    index: true
  },
  isPrinted: { 
    type: Boolean, 
    default: false 
  },
  printCount: {
    type: Number,
    default: 0,
    min: 0
  },
  lastPrintedAt: {
    type: Date
  },
  
  // ✅ NEW FIELDS FOR EDIT FUNCTIONALITY
  isEdited: { 
    type: Boolean, 
    default: false 
  },
  lastEditedAt: { 
    type: Date 
  },
  editReason: { 
    type: String, 
    trim: true 
  },
  hasCorrection: { 
    type: Boolean, 
    default: false 
  },
  correctionPrescriptionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Prescription' 
  },
  correctionDate: { 
    type: Date 
  },
  originalPrescriptionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Prescription' 
  },
  isCorrection: { 
    type: Boolean, 
    default: false 
  },
  correctionReason: { 
    type: String, 
    trim: true 
  },
  
  appointmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment' 
  },
  referralDoctor: { 
    type: String, 
    trim: true 
  },
  referralReason: { 
    type: String, 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster queries
prescriptionSchema.index({ uhid: 1, doctorId: 1, createdAt: -1 });
prescriptionSchema.index({ doctorId: 1, createdAt: -1 });
prescriptionSchema.index({ patientId: 1, createdAt: -1 });
prescriptionSchema.index({ isCompleted: 1, createdAt: -1 });
prescriptionSchema.index({ isEdited: 1 });
prescriptionSchema.index({ isCorrection: 1 });
prescriptionSchema.index({ 'diagnosis': 'text' });

// Virtual for patient info
prescriptionSchema.virtual('patientInfo', {
  ref: 'Patient',
  localField: 'patientId',
  foreignField: '_id',
  justOne: true
});

// Virtual for doctor info
prescriptionSchema.virtual('doctorInfo', {
  ref: 'Doctor',
  localField: 'doctorId',
  foreignField: '_id',
  justOne: true
});

// Virtual for original prescription (for corrections)
prescriptionSchema.virtual('originalPrescription', {
  ref: 'Prescription',
  localField: 'originalPrescriptionId',
  foreignField: '_id',
  justOne: true
});

// Virtual for correction prescription
prescriptionSchema.virtual('correctionPrescription', {
  ref: 'Prescription',
  localField: 'correctionPrescriptionId',
  foreignField: '_id',
  justOne: true
});

// SOLUTION 1: Use mongoose's built-in timestamps instead of pre-save
// Timestamps already handle updatedAt automatically

// SOLUTION 2: If you need custom logic, use middleware with proper typing
prescriptionSchema.pre('save', function() {
  const prescription = this as any;
  
  // Calculate total amount
  prescription.totalAmount = 
    (prescription.consultationFee || 0) + 
    (prescription.medicineCharges || 0) + 
    (prescription.procedureCharges || 0);
  
  // If editing, set edit timestamp
  if (prescription.isModified('medicines') && prescription.isCompleted) {
    prescription.isEdited = true;
    prescription.lastEditedAt = new Date();
  }
  
  // If payment marked as paid, set payment date
  if (prescription.isModified('isPaid') && prescription.isPaid && !prescription.paymentDate) {
    prescription.paymentDate = new Date();
  }
});


export const Prescription = mongoose.model('Prescription', prescriptionSchema);