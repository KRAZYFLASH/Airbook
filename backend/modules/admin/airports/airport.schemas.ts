// =============================================================
// Airport Schema - Validation untuk CRUD operasi Airport
// =============================================================

import { z } from "zod";

// Schema untuk membuat airport baru
export const createAirportSchema = z.object({
  name: z
    .string()
    .min(1, "Nama bandara wajib diisi")
    .max(200, "Nama terlalu panjang"),
  iataCode: z
    .string()
    .length(3, "Kode IATA harus 3 karakter")
    .toUpperCase()
    .optional(),
  icaoCode: z
    .string()
    .length(4, "Kode ICAO harus 4 karakter")
    .toUpperCase()
    .optional(),
  cityId: z.string().min(1, "City ID wajib diisi"),
  countryId: z.string().min(1, "Country ID wajib diisi"),
  municipality: z.string().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
  elevation: z.number().int().optional(),
  timezone: z.string().optional().default("Asia/Jakarta"),
  isActive: z.boolean().default(true),
});

// Schema untuk update airport
export const updateAirportSchema = createAirportSchema.partial();

// Schema untuk validasi ID
export const airportIdSchema = z.object({
  id: z.string().min(1, "ID airport wajib diisi"),
});

// Schema untuk query parameters
export const airportQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform(Number)
    .refine((n) => n > 0, "Page harus > 0"),
  limit: z
    .string()
    .optional()
    .default("20")
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, "Limit 1-100"),
  search: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val === "true" ? true : val === "false" ? false : undefined
    ),
});

export type CreateAirportInput = z.infer<typeof createAirportSchema>;
export type UpdateAirportInput = z.infer<typeof updateAirportSchema>;
export type AirportQueryInput = z.infer<typeof airportQuerySchema>;
