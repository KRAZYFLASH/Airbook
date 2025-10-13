import { z } from "zod";

// Base Booking model matching Prisma schema
export const BookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  destinationId: z.string(),
  fromDestinationId: z.string(),
  departureDate: z.date(),
  returnDate: z.date().optional(),
  passengers: z.number().int().min(1).max(10),
  bookingClass: z.enum(["ECONOMY", "BUSINESS", "FIRST"]),
  totalPrice: z.number().positive(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  bookingReference: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input schemas for API
export const CreateBookingSchema = z.object({
  destinationId: z.string().min(1, "Destination is required"),
  fromDestinationId: z.string().min(1, "From destination is required"),
  departureDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return parsedDate > new Date();
  }, "Departure date must be in the future"),
  returnDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return parsedDate > new Date();
    }, "Return date must be in the future"),
  passengers: z
    .number()
    .int()
    .min(1, "At least 1 passenger required")
    .max(10, "Maximum 10 passengers"),
  bookingClass: z.enum(["ECONOMY", "BUSINESS", "FIRST"]).default("ECONOMY"),
});

export const UpdateBookingSchema = z.object({
  departureDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return parsedDate > new Date();
    }, "Departure date must be in the future"),
  returnDate: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return parsedDate > new Date();
    }, "Return date must be in the future"),
  passengers: z.number().int().min(1).max(10).optional(),
  bookingClass: z.enum(["ECONOMY", "BUSINESS", "FIRST"]).optional(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
});

export const BookingQuerySchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

// Response schemas
export const BookingResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  destination: z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    country: z.string(),
    code: z.string(),
    airport: z.string(),
  }),
  fromDestination: z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    country: z.string(),
    code: z.string(),
    airport: z.string(),
  }),
  departureDate: z.date(),
  returnDate: z.date().optional(),
  passengers: z.number(),
  bookingClass: z.string(),
  totalPrice: z.number(),
  status: z.string(),
  bookingReference: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BookingListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    bookings: z.array(BookingResponseSchema),
    total: z.number(),
    hasMore: z.boolean(),
  }),
});

export const BookingCreateResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: BookingResponseSchema,
});

// Type exports
export type Booking = z.infer<typeof BookingSchema>;
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingInput = z.infer<typeof UpdateBookingSchema>;
export type BookingQuery = z.infer<typeof BookingQuerySchema>;
export type BookingResponse = z.infer<typeof BookingResponseSchema>;
export type BookingListResponse = z.infer<typeof BookingListResponseSchema>;
export type BookingCreateResponse = z.infer<typeof BookingCreateResponseSchema>;

// Price calculation helpers
export const PRICE_PER_PASSENGER = {
  ECONOMY: 1000000, // 1 juta IDR base price
  BUSINESS: 2500000, // 2.5 juta IDR
  FIRST: 5000000, // 5 juta IDR
};

export const DISTANCE_MULTIPLIER = {
  DOMESTIC: 1, // Indonesia domestic
  INTERNATIONAL: 2.5, // International flights
};
