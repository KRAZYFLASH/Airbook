// =============================================================
// AirBook Admin — API Service for Database Connections
// =============================================================

import type { Airline, FlightSchedule, Promo } from "../types";

const API_BASE_URL = "http://localhost:3001/api";

// Generic API error handler
class ApiError extends Error {
  public status?: number;
  public data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// Generic API response types
type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type ApiDeleteResponse = {
  success: boolean;
  message: string;
};

// Generic fetch wrapper with error handling
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Debug logging
  console.log("🚀 API Request:", {
    url,
    method: options.method || "GET",
    body: options.body,
    headers: options.headers,
  });

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Debug logging
    console.log("📡 API Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ API Error:", errorData);
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// =============================================================
// Airlines API
// =============================================================
export const airlinesApi = {
  // Get all airlines
  getAll: () => apiCall<ApiResponse<Airline[]>>("/airlines"),

  // Get active airlines only
  getActive: () => apiCall<ApiResponse<Airline[]>>("/airlines/active"),

  // Get airline by ID
  getById: (id: string) => apiCall<ApiResponse<Airline>>(`/airlines/${id}`),

  // Create new airline
  create: (data: Partial<Airline>) =>
    apiCall<ApiResponse<Airline>>("/airlines", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update airline
  update: (id: string, data: Partial<Airline>) =>
    apiCall<ApiResponse<Airline>>(`/airlines/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete airline
  delete: (id: string) =>
    apiCall<ApiDeleteResponse>(`/airlines/${id}`, {
      method: "DELETE",
    }),

  // Search airlines
  search: (query: string) =>
    apiCall<ApiResponse<Airline[]>>(
      `/airlines/search?q=${encodeURIComponent(query)}`
    ),
};

// =============================================================
// Destinations API
// =============================================================
export const destinationsApi = {
  // Get all destinations
  getAll: () => apiCall<ApiResponse<unknown[]>>("/destinations"),

  // Get destination by ID
  getById: (id: string) => apiCall<ApiResponse<unknown>>(`/destinations/${id}`),

  // Create new destination
  create: (data: Record<string, unknown>) =>
    apiCall<ApiResponse<unknown>>("/destinations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update destination
  update: (id: string, data: Record<string, unknown>) =>
    apiCall<ApiResponse<unknown>>(`/destinations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete destination
  delete: (id: string) =>
    apiCall<ApiDeleteResponse>(`/destinations/${id}`, {
      method: "DELETE",
    }),

  // Search destinations
  search: (query: string) =>
    apiCall<ApiResponse<unknown[]>>(
      `/destinations/search?q=${encodeURIComponent(query)}`
    ),

  // Get popular destinations
  getPopular: () => apiCall<ApiResponse<unknown[]>>("/destinations/popular"),
};

// =============================================================
// Flight Schedules API (placeholder for when backend is created)
// =============================================================
export const flightSchedulesApi = {
  // Get all flight schedules
  getAll: () => apiCall<ApiResponse<FlightSchedule[]>>("/flight-schedules"),

  // Get flight schedule by ID
  getById: (id: string) =>
    apiCall<ApiResponse<FlightSchedule>>(`/flight-schedules/${id}`),

  // Create new flight schedule
  create: (data: Partial<FlightSchedule>) =>
    apiCall<ApiResponse<FlightSchedule>>("/flight-schedules", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update flight schedule
  update: (id: string, data: Partial<FlightSchedule>) =>
    apiCall<ApiResponse<FlightSchedule>>(`/flight-schedules/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete flight schedule
  delete: (id: string) =>
    apiCall<ApiDeleteResponse>(`/flight-schedules/${id}`, {
      method: "DELETE",
    }),

  // Get schedules by airline
  getByAirline: (airlineId: string) =>
    apiCall<ApiResponse<FlightSchedule[]>>(
      `/flight-schedules/airline/${airlineId}`
    ),
};

// =============================================================
// Promotions API (placeholder for when backend is created)
// =============================================================
export const promotionsApi = {
  // Get all promotions
  getAll: () => apiCall<ApiResponse<Promo[]>>("/promotions"),

  // Get promotion by ID
  getById: (id: string) => apiCall<ApiResponse<Promo>>(`/promotions/${id}`),

  // Create new promotion
  create: (data: Partial<Promo>) =>
    apiCall<ApiResponse<Promo>>("/promotions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update promotion
  update: (id: string, data: Partial<Promo>) =>
    apiCall<ApiResponse<Promo>>(`/promotions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete promotion
  delete: (id: string) =>
    apiCall<ApiDeleteResponse>(`/promotions/${id}`, {
      method: "DELETE",
    }),

  // Get active promotions
  getActive: () => apiCall<ApiResponse<Promo[]>>("/promotions/active"),
};

// =============================================================
// Export API error class for error handling
// =============================================================
export { ApiError };
