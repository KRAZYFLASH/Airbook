import { DestinationRepository } from "./destination.repo";
import {
  CsvImportService,
  ProcessedAirportData,
} from "../../services/import/csv.service";
import {
  CreateDestinationInput,
  UpdateDestinationInput,
  DestinationResponse,
  LegacyDestination,
} from "./destination.schema";

export class DestinationService {
  private destinationRepo: DestinationRepository;
  private csvImport: CsvImportService;

  constructor() {
    this.destinationRepo = new DestinationRepository();
    this.csvImport = new CsvImportService();
  }

  // Search airports from CSV (live search without saving to DB)
  async searchAirportsFromCSV(query: string): Promise<DestinationResponse> {
    try {
      const airports = await this.csvImport.searchAirports(query, 20);

      // Transform to our destination format (legacy format for backward compatibility)
      const destinations: LegacyDestination[] = airports.map((airport) => ({
        id: airport.code,
        name: airport.name,
        city: airport.city,
        country: airport.country,
        airport: airport.airport,
        code: airport.code,
        description: airport.description,
        imageUrl: airport.imageUrl,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      return {
        success: true,
        message: `Found ${destinations.length} airports from CSV`,
        data: destinations,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to search airports from CSV",
      };
    }
  }

  // Get Indonesian airports from CSV
  async getIndonesianAirportsFromCSV(): Promise<DestinationResponse> {
    try {
      const airports = await this.csvImport.getIndonesianAirports(30);

      const destinations: LegacyDestination[] = airports.map((airport) => ({
        id: airport.code,
        name: airport.name,
        city: airport.city,
        country: airport.country,
        airport: airport.airport,
        code: airport.code,
        description: airport.description,
        imageUrl: airport.imageUrl,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      return {
        success: true,
        message: "Indonesian airports retrieved from CSV",
        data: destinations,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to get Indonesian airports from CSV",
      };
    }
  }

  // Database operations using new Prisma schema
  async getAllDestinations(
    page: number = 1,
    limit: number = 10,
    isActive?: boolean
  ): Promise<DestinationResponse> {
    try {
      const { destinations, total } =
        await this.destinationRepo.findAllWithRelations(page, limit, isActive);
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        message: "Destinations retrieved successfully",
        data: destinations,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to retrieve destinations",
      };
    }
  }

  async getDestinationById(id: string): Promise<DestinationResponse> {
    try {
      const destination = await this.destinationRepo.findByIdWithRelations(id);

      if (!destination) {
        return {
          success: false,
          message: "Destination not found",
        };
      }

      return {
        success: true,
        message: "Destination retrieved successfully",
        data: destination,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to retrieve destination",
      };
    }
  }

  async createDestination(
    destinationData: CreateDestinationInput
  ): Promise<DestinationResponse> {
    try {
      const destination = await this.destinationRepo.create(destinationData);

      return {
        success: true,
        message: "Destination created successfully",
        data: destination,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to create destination",
      };
    }
  }

  async updateDestination(
    id: string,
    destinationData: UpdateDestinationInput
  ): Promise<DestinationResponse> {
    try {
      // Check if destination exists
      const existingDestination = await this.destinationRepo.findById(id);
      if (!existingDestination) {
        return {
          success: false,
          message: "Destination not found",
        };
      }

      const destination = await this.destinationRepo.update(
        id,
        destinationData
      );

      return {
        success: true,
        message: "Destination updated successfully",
        data: destination,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to update destination",
      };
    }
  }

  async deleteDestination(id: string): Promise<DestinationResponse> {
    try {
      const existingDestination = await this.destinationRepo.findById(id);
      if (!existingDestination) {
        return {
          success: false,
          message: "Destination not found",
        };
      }

      await this.destinationRepo.softDelete(id);

      return {
        success: true,
        message: "Destination deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete destination",
      };
    }
  }

  async searchDestinations(
    query?: string,
    country?: string,
    isActive?: boolean
  ): Promise<DestinationResponse> {
    try {
      const destinations = await this.destinationRepo.searchWithRelations(
        query,
        undefined, // countryId not available from legacy API
        undefined, // cityId not available from legacy API
        undefined, // category not available from legacy API
        isActive
      );

      return {
        success: true,
        message: `Found ${destinations.length} destination(s)`,
        data: destinations,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to search destinations",
      };
    }
  }

  // New methods for enhanced functionality
  async searchDestinationsAdvanced(
    query?: string,
    countryId?: string,
    cityId?: string,
    category?: string,
    isActive?: boolean
  ): Promise<DestinationResponse> {
    try {
      const destinations = await this.destinationRepo.searchWithRelations(
        query,
        countryId,
        cityId,
        category,
        isActive
      );

      return {
        success: true,
        message: `Found ${destinations.length} destination(s)`,
        data: destinations,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to search destinations",
      };
    }
  }

  async getPopularDestinations(
    limit: number = 6
  ): Promise<DestinationResponse> {
    try {
      const destinations = await this.destinationRepo.getPopularWithRelations(
        limit
      );

      return {
        success: true,
        message: "Popular destinations retrieved successfully",
        data: destinations,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to get popular destinations",
      };
    }
  }
}
