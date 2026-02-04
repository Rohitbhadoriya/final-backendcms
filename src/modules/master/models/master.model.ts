// import mongoose from 'mongoose';

// const masterSchema = new mongoose.Schema({
//   type: { type: String, required: true },
//   name: { type: String, required: true },
//   doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }
// }, { timestamps: true });

// export const Master = mongoose.model('Master', masterSchema);


// import mongoose from 'mongoose';

// const masterSchema = new mongoose.Schema({
//   type: { 
//     type: String, 
//     required: true,
//     enum: ['medicine', 'diagnosis', 'investigation', 'procedure']
//   },
//   name: { type: String, required: true },
//   category: { 
//     type: String, 
//     enum: [
//       'painkiller', 
//       'ppi', 
//       'calcium', 
//       'vitamin', 
//       'antibiotic', 
//       'injection', 
//       'muscle_relaxant', 
//       'steroid',
//       'antacid',
//       'other'
//     ],
//     default: 'other'
//   },
//   doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }
// }, { timestamps: true });

// export const Master = mongoose.model('Master', masterSchema);




// import mongoose from 'mongoose';

// const masterSchema = new mongoose.Schema({
//   type: { 
//     type: String, 
//     required: true,
//     enum: ['medicine', 'diagnosis', 'investigation', 'procedure']
//   },
//   name: { type: String, required: true },
//   category: { 
//     type: String, 
//     enum: [
//       'painkiller', 
//       'ppi', 
//       'calcium', 
//       'vitamin', 
//       'antibiotic', 
//       'injection', 
//       'muscle_relaxant', 
//       'steroid',
//       'antacid',
//       'other'
//     ],
//     default: 'other'
//   },
//   frequency: { // ✅ Frequency field add kiya
//     type: String,
//     enum: ['OD', 'BD', 'TDS', 'QID', 'SOS', 'HS', 'AC', 'PC', 'STAT', 'EOD', 'Weekly', 'Monthly'],
//     default: ''
//   },
//   doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }
// }, { timestamps: true });

// export const Master = mongoose.model('Master', masterSchema);





import mongoose from 'mongoose';

const masterSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['medicine', 'diagnosis', 'investigation', 'procedure']
  },
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'painkiller', 
      'ppi', 
      'calcium', 
      'vitamin', 
      'antibiotic', 
      'injection', 
      'muscle_relaxant', 
      'steroid',
      'antacid',
      'other'
    ],
    default: 'other'
  },
  frequency: { // ✅ Frequency field add kiya
    type: String,
    enum: ['OD', 'BD', 'TDS', 'QID', 'SOS', 'HS', 'AC', 'PC', 'STAT', 'EOD', 'Weekly', 'Monthly'],
    default: ''
  },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }
}, { timestamps: true });

export const Master = mongoose.model('Master', masterSchema);