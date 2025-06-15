import express from "express";
import * as staffController from "../controllers/login_table_staff.controller";

const router = express.Router();

// Pobieranie wszystkich pracowników
router.get("/", staffController.getAllStaff);

// Dodaj trasę dla generowania ID pracownika
router.get("/generate-id", staffController.generateStaffId);

// Pobieranie pracownika po ID
router.get("/:id", staffController.getStaffById);

// Dodawanie nowego pracownika
router.post("/", staffController.createStaff);

// Aktualizacja pracownika
router.put("/:id", staffController.updateStaff);

// Usunięcie pracownika
router.delete("/:id", staffController.deleteStaff);

// Dodaj trasę dla tworzenia pracownika z automatycznym ID i hasłem
router.post("/with-password", staffController.createStaffWithPassword);

export default router;
