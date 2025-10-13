import { z } from "zod";

// Validation schemas
export const createDestinationSchema = z.object({
  name: z.string().min(2, "Destination name must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  airport: z.string().min(2, "Airport name must be at least 2 characters"),
  code: z.string().length(3, "Airport code must be exactly 3 characters").toUpperCase(),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
});

export const updateDestinationSchema = createDestinationSchema.partial();

export const searchDestinationSchema = z.object({
  query: z.string().min(1, "Search query is required").optional(),
  country: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Types
export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;
export type SearchDestinationInput = z.infer<typeof searchDestinationSchema>;

export interface Destination {
  id: string;
  name: string;
  city: string;
  country: string;
  airport: string;
  code: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DestinationResponse {
  success: boolean;
  message: string;
  data?: Destination | Destination[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}