import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../auth.repo";
import {
  UserRegisterInput,
  UserLoginInput,
  UpdateUserProfileInput,
  ChangePasswordInput,
  UserAuthResponse,
  UserProfileResponse,
} from "./user.schema";

export class UserAuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: UserRegisterInput): Promise<UserAuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await this.authRepository.findByEmail(data.email);
      if (existingUser) {
        return {
          success: false,
          message: "User with this email already exists",
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Create user
      const user = await this.authRepository.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: "USER",
      });

      // Generate JWT token with user permissions
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          permissions: [
            "user_access",
            "make_bookings",
            "view_bookings",
            "manage_profile",
          ],
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      return {
        success: true,
        message: "User registered successfully",
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      };
    } catch (error) {
      console.error("Error in user registration:", error);
      return {
        success: false,
        message: "Failed to register user",
      };
    }
  }

  async login(data: UserLoginInput): Promise<UserAuthResponse> {
    try {
      // Find user by email
      const user = await this.authRepository.findByEmail(data.email);
      if (!user) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Check if user role is USER
      if (user.role !== "USER") {
        return {
          success: false,
          message: "Access denied. Please use the correct login page.",
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          message: "Your account has been deactivated. Please contact support.",
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );
      if (!isPasswordValid) {
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Generate JWT token with user permissions
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          permissions: [
            "user_access",
            "make_bookings",
            "view_bookings",
            "manage_profile",
          ],
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      return {
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            emailVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        },
      };
    } catch (error) {
      console.error("Error in user login:", error);
      return {
        success: false,
        message: "Failed to login",
      };
    }
  }

  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    try {
      const user = await this.authRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        message: "User profile retrieved successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          emailVerified: user.isVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      console.error("Error getting user profile:", error);
      return {
        success: false,
        message: "Failed to get user profile",
      };
    }
  }

  async updateUserProfile(
    userId: string,
    data: UpdateUserProfileInput
  ): Promise<UserProfileResponse> {
    try {
      // Check if email is being updated and if it already exists
      if (data.email) {
        const existingUser = await this.authRepository.findByEmail(data.email);
        if (existingUser && existingUser.id !== userId) {
          return {
            success: false,
            message: "Email already exists",
          };
        }
      }

      const updatedUser = await this.authRepository.update(userId, data);
      if (!updatedUser) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        message: "Profile updated successfully",
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          isActive: updatedUser.isActive,
          emailVerified: updatedUser.isVerified,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return {
        success: false,
        message: "Failed to update profile",
      };
    }
  }

  async changePassword(
    userId: string,
    data: ChangePasswordInput
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Get current user
      const user = await this.authRepository.findById(userId);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        data.currentPassword,
        user.password
      );
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: "Current password is incorrect",
        };
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(data.newPassword, 12);

      // Update password
      await this.authRepository.update(userId, {
        password: hashedNewPassword,
      });

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      console.error("Error changing password:", error);
      return {
        success: false,
        message: "Failed to change password",
      };
    }
  }

  async verifyEmail(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const updatedUser = await this.authRepository.update(userId, {
        isVerified: true,
      });

      if (!updatedUser) {
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        message: "Email verified successfully",
      };
    } catch (error) {
      console.error("Error verifying email:", error);
      return {
        success: false,
        message: "Failed to verify email",
      };
    }
  }
}
