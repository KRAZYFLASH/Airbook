import { Request, Response } from "express";
import { UserAuthService } from "./user.service";
import {
  userRegisterSchema,
  userLoginSchema,
  updateUserProfileSchema,
  changePasswordSchema,
} from "./user.schema";

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
        permissions: string[];
      };
    }
  }
}

export class UserAuthController {
  private userAuthService: UserAuthService;

  constructor() {
    this.userAuthService = new UserAuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const validation = userRegisterSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.issues,
        });
        return;
      }

      const result = await this.userAuthService.register(validation.data);

      const statusCode = result.success ? 201 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Error in user registration controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate request body
      const validation = userLoginSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.issues,
        });
        return;
      }

      const result = await this.userAuthService.login(validation.data);

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Error in user login controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const result = await this.userAuthService.getUserProfile(userId);

      const statusCode = result.success ? 200 : 404;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Error in get user profile controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      // Validate request body
      const validation = updateUserProfileSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.issues,
        });
        return;
      }

      const result = await this.userAuthService.updateUserProfile(
        userId,
        validation.data
      );

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Error in update user profile controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      // Validate request body
      const validation = changePasswordSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.issues,
        });
        return;
      }

      const result = await this.userAuthService.changePassword(
        userId,
        validation.data
      );

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Error in change password controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
        return;
      }

      const result = await this.userAuthService.verifyEmail(userId);

      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error("Error in verify email controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      // For JWT tokens, logout is typically handled on the client side
      // by removing the token. Here we can perform any server-side cleanup if needed.

      res.status(200).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      console.error("Error in user logout controller:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
