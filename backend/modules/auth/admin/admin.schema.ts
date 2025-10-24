import { z } from "zod";

// Admin-specific validation schemas
export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const createAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Admin-specific types
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type CreateAdminInput = z.infer<typeof createAdminSchema>;

// Admin interface
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminAuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    admin: AdminResponse;
  };
}
