// =============================================================
// Airport Service - Business logic untuk Airport management
// =============================================================

import { AirportRepository } from "./airport.repository";
import type {
  CreateAirportInput,
  UpdateAirportInput,
  AirportQueryInput,
} from "./airport.schemas";

export class AirportService {
  constructor(private airportRepository: AirportRepository) {}

  // Get all airports with pagination and filtering
  async getAirports(query: AirportQueryInput) {
    try {
      return await this.airportRepository.findMany(query);
    } catch (error) {
      throw new Error(
        `Gagal mengambil data airports: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Get airport by ID
  async getAirportById(id: string) {
    try {
      return await this.airportRepository.findById(id);
    } catch (error) {
      throw new Error(
        `Gagal mengambil data airport: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Get airport by IATA code
  async getAirportByIATA(iataCode: string) {
    if (!iataCode || iataCode.length !== 3) {
      throw new Error("Kode IATA harus 3 karakter");
    }

    try {
      const airport = await this.airportRepository.findByIATA(iataCode);
      if (!airport) {
        throw new Error(`Airport dengan kode IATA ${iataCode} tidak ditemukan`);
      }
      return airport;
    } catch (error) {
      throw new Error(
        `Gagal mencari airport: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Get airport by ICAO code
  async getAirportByICAO(icaoCode: string) {
    if (!icaoCode || icaoCode.length !== 4) {
      throw new Error("Kode ICAO harus 4 karakter");
    }

    try {
      const airport = await this.airportRepository.findByICAO(icaoCode);
      if (!airport) {
        throw new Error(`Airport dengan kode ICAO ${icaoCode} tidak ditemukan`);
      }
      return airport;
    } catch (error) {
      throw new Error(
        `Gagal mencari airport: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Create new airport
  async createAirport(data: CreateAirportInput) {
    // Validate coordinates if provided
    if (data.lat !== undefined && (data.lat < -90 || data.lat > 90)) {
      throw new Error("Latitude harus antara -90 dan 90");
    }

    if (data.lon !== undefined && (data.lon < -180 || data.lon > 180)) {
      throw new Error("Longitude harus antara -180 dan 180");
    }

    // Validate elevation if provided
    if (data.elevation !== undefined && data.elevation < -500) {
      throw new Error("Elevation tidak boleh kurang dari -500 meter");
    }

    try {
      return await this.airportRepository.create(data);
    } catch (error) {
      throw new Error(
        `Gagal membuat airport: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Update airport
  async updateAirport(id: string, data: UpdateAirportInput) {
    // Validate coordinates if provided
    if (data.lat !== undefined && (data.lat < -90 || data.lat > 90)) {
      throw new Error("Latitude harus antara -90 dan 90");
    }

    if (data.lon !== undefined && (data.lon < -180 || data.lon > 180)) {
      throw new Error("Longitude harus antara -180 dan 180");
    }

    // Validate elevation if provided
    if (data.elevation !== undefined && data.elevation < -500) {
      throw new Error("Elevation tidak boleh kurang dari -500 meter");
    }

    try {
      return await this.airportRepository.update(id, data);
    } catch (error) {
      throw new Error(
        `Gagal update airport: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Delete airport
  async deleteAirport(id: string) {
    try {
      return await this.airportRepository.delete(id);
    } catch (error) {
      throw new Error(
        `Gagal menghapus airport: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Toggle airport active status
  async toggleAirportStatus(id: string) {
    try {
      const airport = await this.airportRepository.findById(id);
      return await this.airportRepository.update(id, {
        isActive: !airport.isActive,
      });
    } catch (error) {
      throw new Error(
        `Gagal mengubah status airport: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Get dropdown data for forms
  async getDropdownData() {
    try {
      const countries = await this.airportRepository.getCountries();
      return { countries };
    } catch (error) {
      throw new Error(
        `Gagal mengambil data dropdown: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Get cities by country for cascading dropdown
  async getCitiesByCountry(countryId: string) {
    try {
      return await this.airportRepository.getCitiesByCountry(countryId);
    } catch (error) {
      throw new Error(
        `Gagal mengambil data cities: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Get airports for dropdown (used by flight schedule)
  async getAirportsForDropdown() {
    try {
      const result = await this.airportRepository.findMany({
        page: 1,
        limit: 1000, // Get all active airports
        isActive: true,
      });

      // Group by country for better UX
      const grouped = result.airports.reduce((acc: any, airport: any) => {
        const countryName = airport.country.name;
        if (!acc[countryName]) {
          acc[countryName] = [];
        }
        acc[countryName].push({
          id: airport.id,
          name: airport.name,
          iataCode: airport.iataCode,
          icaoCode: airport.icaoCode,
          city: airport.city.name,
        });
        return acc;
      }, {});

      return grouped;
    } catch (error) {
      throw new Error(
        `Gagal mengambil data airports untuk dropdown: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Search airports (for autocomplete)
  async searchAirports(query: string, limit: number = 10) {
    if (!query || query.length < 2) {
      throw new Error("Query pencarian minimal 2 karakter");
    }

    try {
      const result = await this.airportRepository.findMany({
        page: 1,
        limit,
        search: query,
        isActive: true,
      });

      return result.airports.map((airport: any) => ({
        id: airport.id,
        name: airport.name,
        iataCode: airport.iataCode,
        icaoCode: airport.icaoCode,
        city: airport.city.name,
        country: airport.country.name,
        displayName: `${airport.name} (${airport.iataCode}) - ${airport.city.name}, ${airport.country.name}`,
      }));
    } catch (error) {
      throw new Error(
        `Gagal mencari airports: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
