import express from "express";
import authRoutes from "./login_auth_data.routes";
import staffRoutes from "./login_table_staff.routes";
import supplierRoutes from "./login_table_suppliers.routes";
import allegroRoutes from "./allegroRoutes";
import adsPowerRoutes from "./adsPowerRoutes";
import brightDataRoutes from "./brightDataRoutes";

const router = express.Router();

// Trasy do uwierzytelniania
router.use("/auth", authRoutes);

// Trasy dla pracowników
router.use("/staff", staffRoutes);

// Trasy dla dostawców
router.use("/suppliers", supplierRoutes);

// Trasy dla Allegro
router.use("/allegro", allegroRoutes);

// Trasy dla AdsPower
router.use("/adspower", adsPowerRoutes);

// Trasy dla Bright Data
router.use("/brightdata", brightDataRoutes);

export default router;
