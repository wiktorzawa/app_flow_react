import express from 'express';
import authRoutes from './login_auth_data.routes';
import staffRoutes from './login_table_staff.routes';
import supplierRoutes from './login_table_suppliers.routes';

const router = express.Router();

// Trasy do uwierzytelniania
router.use('/auth', authRoutes);

// Trasy dla pracowników
router.use('/staff', staffRoutes);

// Trasy dla dostawców
router.use('/suppliers', supplierRoutes);

export default router; 