import express from "express";
import { ProfileController } from "../controllers/profileController";
import { PhotoManagerService } from "../services/PhotoManagerService";

const router = express.Router();
const profileController = new ProfileController();
const photoManager = new PhotoManagerService();

// Configure multer for photo uploads
const upload = photoManager.getMulterConfig();

// === PROFILE GENERATION ===
router.post("/generate", profileController.generateProfile);
router.post("/generate/batch", profileController.generateBatchProfiles);

// === PHOTO MANAGEMENT ===
router.post("/:profileId/photos", upload.single("photo"), profileController.uploadProfilePhoto);
router.post("/:profileId/avatar/generate", profileController.generateAIAvatar);

// === PROFILE QUERIES ===
router.get("/", profileController.getProfiles);
router.get("/:id", profileController.getProfiles);

export default router;
