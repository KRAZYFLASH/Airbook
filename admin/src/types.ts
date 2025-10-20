// =============================================================
// AirBook Admin — Types
// =============================================================

export type UUID = string;

export type Airline = {
  id: UUID;
  code: string; // e.g., "GA"
  name: string; // e.g., "Garuda Indonesia"
  icaoCode?: string;
  countryId: string;
  country?: { name: string }; // For populated data
  logo?: string;
  description?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// Simplified FlightSchedule for admin interface - represents both Flight and FlightSchedule data
export type FlightSchedule = {
  id: UUID;
  airlineId: string;
  flightNo: string;
  origin: string; // IATA code like "CGK"
  destination: string; // IATA code like "DPS"
  departure: string; // ISO datetime
  arrival: string; // ISO datetime
  classType: string; // "ECONOMY" | "BUSINESS" | "FIRST"
  availableSeats: number;
  totalSeats: number;
  basePrice: number;
  currentPrice: number;
  status: "SCHEDULED" | "DELAYED" | "CANCELLED" | "COMPLETED";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Promo = {
  id: UUID;
  title: string;
  description?: string;
  code?: string; // e.g., "AIRBOOK50"
  discountType: string; // "PERCENTAGE" | "FIXED"
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: string; // ISO date
  endDate: string; // ISO date
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  destinationId?: string;
  createdAt: string;
  updatedAt: string;
  // Relations
  destination?: {
    id: string;
    name: string;
  };
};

export type Airport = {
  id: UUID;
  name: string; // Airport name
  iataCode?: string; // 3-letter code like "CGK"
  icaoCode?: string; // 4-letter code like "WIII"
  cityId: string;
  countryId: string;
  municipality?: string; // Municipality/region
  lat?: number; // Latitude
  lon?: number; // Longitude
  elevation?: number; // in meters
  timezone?: string; // Timezone like "Asia/Jakarta"
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Relations (populated data)
  city?: { name: string };
  country?: { name: string };
};

export type Section =
  | "dashboard"
  | "airlines"
  | "schedules"
  | "promos"
  | "airports";

export type SortDir = "asc" | "desc";
