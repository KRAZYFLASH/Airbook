import { z } from "zod";

export const AirlineSchema = z.object({
  name: z.string().min(1, "Airline name is required"),
  code: z
    .string()
    .min(2, "Airline code must be at least 2 characters")
    .max(3, "Airline code must be at most 3 characters"),
  countryId: z.string().min(1, "Country ID is required"),
  icaoCode: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  logo: z
    .string()
    .url("Logo must be a valid URL")
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  description: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  website: z
    .string()
    .url("Website must be a valid URL")
    .nullable()
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  isActive: z.boolean().default(true),
});

export const CreateAirlineSchema = AirlineSchema;
export const UpdateAirlineSchema = AirlineSchema.partial();

// Export types for TypeScript
export type CreateAirlineInput = z.infer<typeof CreateAirlineSchema>;
export type UpdateAirlineInput = z.infer<typeof UpdateAirlineSchema>;
