import { AirlineApiProvider, ExternalAirlineData, ApiResponse } from "./types";
import { AviationApiProvider } from "./aviation-api.provider";
import { StaticDataProvider } from "./static-data.provider";

export class ExternalAirlineService {
  private providers: AirlineApiProvider[];
  private primaryProvider: AirlineApiProvider;
  private fallbackProvider: AirlineApiProvider;

  constructor() {
    this.providers = [new AviationApiProvider(), new StaticDataProvider()];

    this.primaryProvider = this.providers[0]; // Aviation API
    this.fallbackProvider = this.providers[1]; // Static Data
  }

  async fetchAirlines(): Promise<ApiResponse<ExternalAirlineData[]>> {
    try {
      // Try primary provider first
      console.log(`Fetching airlines from ${this.primaryProvider.name}...`);
      const primaryResponse = await this.primaryProvider.fetchAirlines();

      if (primaryResponse.success && primaryResponse.data) {
        return primaryResponse;
      }

      // Fallback to static data
      console.log(
        `Primary provider failed, using ${this.fallbackProvider.name}...`
      );
      return await this.fallbackProvider.fetchAirlines();
    } catch (error: any) {
      // If everything fails, return fallback
      console.error("All providers failed, using fallback data");
      return await this.fallbackProvider.fetchAirlines();
    }
  }

  async fetchAirlineByCode(
    code: string
  ): Promise<ApiResponse<ExternalAirlineData>> {
    try {
      // Try primary provider first
      console.log(
        `Fetching airline ${code} from ${this.primaryProvider.name}...`
      );
      const primaryResponse = await this.primaryProvider.fetchAirlineByCode(
        code
      );

      if (primaryResponse.success && primaryResponse.data) {
        return primaryResponse;
      }

      // Fallback to static data
      console.log(
        `Primary provider failed, using ${this.fallbackProvider.name}...`
      );
      return await this.fallbackProvider.fetchAirlineByCode(code);
    } catch (error: any) {
      // If everything fails, return fallback
      console.error("All providers failed, using fallback data");
      return await this.fallbackProvider.fetchAirlineByCode(code);
    }
  }

  async syncAirlinesFromExternal(): Promise<{
    success: boolean;
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    try {
      const response = await this.fetchAirlines();

      if (!response.success || !response.data) {
        return {
          success: false,
          imported: 0,
          skipped: 0,
          errors: [response.error || "Failed to fetch external data"],
        };
      }

      let imported = 0;
      let skipped = 0;
      const errors: string[] = [];

      // Here you would integrate with your AirlineService to save the data
      // For now, just return the count
      for (const airline of response.data) {
        try {
          // Mock import logic - in real implementation, you'd call AirlineService.createAirline
          console.log(`Would import: ${airline.name} (${airline.code})`);
          imported++;
        } catch (error: any) {
          errors.push(`Failed to import ${airline.name}: ${error.message}`);
          skipped++;
        }
      }

      return {
        success: true,
        imported,
        skipped,
        errors,
      };
    } catch (error: any) {
      return {
        success: false,
        imported: 0,
        skipped: 0,
        errors: [error.message || "Sync operation failed"],
      };
    }
  }

  getAvailableProviders(): string[] {
    return this.providers.map((p) => p.name);
  }
}
