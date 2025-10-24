import { z } from "zod";

// User-specific validation schemas
export const userRegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string().min(6, "Confirm new password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  });

// User-specific types
export type UserRegisterInput = z.infer<typeof userRegisterSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER";
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: UserResponse;
  };
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data?: UserResponse;
}
