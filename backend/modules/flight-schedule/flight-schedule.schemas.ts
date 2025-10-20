import { z } from "zod";

export const FlightScheduleSchema = z.object({
  airlineId: z.string().min(1, "Airline ID is required"),
  flightNo: z.string().min(1, "Flight number is required"),
  origin: z.string().length(3, "Origin must be 3-letter IATA code"),
  destination: z.string().length(3, "Destination must be 3-letter IATA code"),
  departure: z.string().datetime("Invalid departure datetime"),
  arrival: z.string().datetime("Invalid arrival datetime"),
  classType: z.enum(["ECONOMY", "BUSINESS", "FIRST"]).default("ECONOMY"),
  availableSeats: z
    .number()
    .int()
    .positive("Available seats must be positive integer"),
  totalSeats: z.number().int().positive("Total seats must be positive integer"),
  basePrice: z.number().positive("Base price must be positive"),
  currentPrice: z.number().positive("Current price must be positive"),
  status: z
    .enum(["SCHEDULED", "DELAYED", "CANCELLED", "COMPLETED"])
    .default("SCHEDULED"),
  isActive: z.boolean().default(true),
});

export const CreateFlightScheduleSchema = FlightScheduleSchema;
export const UpdateFlightScheduleSchema = FlightScheduleSchema.partial();

export type CreateFlightScheduleInput = z.infer<
  typeof CreateFlightScheduleSchema
>;
export type UpdateFlightScheduleInput = z.infer<
  typeof UpdateFlightScheduleSchema
>;
