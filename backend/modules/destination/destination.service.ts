import { DestinationRepository } from "./destination.repo";
import {
  CsvImportService,
  ProcessedAirportData,
} from "../../services/csv-import.service";
import {
  CreateDestinationInput,
  UpdateDestinationInput,
  DestinationResponse,
} from "./destination.schema";

export class DestinationService {
  private destinationRepo: DestinationRepository;
  private csvImport: CsvImportService;

  constructor() {
    this.destinationRepo = new DestinationRepository();
    this.csvImport = new CsvImportService();
  }

  // Import airports from CSV to database
  async importAirportsFromCSV(options?: {
    countries?: string[];
    types?: string[];
    limit?: number;
    overwrite?: boolean;
  }): Promise<DestinationResponse> {
    try {
      console.log("🔄 Starting CSV import process...");

      let airports: ProcessedAirportData[] = [];

      if (options?.countries?.includes("ID")) {
        // Get Indonesian airports specifically
        airports = await this.csvImport.getIndonesianAirports(
          options.limit || 50
        );
      } else {
        // Get popular international airports
        airports = await this.csvImport.getPopularInternationalAirports(
          options?.limit || 100
        );
      }

      const imported = [];
      const skipped = [];
      const errors = [];

      for (const airport of airports) {
        try {
          // Check if airport already exists
          const existing = await this.destinationRepo.findByCode(airport.code);

          if (existing && !options?.overwrite) {
            skipped.push(airport.code);
            continue;
          }

          const destinationData: CreateDestinationInput = {
            name: airport.name,
            city: airport.city,
            country: airport.country,
            airport: airport.airport,
            code: airport.code,
            description: airport.description,
            imageUrl: airport.imageUrl,
          };

          if (existing && options?.overwrite) {
            // Update existing
            const updated = await this.destinationRepo.update(
              existing.id,
              destinationData
            );
            imported.push(updated);
          } else {
            // Create new
            const created = await this.destinationRepo.create(destinationData);
            imported.push(created);
          }
        } catch (error) {
          errors.push(`Failed to import ${airport.code}: ${error}`);
          console.error(`❌ Failed to import ${airport.code}:`, error);
        }
      }

      return {
        success: true,
        message: `CSV import completed: ${imported.length} imported, ${skipped.length} skipped, ${errors.length} errors`,
        data: {
          imported: imported.length,
          skipped: skipped.length,
          errors: errors.length,
          details: {
            importedCodes: imported.map((d) => d.code),
            skippedCodes: skipped,
            errorMessages: errors.slice(0, 5), // First 5 errors only
          },
        } as any,
      };
    } catch (error) {
      console.error("❌ CSV import failed:", error);
      return {
        success: false,
        message: "Failed to import airports from CSV",
      };
    }
  }

  // Search airports from CSV (live search without saving to DB)
  async searchAirportsFromCSV(query: string): Promise<DestinationResponse> {
    try {
      const airports = await this.csvImport.searchAirports(query, 20);

      // Transform to our destination format
      const destinations = airports.map((airport) => ({
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

      const destinations = airports.map((airport) => ({
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

  // Get international airports from CSV
  async getInternationalAirportsFromCSV(): Promise<DestinationResponse> {
    try {
      const airports = await this.csvImport.getPopularInternationalAirports(50);

      const destinations = airports.map((airport) => ({
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
        message: "International airports retrieved from CSV",
        data: destinations,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to get international airports from CSV",
      };
    }
  }

  // Bulk import Indonesian airports
  async bulkImportIndonesianAirports(): Promise<DestinationResponse> {
    return this.importAirportsFromCSV({
      countries: ["ID"],
      types: ["large_airport", "medium_airport"],
      limit: 50,
      overwrite: false,
    });
  }

  // Bulk import international airports
  async bulkImportInternationalAirports(): Promise<DestinationResponse> {
    return this.importAirportsFromCSV({
      limit: 100,
      overwrite: false,
    });
  }

  // Existing methods remain the same...
  async getAllDestinations(
    page: number = 1,
    limit: number = 10,
    isActive?: boolean
  ): Promise<DestinationResponse> {
    try {
      const { destinations, total } = await this.destinationRepo.findAll(
        page,
        limit,
        isActive
      );
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
      const destination = await this.destinationRepo.findById(id);

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
      // Check if airport code already exists
      const existingDestination = await this.destinationRepo.findByCode(
        destinationData.code
      );
      if (existingDestination) {
        return {
          success: false,
          message: "Airport code already exists",
        };
      }

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

      // Check if new airport code conflicts (if provided)
      if (
        destinationData.code &&
        destinationData.code !== existingDestination.code
      ) {
        const codeExists = await this.destinationRepo.findByCode(
          destinationData.code
        );
        if (codeExists) {
          return {
            success: false,
            message: "Airport code already exists",
          };
        }
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

  async searchDestinations(
    query?: string,
    country?: string,
    isActive?: boolean
  ): Promise<DestinationResponse> {
    try {
      const destinations = await this.destinationRepo.search(
        query,
        country,
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
}
