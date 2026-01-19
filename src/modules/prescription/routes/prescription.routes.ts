// import express from 'express';
// import { prescriptionController } from '../controllers/prescription.controller';
// import { protect } from '../../../middleware/auth';

// const router = express.Router();

// // Apply auth middleware to all routes
// router.use(protect);

// // Create prescription
// router.post('/', prescriptionController.createPrescription.bind(prescriptionController));

// // Create complete prescription with invoice
// router.post('/complete', prescriptionController.createCompletePrescription.bind(prescriptionController));

// // Get ALL prescriptions (with pagination and filters)
// router.get('/', prescriptionController.getAllPrescriptions.bind(prescriptionController));

// // Get patient's ALL prescriptions
// router.get('/patient/:uhid', prescriptionController.getPatientPrescriptions.bind(prescriptionController));

// // Get patient's LAST prescription only
// router.get('/patient/:uhid/last', prescriptionController.getLastPrescription.bind(prescriptionController));

// // Get today's prescriptions
// router.get('/today', prescriptionController.getTodayPrescriptions.bind(prescriptionController));

// // Get prescription for print
// router.get('/:id/print', prescriptionController.printPrescription.bind(prescriptionController));

// // Get dashboard statistics
// router.get('/stats/dashboard', prescriptionController.getDashboardStats.bind(prescriptionController));

// // Search prescriptions
// router.get('/search', prescriptionController.searchPrescriptions.bind(prescriptionController));

// export default router;

import express from 'express';
import { prescriptionController } from '../controllers/prescription.controller';
import { protect } from '../../../middleware/auth';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// ==================== CREATE ROUTES ====================

// Create prescription
router.post('/', prescriptionController.createPrescription.bind(prescriptionController));

// Create complete prescription
router.post('/complete', prescriptionController.createCompletePrescription.bind(prescriptionController));

// ==================== EDIT ROUTES ====================

// Edit prescription (within 24 hours)
router.patch('/:id/edit', prescriptionController.editPrescription.bind(prescriptionController));

// Edit medicines only
router.patch('/:id/edit-medicines', prescriptionController.editMedicines.bind(prescriptionController));

// Create correction prescription (after 24 hours)
router.post('/:id/correction', prescriptionController.createCorrectionPrescription.bind(prescriptionController));

// ==================== GET ROUTES ====================

// Get edit history
router.get('/:id/edit-history', prescriptionController.getEditHistory.bind(prescriptionController));

// Get ALL prescriptions (with pagination and filters)
router.get('/', prescriptionController.getAllPrescriptions.bind(prescriptionController));

// Get patient's ALL prescriptions
router.get('/patient/:uhid', prescriptionController.getPatientPrescriptions.bind(prescriptionController));

// Get patient's LAST prescription only
router.get('/patient/:uhid/last', prescriptionController.getLastPrescription.bind(prescriptionController));

// Get today's prescriptions
router.get('/today', prescriptionController.getTodayPrescriptions.bind(prescriptionController));

// Get prescription for print
router.get('/:id/print', prescriptionController.printPrescription.bind(prescriptionController));

// Get prescription by ID
router.get('/:id', prescriptionController.getPrescriptionById.bind(prescriptionController));

// ==================== DASHBOARD & STATS ROUTES ====================

// Get dashboard statistics
router.get('/stats/dashboard', prescriptionController.getDashboardStats.bind(prescriptionController));

// Get today's collection report
router.get('/reports/today-collection', prescriptionController.getTodayCollection.bind(prescriptionController));

// Get week collection report
router.get('/reports/week-collection', prescriptionController.getWeekCollection.bind(prescriptionController));

// Get month collection report
router.get('/reports/month-collection', prescriptionController.getMonthCollection.bind(prescriptionController));

// Get prescription statistics
router.get('/stats/prescriptions', prescriptionController.getPrescriptionStats.bind(prescriptionController));

// ==================== PAYMENT ROUTES ====================

// Mark prescription as paid
router.patch('/:id/pay', prescriptionController.markPrescriptionAsPaid.bind(prescriptionController));

// ==================== SEARCH ROUTES ====================

// Search prescriptions
router.get('/search', prescriptionController.searchPrescriptions.bind(prescriptionController));

// ==================== HEALTH CHECK ====================

// Health check endpoint
router.get('/health', prescriptionController.healthCheck.bind(prescriptionController));

// ==================== EXPORT ROUTES ====================

// Export prescriptions (CSV/Excel)
router.get('/export', (req: express.Request, res: express.Response) => {
  res.status(200).json({
    success: true,
    message: 'Export endpoint - implementation pending',
    endpoint: '/api/prescriptions/export'
  });
});

export default router;