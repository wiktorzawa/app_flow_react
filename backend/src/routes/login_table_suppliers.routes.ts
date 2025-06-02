import express from "express";
import * as supplierController from "../controllers/login_table_suppliers.controller";

const router = express.Router();

// Pobieranie wszystkich dostawców
router.get("/", supplierController.getAllSuppliers);

// Dodaj trasę dla generowania ID dostawcy
router.get("/generate-id", supplierController.generateSupplierId);

// Pobieranie dostawcy po ID
router.get("/:id", supplierController.getSupplierById);

// Dodawanie nowego dostawcy
router.post("/", supplierController.createSupplier);

// Dodawanie nowego dostawcy z hasłem
router.post("/with-password", supplierController.createSupplierWithPassword);

// Aktualizacja dostawcy
router.put("/:id", supplierController.updateSupplier);

// Usunięcie dostawcy
router.delete("/:id", supplierController.deleteSupplier);

export default router;
