import express from 'express';
import * as supplierController from '../controllers/login_table_suppliers.controller';

const router = express.Router();

// Pobieranie wszystkich dostawców
router.get('/', supplierController.getAllSuppliers);

// Pobieranie dostawcy po ID
router.get('/:id', supplierController.getSupplierById);

// Dodawanie nowego dostawcy
router.post('/', supplierController.createSupplier);

// Aktualizacja dostawcy
router.put('/:id', supplierController.updateSupplier);

// Usunięcie dostawcy
router.delete('/:id', supplierController.deleteSupplier);

export default router; 