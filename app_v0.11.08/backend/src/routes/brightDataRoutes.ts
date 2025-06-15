import express from "express";
import { brightDataController } from "../controllers/brightDataController";
// import { protect, admin } from '../middleware/authMiddleware'; // Jeśli potrzebna autoryzacja

const router = express.Router();

router.route("/proxies")
  .get(brightDataController.listBrightDataProxies); // Można dodać protect, jeśli endpoint ma być chroniony
// .get(protect, brightDataController.listBrightDataProxies); // Przykład z autoryzacją

export default router; 