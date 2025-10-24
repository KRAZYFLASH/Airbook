import { Request, Response } from "express";
import { AdminAuthService } from "./admin.service";
import { adminLoginSchema, createAdminSchema } from "./admin.schema";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export class AdminAuthController {
  private adminAuthService: AdminAuthService;

  constructor() {
    this.adminAuthService = new AdminAuthService();
  }

  // Admin login - hanya untuk admin yang sudah ada di database
  login = async (req: Request, res: Response) => {
    try {
      const validatedData = adminLoginSchema.parse(req.body);
      const result = await this.adminAuthService.adminLogin(validatedData);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Admin login controller error:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };

  // Get admin profile (protected endpoint)
  getProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const adminId = req.user?.userId;
      if (!adminId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const result = await this.adminAuthService.getAdminProfile(adminId);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      console.error("Get admin profile controller error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // Create new admin (protected endpoint)
  createAdmin = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const createdByAdminId = req.user?.userId;
      if (!createdByAdminId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      const validatedData = createAdminSchema.parse(req.body);
      const result = await this.adminAuthService.createAdmin(
        validatedData,
        createdByAdminId
      );

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        console.error("Create admin controller error:", error);
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };

  // Update admin status (activate/deactivate)
  updateAdminStatus = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { adminId } = req.params;
      const { isActive } = req.body;
      const updatedByAdminId = req.user?.userId;

      if (!updatedByAdminId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      if (typeof isActive !== "boolean") {
        res.status(400).json({
          success: false,
          message: "isActive must be a boolean value",
        });
        return;
      }

      const result = await this.adminAuthService.updateAdminStatus(
        adminId,
        isActive,
        updatedByAdminId
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Update admin status controller error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // Logout admin
  logout = async (req: Request, res: Response) => {
    try {
      res.status(200).json({
        success: true,
        message: "Admin logged out successfully",
      });
    } catch (error) {
      console.error("Admin logout controller error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
