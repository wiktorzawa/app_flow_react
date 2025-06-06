import { Request, Response } from "express";
import { UserProfile, ProfileStatus } from "@shared-types/UserProfile";
import { ProfileDataGenerator } from "../services/ProfileDataGenerator";
import { PhotoManagerService, PhotoType } from "../services/PhotoManagerService";

interface MulterRequest extends Request {
  file?: any;
}

export class ProfileController {
  private dataGenerator = new ProfileDataGenerator();
  private photoManager = new PhotoManagerService();

  /**
   * Generate single realistic profile
   */
  public generateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const overrides = req.body || {};
      const profile = await this.dataGenerator.generateUserProfile(overrides);

      res.status(201).json({
        success: true,
        data: profile,
        message: "Profile generated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to generate profile",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Generate batch of profiles
   */
  public generateBatchProfiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const { count = 10 } = req.body;
      const profiles = await this.dataGenerator.generateBatchProfiles(count);

      res.status(201).json({
        success: true,
        data: profiles,
        count: profiles.length,
        message: `${profiles.length} profiles generated successfully`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to generate batch profiles",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Upload and process profile photo
   */
  public uploadProfilePhoto = async (req: MulterRequest, res: Response): Promise<void> => {
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

      const photoResult = await this.photoManager.processUploadedPhoto(file, profileId, PhotoType.AVATAR);

      res.status(201).json({
        success: true,
        data: photoResult,
        message: "Photo uploaded and processed successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to upload photo",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Generate AI avatar for profile
   */
  public generateAIAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { profileId } = req.params;
      const { gender, age, ethnicity = "white" } = req.body;

      const avatarResult = await this.photoManager.generateAIAvatar(profileId, gender, age, ethnicity);

      res.status(201).json({
        success: true,
        data: avatarResult,
        message: "AI avatar generated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to generate AI avatar",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Get profiles with filtering
   */
  public getProfiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status = ProfileStatus.ACTIVE, risk_level, city, age_min, age_max, page = 1, limit = 20 } = req.query;

      // Here you would query your database
      // This is just a demo response structure
      const mockProfiles: UserProfile[] = [];

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
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to fetch profiles",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
