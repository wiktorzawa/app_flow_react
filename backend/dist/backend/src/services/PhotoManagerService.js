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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoManagerService = exports.PhotoType = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const sharp_1 = __importDefault(require("sharp"));
const crypto_1 = __importDefault(require("crypto"));
var PhotoType;
(function (PhotoType) {
    PhotoType["AVATAR"] = "avatar";
    PhotoType["PROFILE"] = "profile";
    PhotoType["BACKGROUND"] = "background";
    PhotoType["DOCUMENT"] = "document";
})(PhotoType || (exports.PhotoType = PhotoType = {}));
class PhotoManagerService {
    constructor() {
        this.uploadDir = process.env.UPLOAD_DIR || "./uploads/profiles";
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
        this.ensureUploadDirectory();
    }
    ensureUploadDirectory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield promises_1.default.access(this.uploadDir);
            }
            catch (_a) {
                yield promises_1.default.mkdir(this.uploadDir, { recursive: true });
            }
        });
    }
    /**
     * Configure multer for photo uploads
     */
    getMulterConfig() {
        const storage = multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.uploadDir);
            },
            filename: (req, file, cb) => {
                const uniqueId = crypto_1.default.randomUUID();
                const ext = path_1.default.extname(file.originalname);
                const filename = `${uniqueId}${ext}`;
                cb(null, filename);
            },
        });
        return (0, multer_1.default)({
            storage,
            limits: {
                fileSize: this.maxFileSize,
                files: 5, // Max 5 files per upload
            },
            fileFilter: (req, file, cb) => {
                if (this.allowedMimeTypes.includes(file.mimetype)) {
                    cb(null, true);
                }
                else {
                    const error = new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
                    cb(error);
                }
            },
        });
    }
    /**
     * Process uploaded photo (resize, optimize, generate thumbnails)
     */
    processUploadedPhoto(file_1, profileId_1) {
        return __awaiter(this, arguments, void 0, function* (file, profileId, type = PhotoType.PROFILE) {
            const filename = file.filename;
            const inputPath = file.path;
            const outputPath = path_1.default.join(this.uploadDir, `processed_${filename}`);
            try {
                // Process image with Sharp
                const processedImage = yield (0, sharp_1.default)(inputPath)
                    .resize(800, 800, {
                    fit: "inside",
                    withoutEnlargement: true,
                })
                    .jpeg({ quality: 85 })
                    .toFile(outputPath);
                // Get image metadata
                const metadata = yield (0, sharp_1.default)(outputPath).metadata();
                // Generate thumbnail for avatars
                if (type === PhotoType.AVATAR) {
                    const thumbnailPath = path_1.default.join(this.uploadDir, `thumb_${filename}`);
                    yield (0, sharp_1.default)(outputPath).resize(150, 150, { fit: "cover" }).jpeg({ quality: 80 }).toFile(thumbnailPath);
                }
                // Remove original uploaded file
                yield promises_1.default.unlink(inputPath);
                const result = {
                    id: crypto_1.default.randomUUID(),
                    filename: `processed_${filename}`,
                    url: `/uploads/profiles/processed_${filename}`,
                    type,
                    width: metadata.width || 0,
                    height: metadata.height || 0,
                    file_size: processedImage.size,
                };
                // Save to database
                yield this.savePhotoToDatabase(result, profileId, file.originalname);
                return result;
            }
            catch (error) {
                // Cleanup on error
                try {
                    yield promises_1.default.unlink(inputPath);
                    yield promises_1.default.unlink(outputPath);
                }
                catch (cleanupError) {
                    console.warn("Failed to cleanup files:", cleanupError);
                }
                throw error;
            }
        });
    }
    /**
     * Generate AI avatar for profile
     */
    generateAIAvatar(profileId_1, gender_1, age_1) {
        return __awaiter(this, arguments, void 0, function* (profileId, gender, age, ethnicity = "white") {
            try {
                // Use This Person Does Not Exist API or similar
                const avatarUrl = yield this.fetchAIGeneratedAvatar(gender, age, ethnicity);
                // Download and process the image
                const downloadedImagePath = yield this.downloadImage(avatarUrl);
                const processedPath = yield this.processAIAvatar(downloadedImagePath);
                const metadata = yield (0, sharp_1.default)(processedPath).metadata();
                const stats = yield promises_1.default.stat(processedPath);
                const filename = `ai_avatar_${profileId}_${Date.now()}.jpg`;
                const finalPath = path_1.default.join(this.uploadDir, filename);
                // Move processed image to final location
                yield promises_1.default.rename(processedPath, finalPath);
                const result = {
                    id: crypto_1.default.randomUUID(),
                    filename,
                    url: `/uploads/profiles/${filename}`,
                    type: PhotoType.AVATAR,
                    width: metadata.width || 0,
                    height: metadata.height || 0,
                    file_size: stats.size,
                };
                // Save to database
                yield this.savePhotoToDatabase(result, profileId, "AI Generated Avatar");
                return result;
            }
            catch (error) {
                console.error("Error generating AI avatar:", error);
                throw new Error("Failed to generate AI avatar");
            }
        });
    }
    /**
     * Get stock photo for profile based on demographics
     */
    getStockPhoto(profileId, demographics) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchTerms = this.buildStockPhotoSearchTerms(demographics);
            // Use Unsplash API or similar
            const stockPhotoUrl = yield this.fetchStockPhoto(searchTerms);
            const downloadedImagePath = yield this.downloadImage(stockPhotoUrl);
            const processedPath = yield this.processStockPhoto(downloadedImagePath);
            const metadata = yield (0, sharp_1.default)(processedPath).metadata();
            const stats = yield promises_1.default.stat(processedPath);
            const filename = `stock_${profileId}_${Date.now()}.jpg`;
            const finalPath = path_1.default.join(this.uploadDir, filename);
            yield promises_1.default.rename(processedPath, finalPath);
            const result = {
                id: crypto_1.default.randomUUID(),
                filename,
                url: `/uploads/profiles/${filename}`,
                type: PhotoType.PROFILE,
                width: metadata.width || 0,
                height: metadata.height || 0,
                file_size: stats.size,
            };
            yield this.savePhotoToDatabase(result, profileId, "Stock Photo");
            return result;
        });
    }
    /**
     * Delete photo and cleanup files
     */
    deletePhoto(photoId, profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get photo info from database
            const photo = yield this.getPhotoFromDatabase(photoId, profileId);
            if (photo) {
                // Delete files
                const filePath = path_1.default.join(this.uploadDir, photo.filename);
                const thumbnailPath = path_1.default.join(this.uploadDir, `thumb_${photo.filename}`);
                try {
                    yield promises_1.default.unlink(filePath);
                    yield promises_1.default.unlink(thumbnailPath);
                }
                catch (error) {
                    console.warn("Error deleting photo files:", error);
                }
                // Delete from database
                yield this.deletePhotoFromDatabase(photoId);
            }
        });
    }
    /**
     * Set photo as primary for profile
     */
    setPrimaryPhoto(photoId, profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, unset all other photos as primary for this profile
            yield this.unsetPrimaryPhotos(profileId);
            // Set this photo as primary
            yield this.updatePhotoAsPrimary(photoId, profileId);
        });
    }
    // === PRIVATE HELPER METHODS ===
    fetchAIGeneratedAvatar(gender, age, ethnicity) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation - replace with actual AI service
            const ageCategory = age < 30 ? "young" : age < 50 ? "middle" : "senior";
            // Example APIs:
            // - This Person Does Not Exist
            // - Generated Photos API
            // - Face Generator API
            return `https://this-person-does-not-exist.com/api/v1/person?gender=${gender}&age=${ageCategory}&ethnicity=${ethnicity}`;
        });
    }
    fetchStockPhoto(searchTerms) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock implementation - replace with Unsplash/Pexels API
            const query = searchTerms.join(" ");
            // Example: Unsplash API
            return `https://source.unsplash.com/800x800/?${encodeURIComponent(query)}`;
        });
    }
    buildStockPhotoSearchTerms(demographics) {
        const terms = ["portrait", "professional"];
        // Add gender
        terms.push(demographics.gender);
        // Add age category
        if (demographics.age < 30)
            terms.push("young");
        else if (demographics.age < 50)
            terms.push("adult");
        else
            terms.push("mature");
        // Add profession-related terms
        if (demographics.profession) {
            terms.push(demographics.profession.toLowerCase());
        }
        // Add interest-related terms (max 2)
        if (demographics.interests && demographics.interests.length > 0) {
            terms.push(...demographics.interests.slice(0, 2).map((i) => i.toLowerCase()));
        }
        return terms;
    }
    downloadImage(url) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation for downloading image from URL
            const response = yield fetch(url);
            const buffer = yield response.arrayBuffer();
            const filename = `temp_${crypto_1.default.randomUUID()}.jpg`;
            const tempPath = path_1.default.join(this.uploadDir, filename);
            yield promises_1.default.writeFile(tempPath, Buffer.from(buffer));
            return tempPath;
        });
    }
    processAIAvatar(inputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputPath = inputPath.replace("temp_", "processed_");
            yield (0, sharp_1.default)(inputPath).resize(400, 400, { fit: "cover" }).jpeg({ quality: 85 }).toFile(outputPath);
            // Cleanup temp file
            yield promises_1.default.unlink(inputPath);
            return outputPath;
        });
    }
    processStockPhoto(inputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputPath = inputPath.replace("temp_", "processed_");
            yield (0, sharp_1.default)(inputPath)
                .resize(800, 800, { fit: "inside", withoutEnlargement: true })
                .jpeg({ quality: 85 })
                .toFile(outputPath);
            yield promises_1.default.unlink(inputPath);
            return outputPath;
        });
    }
    // === DATABASE OPERATIONS ===
    savePhotoToDatabase(photo, profileId, originalFilename) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation depends on your database setup
            console.log("Saving photo to database:", {
                photoId: photo.id,
                profileId,
                filename: photo.filename,
                originalFilename,
                type: photo.type,
            });
        });
    }
    getPhotoFromDatabase(photoId, profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation depends on your database setup
            console.log("Getting photo from database:", { photoId, profileId });
            return null;
        });
    }
    deletePhotoFromDatabase(photoId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation depends on your database setup
            console.log("Deleting photo from database:", photoId);
        });
    }
    unsetPrimaryPhotos(profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation depends on your database setup
            console.log("Unsetting primary photos for profile:", profileId);
        });
    }
    updatePhotoAsPrimary(photoId, profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation depends on your database setup
            console.log("Setting photo as primary:", { photoId, profileId });
        });
    }
}
exports.PhotoManagerService = PhotoManagerService;
