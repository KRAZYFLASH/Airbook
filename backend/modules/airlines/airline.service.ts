import { AirlineRepository } from "./airline.repository";
import { CreateAirlineInput, UpdateAirlineInput } from "./airline.schemas";

export class AirlineService {
  private airlineRepository: AirlineRepository;

  constructor(airlineRepository: AirlineRepository) {
    this.airlineRepository = airlineRepository;
  }

  async getAllAirlines() {
    try {
      return await this.airlineRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getAirlineById(id: string) {
    try {
      return await this.airlineRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async getAirlineByCode(code: string) {
    try {
      return await this.airlineRepository.findByCode(code);
    } catch (error) {
      throw error;
    }
  }

  async createAirline(data: CreateAirlineInput) {
    try {
      // Business logic: Validate and normalize airline code
      const normalizedData = {
        ...data,
        code: data.code.toUpperCase(),
        name: data.name.trim(),
      };

      return await this.airlineRepository.create(normalizedData);
    } catch (error) {
      throw error;
    }
  }

  async updateAirline(id: string, data: UpdateAirlineInput) {
    try {
      // Business logic: Normalize data if provided
      const normalizedData: UpdateAirlineInput = {};

      if (data.code) {
        normalizedData.code = data.code.toUpperCase();
      }
      if (data.name) {
        normalizedData.name = data.name.trim();
      }
      if (data.countryId !== undefined) {
        normalizedData.countryId = data.countryId;
      }
      if (data.icaoCode !== undefined) {
        normalizedData.icaoCode = data.icaoCode;
      }
      if (data.logo !== undefined) {
        normalizedData.logo = data.logo;
      }
      if (data.website !== undefined) {
        normalizedData.website = data.website;
      }
      if (data.description !== undefined) {
        normalizedData.description = data.description;
      }
      if (data.isActive !== undefined) {
        normalizedData.isActive = data.isActive;
      }

      console.log("🔧 Service - Normalized update data:", normalizedData);

      return await this.airlineRepository.update(id, normalizedData);
    } catch (error) {
      throw error;
    }
  }

  async deleteAirline(id: string) {
    try {
      return await this.airlineRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async searchAirlines(query: string) {
    try {
      if (!query || query.trim().length === 0) {
        return await this.getAllAirlines();
      }

      return await this.airlineRepository.search(query.trim());
    } catch (error) {
      throw error;
    }
  }

  async getActiveAirlines() {
    try {
      const allAirlines = await this.getAllAirlines();
      return allAirlines.filter((airline: any) => airline.isActive);
    } catch (error) {
      throw error;
    }
  }
}
