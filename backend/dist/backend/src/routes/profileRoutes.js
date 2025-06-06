"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../controllers/profileController");
const PhotoManagerService_1 = require("../services/PhotoManagerService");
const router = express_1.default.Router();
const profileController = new profileController_1.ProfileController();
const photoManager = new PhotoManagerService_1.PhotoManagerService();
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
exports.default = router;
