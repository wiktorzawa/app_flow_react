import multer from "multer";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import crypto from "crypto";
import type { Request } from "express";

export interface PhotoUploadResult {
  id: string;
  filename: string;
  url: string;
  type: PhotoType;
  width: number;
  height: number;
  file_size: number;
}

export enum PhotoType {
  AVATAR = "avatar",
  PROFILE = "profile",
  BACKGROUND = "background",
  DOCUMENT = "document",
}

export class PhotoManagerService {
  private uploadDir = process.env.UPLOAD_DIR || "./uploads/profiles";
  private maxFileSize = 5 * 1024 * 1024; // 5MB
  private allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  constructor() {
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Configure multer for photo uploads
   */
  public getMulterConfig() {
    const storage = multer.diskStorage({
      destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
      ) => {
        cb(null, this.uploadDir);
      },
      filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueId = crypto.randomUUID();
        const ext = path.extname(file.originalname);
        const filename = `${uniqueId}${ext}`;
        cb(null, filename);
      },
    });

    return multer({
      storage,
      limits: {
        fileSize: this.maxFileSize,
        files: 5, // Max 5 files per upload
      },
      fileFilter: (req, file, cb) => {
        if (this.allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          const error = new Error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
          cb(error);
        }
      },
    });
  }

  /**
   * Process uploaded photo (resize, optimize, generate thumbnails)
   */
  public async processUploadedPhoto(
    file: Express.Multer.File,
    profileId: string,
    type: PhotoType = PhotoType.PROFILE
  ): Promise<PhotoUploadResult> {
    const filename = file.filename;
    const inputPath = file.path;
    const outputPath = path.join(this.uploadDir, `processed_${filename}`);

    try {
      // Process image with Sharp
      const processedImage = await sharp(inputPath)
        .resize(800, 800, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toFile(outputPath);

      // Get image metadata
      const metadata = await sharp(outputPath).metadata();

      // Generate thumbnail for avatars
      if (type === PhotoType.AVATAR) {
        const thumbnailPath = path.join(this.uploadDir, `thumb_${filename}`);
        await sharp(outputPath).resize(150, 150, { fit: "cover" }).jpeg({ quality: 80 }).toFile(thumbnailPath);
      }

      // Remove original uploaded file
      await fs.unlink(inputPath);

      const result: PhotoUploadResult = {
        id: crypto.randomUUID(),
        filename: `processed_${filename}`,
        url: `/uploads/profiles/processed_${filename}`,
        type,
        width: metadata.width || 0,
        height: metadata.height || 0,
        file_size: processedImage.size,
      };

      // Save to database
      await this.savePhotoToDatabase(result, profileId, file.originalname);

      return result;
    } catch (error) {
      // Cleanup on error
      try {
        await fs.unlink(inputPath);
        await fs.unlink(outputPath);
      } catch (cleanupError) {
        console.warn("Failed to cleanup files:", cleanupError);
      }
      throw error;
    }
  }

  /**
   * Generate AI avatar for profile
   */
  public async generateAIAvatar(
    profileId: string,
    gender: "male" | "female",
    age: number,
    ethnicity: string = "white"
  ): Promise<PhotoUploadResult> {
    try {
      // Use This Person Does Not Exist API or similar
      const avatarUrl = await this.fetchAIGeneratedAvatar(gender, age, ethnicity);

      // Download and process the image
      const downloadedImagePath = await this.downloadImage(avatarUrl);
      const processedPath = await this.processAIAvatar(downloadedImagePath);

      const metadata = await sharp(processedPath).metadata();
      const stats = await fs.stat(processedPath);

      const filename = `ai_avatar_${profileId}_${Date.now()}.jpg`;
      const finalPath = path.join(this.uploadDir, filename);

      // Move processed image to final location
      await fs.rename(processedPath, finalPath);

      const result: PhotoUploadResult = {
        id: crypto.randomUUID(),
        filename,
        url: `/uploads/profiles/${filename}`,
        type: PhotoType.AVATAR,
        width: metadata.width || 0,
        height: metadata.height || 0,
        file_size: stats.size,
      };

      // Save to database
      await this.savePhotoToDatabase(result, profileId, "AI Generated Avatar");

      return result;
    } catch (error) {
      console.error("Error generating AI avatar:", error);
      throw new Error("Failed to generate AI avatar");
    }
  }

  /**
   * Get stock photo for profile based on demographics
   */
  public async getStockPhoto(
    profileId: string,
    demographics: {
      gender: "male" | "female";
      age: number;
      profession?: string;
      interests?: string[];
    }
  ): Promise<PhotoUploadResult> {
    const searchTerms = this.buildStockPhotoSearchTerms(demographics);

    // Use Unsplash API or similar
    const stockPhotoUrl = await this.fetchStockPhoto(searchTerms);

    const downloadedImagePath = await this.downloadImage(stockPhotoUrl);
    const processedPath = await this.processStockPhoto(downloadedImagePath);

    const metadata = await sharp(processedPath).metadata();
    const stats = await fs.stat(processedPath);

    const filename = `stock_${profileId}_${Date.now()}.jpg`;
    const finalPath = path.join(this.uploadDir, filename);

    await fs.rename(processedPath, finalPath);

    const result: PhotoUploadResult = {
      id: crypto.randomUUID(),
      filename,
      url: `/uploads/profiles/${filename}`,
      type: PhotoType.PROFILE,
      width: metadata.width || 0,
      height: metadata.height || 0,
      file_size: stats.size,
    };

    await this.savePhotoToDatabase(result, profileId, "Stock Photo");

    return result;
  }

  /**
   * Delete photo and cleanup files
   */
  public async deletePhoto(photoId: string, profileId: string): Promise<void> {
    // Get photo info from database
    const photo = await this.getPhotoFromDatabase(photoId, profileId);

    if (photo) {
      // Delete files
      const filePath = path.join(this.uploadDir, photo.filename);
      const thumbnailPath = path.join(this.uploadDir, `thumb_${photo.filename}`);

      try {
        await fs.unlink(filePath);
        await fs.unlink(thumbnailPath);
      } catch (error) {
        console.warn("Error deleting photo files:", error);
      }

      // Delete from database
      await this.deletePhotoFromDatabase(photoId);
    }
  }

  /**
   * Set photo as primary for profile
   */
  public async setPrimaryPhoto(photoId: string, profileId: string): Promise<void> {
    // First, unset all other photos as primary for this profile
    await this.unsetPrimaryPhotos(profileId);

    // Set this photo as primary
    await this.updatePhotoAsPrimary(photoId, profileId);
  }

  // === PRIVATE HELPER METHODS ===

  private async fetchAIGeneratedAvatar(gender: string, age: number, ethnicity: string): Promise<string> {
    // Mock implementation - replace with actual AI service
    const ageCategory = age < 30 ? "young" : age < 50 ? "middle" : "senior";

    // Example APIs:
    // - This Person Does Not Exist
    // - Generated Photos API
    // - Face Generator API

    return `https://this-person-does-not-exist.com/api/v1/person?gender=${gender}&age=${ageCategory}&ethnicity=${ethnicity}`;
  }

  private async fetchStockPhoto(searchTerms: string[]): Promise<string> {
    // Mock implementation - replace with Unsplash/Pexels API
    const query = searchTerms.join(" ");

    // Example: Unsplash API
    return `https://source.unsplash.com/800x800/?${encodeURIComponent(query)}`;
  }

  private buildStockPhotoSearchTerms(demographics: {
    gender: string;
    age: number;
    profession?: string;
    interests?: string[];
  }): string[] {
    const terms = ["portrait", "professional"];

    // Add gender
    terms.push(demographics.gender);

    // Add age category
    if (demographics.age < 30) terms.push("young");
    else if (demographics.age < 50) terms.push("adult");
    else terms.push("mature");

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

  private async downloadImage(url: string): Promise<string> {
    // Implementation for downloading image from URL
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    const filename = `temp_${crypto.randomUUID()}.jpg`;
    const tempPath = path.join(this.uploadDir, filename);

    await fs.writeFile(tempPath, Buffer.from(buffer));

    return tempPath;
  }

  private async processAIAvatar(inputPath: string): Promise<string> {
    const outputPath = inputPath.replace("temp_", "processed_");

    await sharp(inputPath).resize(400, 400, { fit: "cover" }).jpeg({ quality: 85 }).toFile(outputPath);

    // Cleanup temp file
    await fs.unlink(inputPath);

    return outputPath;
  }

  private async processStockPhoto(inputPath: string): Promise<string> {
    const outputPath = inputPath.replace("temp_", "processed_");

    await sharp(inputPath)
      .resize(800, 800, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    await fs.unlink(inputPath);

    return outputPath;
  }

  // === DATABASE OPERATIONS ===

  private async savePhotoToDatabase(
    photo: PhotoUploadResult,
    profileId: string,
    originalFilename: string
  ): Promise<void> {
    // Implementation depends on your database setup
    console.log("Saving photo to database:", {
      photoId: photo.id,
      profileId,
      filename: photo.filename,
      originalFilename,
      type: photo.type,
    });
  }

  private async getPhotoFromDatabase(photoId: string, profileId: string): Promise<any> {
    // Implementation depends on your database setup
    console.log("Getting photo from database:", { photoId, profileId });
    return null;
  }

  private async deletePhotoFromDatabase(photoId: string): Promise<void> {
    // Implementation depends on your database setup
    console.log("Deleting photo from database:", photoId);
  }

  private async unsetPrimaryPhotos(profileId: string): Promise<void> {
    // Implementation depends on your database setup
    console.log("Unsetting primary photos for profile:", profileId);
  }

  private async updatePhotoAsPrimary(photoId: string, profileId: string): Promise<void> {
    // Implementation depends on your database setup
    console.log("Setting photo as primary:", { photoId, profileId });
  }
}
