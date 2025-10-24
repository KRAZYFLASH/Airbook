import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { AuthRepository } from "../auth.repo";
import {
  AdminLoginInput,
  CreateAdminInput,
  AdminAuthResponse,
} from "./admin.schema";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export class AdminAuthService {
  private authRepo: AuthRepository;

  constructor() {
    this.authRepo = new AuthRepository();
  }

  async adminLogin(input: AdminLoginInput): Promise<AdminAuthResponse> {
    try {
      // Find user by email
      const user = await this.authRepo.findByEmail(input.email);
      if (!user) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Check if user is admin
      if (user.role !== "ADMIN") {
        return {
          success: false,
          message: "Access denied. Admin privileges required.",
        };
      }

      // Check if admin account is active
      if (!user.isActive) {
        return {
          success: false,
          message:
            "Admin account is deactivated. Please contact system administrator.",
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        input.password,
        user.password
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Generate JWT token with admin privileges
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          permissions: [
            "admin_access",
            "manage_users",
            "manage_content",
            "manage_bookings",
            "manage_airlines",
            "manage_airports",
          ],
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
      );

      return {
        success: true,
        message: "Admin login successful",
        data: {
          token,
          admin: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      };
    } catch (error) {
      console.error("Admin login error:", error);
      return {
        success: false,
        message: "Internal server error",
      };
    }
  }

  async getAdminProfile(adminId: string): Promise<AdminAuthResponse> {
    try {
      const admin = await this.authRepo.findById(adminId);
      if (!admin) {
        return {
          success: false,
          message: "Admin not found",
        };
      }

      if (admin.role !== "ADMIN") {
        return {
          success: false,
          message: "Access denied",
        };
      }

      return {
        success: true,
        message: "Admin profile retrieved successfully",
        data: {
          token: "", // Token not needed for profile
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            isActive: admin.isActive,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
          },
        },
      };
    } catch (error) {
      console.error("Get admin profile error:", error);
      return {
        success: false,
        message: "Internal server error",
      };
    }
  }

  // Method untuk membuat admin baru (hanya bisa dipanggil oleh super admin)
  async createAdmin(
    adminData: CreateAdminInput,
    createdByAdminId: string
  ): Promise<AdminAuthResponse> {
    try {
      // Verify creator is admin
      const creator = await this.authRepo.findById(createdByAdminId);
      if (!creator || creator.role !== "ADMIN") {
        return {
          success: false,
          message: "Only admin can create new admin accounts",
        };
      }

      // Check if admin already exists
      const existingAdmin = await this.authRepo.findByEmail(adminData.email);
      if (existingAdmin) {
        return {
          success: false,
          message: "Admin with this email already exists",
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 12);

      // Create admin
      const admin = await this.authRepo.create({
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: "ADMIN",
      });

      return {
        success: true,
        message: "Admin created successfully",
        data: {
          token: "",
          admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            isActive: admin.isActive,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
          },
        },
      };
    } catch (error) {
      console.error("Create admin error:", error);
      return {
        success: false,
        message: "Internal server error",
      };
    }
  }

  async updateAdminStatus(
    adminId: string,
    isActive: boolean,
    updatedByAdminId: string
  ): Promise<AdminAuthResponse> {
    try {
      // Verify updater is admin
      const updater = await this.authRepo.findById(updatedByAdminId);
      if (!updater || updater.role !== "ADMIN") {
        return {
          success: false,
          message: "Only admin can update admin status",
        };
      }

      // Cannot deactivate self
      if (adminId === updatedByAdminId && !isActive) {
        return {
          success: false,
          message: "Cannot deactivate your own account",
        };
      }

      const admin = await this.authRepo.findById(adminId);
      if (!admin || admin.role !== "ADMIN") {
        return {
          success: false,
          message: "Admin not found",
        };
      }

      // Update admin status (this would require adding updateStatus method to AuthRepository)
      // For now, we'll use the existing update method
      const updatedAdmin = await this.authRepo.update(adminId, {
        isActive,
      } as any);

      return {
        success: true,
        message: `Admin ${isActive ? "activated" : "deactivated"} successfully`,
        data: {
          token: "",
          admin: {
            id: updatedAdmin.id,
            name: updatedAdmin.name,
            email: updatedAdmin.email,
            role: updatedAdmin.role,
            isActive: updatedAdmin.isActive,
            createdAt: updatedAdmin.createdAt,
            updatedAt: updatedAdmin.updatedAt,
          },
        },
      };
    } catch (error) {
      console.error("Update admin status error:", error);
      return {
        success: false,
        message: "Internal server error",
      };
    }
  }
}
