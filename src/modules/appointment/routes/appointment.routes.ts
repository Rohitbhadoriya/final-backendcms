// import express from 'express';
// import { appointmentController } from '../controllers/appointment.controller';
// import { protect } from '../../../middleware/auth';

// const router = express.Router();

// router.use(protect);

// router.get('/today', appointmentController.getTodayAppointments.bind(appointmentController));
// router.get('/queue', appointmentController.getQueue.bind(appointmentController));
// router.put('/:id/status', appointmentController.updateStatus.bind(appointmentController));
// router.put('/next', appointmentController.callNextPatient.bind(appointmentController));

// export default router;





// import express from 'express';
// import { appointmentController } from '../controllers/appointment.controller';
// import { protect } from '../../../middleware/auth';

// const router = express.Router();

// router.use(protect);

// router.get('/today', appointmentController.getTodayAppointments.bind(appointmentController));
// router.get('/all-today', appointmentController.getAllTodayAppointments.bind(appointmentController)); // ✅ NEW ROUTE
// router.get('/queue', appointmentController.getQueue.bind(appointmentController));
// router.put('/:id/status', appointmentController.updateStatus.bind(appointmentController));
// router.put('/next', appointmentController.callNextPatient.bind(appointmentController));



// export default router;







import express from 'express';
import { appointmentController } from '../controllers/appointment.controller';
import { protect } from '../../../middleware/auth';

const router = express.Router();

router.use(protect);

// ✅ EXISTING ROUTES
router.get('/today', appointmentController.getTodayAppointments.bind(appointmentController));
router.get('/all-today', appointmentController.getAllTodayAppointments.bind(appointmentController));
router.get('/queue', appointmentController.getQueue.bind(appointmentController));
router.put('/:id/status', appointmentController.updateStatus.bind(appointmentController));
router.put('/next', appointmentController.callNextPatient.bind(appointmentController));

// ✅ NEW ROUTES FOR FOLLOW-UP
router.post('/followup', appointmentController.createFollowupAppointment.bind(appointmentController));
router.get('/patient/:patientId/today', appointmentController.getAppointmentByPatient.bind(appointmentController));

export default router;