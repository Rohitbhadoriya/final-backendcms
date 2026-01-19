// import express from 'express';
// import { patientController } from '../controllers/patient.controller';
// import { protect } from '../../../middleware/auth';

// const router = express.Router();

// router.use(protect);

// router.post('/register', patientController.registerPatient.bind(patientController));
// router.get('/search', patientController.searchPatient.bind(patientController));
// router.get('/uhid/:uhid', patientController.getPatientByUHID.bind(patientController));
// router.get('/:uhid/history', patientController.getPatientHistory.bind(patientController));

// export default router;




// import express from 'express';
// import { patientController } from '../controllers/patient.controller';
// import { protect } from '../../../middleware/auth';

// const router = express.Router();

// router.use(protect);

// router.post('/register', patientController.registerPatient.bind(patientController));
// router.get('/search', patientController.searchPatient.bind(patientController));
// // ✅ NEW API: Search by UHID/Phone directly
// router.get('/search/:query', patientController.searchPatientDirect.bind(patientController));
// router.get('/uhid/:uhid', patientController.getPatientByUHID.bind(patientController));
// router.get('/:uhid/history', patientController.getPatientHistory.bind(patientController));

// export default router;




import express from 'express';
import { patientController } from '../controllers/patient.controller';
import { protect } from '../../../middleware/auth';

const router = express.Router();

router.use(protect);

router.post('/register', patientController.registerPatient.bind(patientController));
router.get('/search', patientController.searchPatient.bind(patientController));
// ✅ NEW API: Search by UHID/Phone directly
router.get('/search/:query', patientController.searchPatientDirect.bind(patientController));
router.get('/uhid/:uhid', patientController.getPatientByUHID.bind(patientController));
router.get('/:uhid/history', patientController.getPatientHistory.bind(patientController));

// ✅ NEW: Get patient by ID (MUST BE LAST - Order matters!)
router.get('/:id', patientController.getPatientById.bind(patientController));

export default router;