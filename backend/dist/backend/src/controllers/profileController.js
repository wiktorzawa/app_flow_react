"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const UserProfile_1 = require("@shared-types/UserProfile");
const ProfileDataGenerator_1 = require("../services/ProfileDataGenerator");
const PhotoManagerService_1 = require("../services/PhotoManagerService");
class ProfileController {
    constructor() {
        this.dataGenerator = new ProfileDataGenerator_1.ProfileDataGenerator();
        this.photoManager = new PhotoManagerService_1.PhotoManagerService();
        /**
         * Generate single realistic profile
         */
        this.generateProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const overrides = req.body || {};
                const profile = yield this.dataGenerator.generateUserProfile(overrides);
                res.status(201).json({
                    success: true,
                    data: profile,
                    message: "Profile generated successfully",
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: "Failed to generate profile",
                    details: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        /**
         * Generate batch of profiles
         */
        this.generateBatchProfiles = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { count = 10 } = req.body;
                const profiles = yield this.dataGenerator.generateBatchProfiles(count);
                res.status(201).json({
                    success: true,
                    data: profiles,
                    count: profiles.length,
                    message: `${profiles.length} profiles generated successfully`,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: "Failed to generate batch profiles",
                    details: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        /**
         * Upload and process profile photo
         */
        this.uploadProfilePhoto = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.params;
                const file = req.file;
                if (!file) {
                    res.status(400).json({
                        success: false,
                        error: "No file uploaded",
                    });
                    return;
                }
                const photoResult = yield this.photoManager.processUploadedPhoto(file, profileId, PhotoManagerService_1.PhotoType.AVATAR);
                res.status(201).json({
                    success: true,
                    data: photoResult,
                    message: "Photo uploaded and processed successfully",
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: "Failed to upload photo",
                    details: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        /**
         * Generate AI avatar for profile
         */
        this.generateAIAvatar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { profileId } = req.params;
                const { gender, age, ethnicity = "white" } = req.body;
                const avatarResult = yield this.photoManager.generateAIAvatar(profileId, gender, age, ethnicity);
                res.status(201).json({
                    success: true,
                    data: avatarResult,
                    message: "AI avatar generated successfully",
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: "Failed to generate AI avatar",
                    details: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
        /**
         * Get profiles with filtering
         */
        this.getProfiles = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { status = UserProfile_1.ProfileStatus.ACTIVE, risk_level, city, age_min, age_max, page = 1, limit = 20 } = req.query;
                // Here you would query your database
                // This is just a demo response structure
                const mockProfiles = [];
                res.status(200).json({
                    success: true,
                    data: mockProfiles,
                    pagination: {
                        page: Number(page),
                        limit: Number(limit),
                        total: mockProfiles.length,
                    },
                    filters: {
                        status,
                        risk_level,
                        city,
                        age_range: { min: age_min, max: age_max },
                    },
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    error: "Failed to fetch profiles",
                    details: error instanceof Error ? error.message : "Unknown error",
                });
            }
        });
    }
}
exports.ProfileController = ProfileController;
