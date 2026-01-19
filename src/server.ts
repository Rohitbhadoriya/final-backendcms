import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './database/connection';

// Import routes
import authRoutes from './modules/auth/routes/auth.routes';
import patientRoutes from './modules/patient/routes/patient.routes';
import prescriptionRoutes from './modules/prescription/routes/prescription.routes';
import masterRoutes from './modules/master/routes/master.routes';
import appointmentRoutes from './modules/appointment/routes/appointment.routes';
import dashboardRoutes from './modules/dashboard/routes/dashboard.routes';
import billingRoutes from './modules/billing/routes/billing.routes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/billing', billingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Clinic API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});