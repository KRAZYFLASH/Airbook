import { z } from "zod";

// Validation schemas for new Prisma-based destination
export const createDestinationSchema = z.object({
  name: z.string().min(2, "Destination name must be at least 2 characters"),
  cityId: z.string().min(1, "City ID is required"),
  countryId: z.string().min(1, "Country ID is required"),
  airportId: z.string().min(1, "Airport ID is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  category: z.string().min(1, "Category is required"),
  rating: z.number().min(0).max(5).optional(),
  isFeatured: z.boolean().optional().default(false),
});

export const updateDestinationSchema = createDestinationSchema.partial();

export const searchDestinationSchema = z.object({
  query: z.string().min(1, "Search query is required").optional(),
  countryId: z.string().optional(),
  cityId: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean().optional(),
});

// Types
export type CreateDestinationInput = z.infer<typeof createDestinationSchema>;
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>;
export type SearchDestinationInput = z.infer<typeof searchDestinationSchema>;

// Updated interface to match Prisma schema
export interface Destination {
  id: string;
  name: string;
  cityId: string;
  countryId: string;
  airportId: string;
  description?: string;
  imageUrl?: string;
  category: string;
  rating?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Extended interface with relations for frontend display
export interface DestinationWithRelations extends Destination {
  city: {
    id: string;
    name: string;
  };
  country: {
    id: string;
    name: string;
  };
  airport: {
    id: string;
    name: string;
    iataCode: string;
  };
}

export interface DestinationResponse {
  success: boolean;
  message: string;
  data?:
    | Destination
    | Destination[]
    | DestinationWithRelations
    | DestinationWithRelations[]
    | LegacyDestination
    | LegacyDestination[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Legacy interface for backward compatibility with CSV data
export interface LegacyDestination {
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
