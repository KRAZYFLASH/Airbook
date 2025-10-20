// =============================================================
// Database Airport Service - Frontend API Integration
// =============================================================

export interface DatabaseAirport {
  id: string;
  name: string;
  iataCode: string | null;
  icaoCode: string | null;
  city: {
    id: string;
    name: string;
    country: {
      id: string;
      name: string;
      code: string;
    };
  };
  timezone: string | null;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  continent: string;
  currency: string;
  timezone: string;
  isActive: boolean;
}

export interface CountryApiResponse {
  success: boolean;
  data: Country[];
  message?: string;
}

export interface AirportApiResponse {
  success: boolean;
  data: DatabaseAirport[];
  total: number;
  message?: string;
}

export interface AirportStatsResponse {
  success: boolean;
  data: {
    totalAirports: number;
    totalCities: number;
    totalCountries: number;
    topCountries: {
      country: {
        id: string;
        name: string;
        code: string;
      };
      airportCount: number;
    }[];
  };
}

const API_BASE_URL = "http://localhost:3001/api/db-airports";

export class DatabaseAirportService {
  /**
   * Get all airports from database
   */
  static async getAllAirports(): Promise<DatabaseAirport[]> {
    try {
      const response = await fetch(`${API_BASE_URL}`);
      const result: AirportApiResponse = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Failed to fetch airports");
      }
    } catch (error) {
      console.error("Error fetching all airports:", error);
      throw error;
    }
  }

  /**
   * Get Indonesian airports only
   */
  static async getIndonesianAirports(): Promise<DatabaseAirport[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/indonesian`);
      const result: AirportApiResponse = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(
          result.message || "Failed to fetch Indonesian airports"
        );
      }
    } catch (error) {
      console.error("Error fetching Indonesian airports:", error);
      throw error;
    }
  }

  /**
   * Get regional airports (ASEAN)
   */
  static async getRegionalAirports(): Promise<DatabaseAirport[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/regional`);
      const result: AirportApiResponse = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Failed to fetch regional airports");
      }
    } catch (error) {
      console.error("Error fetching regional airports:", error);
      throw error;
    }
  }

  /**
   * Get international airports
   */
  static async getInternationalAirports(): Promise<DatabaseAirport[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/international`);
      const result: AirportApiResponse = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(
          result.message || "Failed to fetch international airports"
        );
      }
    } catch (error) {
      console.error("Error fetching international airports:", error);
      throw error;
    }
  }

  /**
   * Search airports by query
   */
  static async searchAirports(query: string): Promise<DatabaseAirport[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
      );
      const result: AirportApiResponse = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Failed to search airports");
      }
    } catch (error) {
      console.error("Error searching airports:", error);
      throw error;
    }
  }

  /**
   * Get airports by country code
   */
  static async getAirportsByCountry(
    countryCode: string
  ): Promise<DatabaseAirport[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/country/${countryCode}`);
      const result: AirportApiResponse = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(
          result.message || "Failed to fetch airports by country"
        );
      }
    } catch (error) {
      console.error("Error fetching airports by country:", error);
      throw error;
    }
  }

  /**
   * Get airport by IATA code
   */
  static async getAirportByIATA(
    iataCode: string
  ): Promise<DatabaseAirport | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/iata/${iataCode}`);

      if (response.status === 404) {
        return null;
      }

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Failed to fetch airport");
      }
    } catch (error) {
      console.error("Error fetching airport by IATA:", error);
      throw error;
    }
  }

  /**
   * Get airports by city name
   */
  static async getAirportsByCity(cityName: string): Promise<DatabaseAirport[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/city/${encodeURIComponent(cityName)}`
      );
      const result: AirportApiResponse = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Failed to fetch airports by city");
      }
    } catch (error) {
      console.error("Error fetching airports by city:", error);
      throw error;
    }
  }

  /**
   * Get airport statistics
   */
  static async getAirportStats(): Promise<AirportStatsResponse["data"]> {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);
      const result: AirportStatsResponse = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error("Failed to fetch airport statistics");
      }
    } catch (error) {
      console.error("Error fetching airport stats:", error);
      throw error;
    }
  }

  /**
   * Convert DatabaseAirport to legacy Airport format for compatibility
   */
  static convertToLegacyFormat(dbAirport: DatabaseAirport) {
    return {
      iata: dbAirport.iataCode || "",
      icao: dbAirport.icaoCode || "",
      name: dbAirport.name,
      city: dbAirport.city.name,
      country: dbAirport.city.country.name,
      region:
        dbAirport.city.country.code === "ID" ? "Indonesia" : "International",
      timezone: dbAirport.timezone || "UTC",
    };
  }

  /**
   * Create new airport
   */
  static async createAirport(data: {
    name: string;
    iataCode?: string;
    icaoCode?: string;
    cityId: string;
    timezone?: string;
  }): Promise<DatabaseAirport> {
    try {
      const response = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Failed to create airport");
      }
    } catch (error) {
      console.error("Error creating airport:", error);
      throw error;
    }
  }

  /**
   * Update airport
   */
  static async updateAirport(
    id: string,
    data: {
      name?: string;
      iataCode?: string;
      icaoCode?: string;
      cityId?: string;
      timezone?: string;
    }
  ): Promise<DatabaseAirport> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Failed to update airport");
      }
    } catch (error) {
      console.error("Error updating airport:", error);
      throw error;
    }
  }

  /**
   * Delete airport
   */
  static async deleteAirport(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete airport");
      }
    } catch (error) {
      console.error("Error deleting airport:", error);
      throw error;
    }
  }

  /**
   * Get airport by ID
   */
  static async getAirportById(id: string): Promise<DatabaseAirport | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);

      if (response.status === 404) {
        return null;
      }

      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Failed to fetch airport");
      }
    } catch (error) {
      console.error("Error fetching airport by ID:", error);
      throw error;
    }
  }

  /**
   * Get all countries for dropdown
   */
  static async getAllCountries(): Promise<
    { id: string; name: string; code: string }[]
  > {
    try {
      const response = await fetch(`${API_BASE_URL}/dropdown/countries`);
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Failed to fetch countries");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      throw error;
    }
  }

  /**
   * Get cities by country for dropdown
   */
  static async getCitiesByCountry(
    countryId: string
  ): Promise<{ id: string; name: string }[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/dropdown/cities/${countryId}`
      );
      const result = await response.json();

      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || "Failed to fetch cities");
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      throw error;
    }
  }

  /**
   * Get all airports in legacy format for backward compatibility
   */
  static async getAllAirportsLegacyFormat() {
    const airports = await this.getAllAirports();
    return airports.map((airport) => this.convertToLegacyFormat(airport));
  }
}
