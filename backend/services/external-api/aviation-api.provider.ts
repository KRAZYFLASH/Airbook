import axios from "axios";
import { AirlineApiProvider, ExternalAirlineData, ApiResponse } from "./types";

export class AviationApiProvider implements AirlineApiProvider {
  public readonly name = "Aviation API";
  private readonly baseUrl = "https://api.aviationapi.com/v1";
  private readonly timeout = 10000;

  private async makeRequest<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        timeout: this.timeout,
        headers: {
          "User-Agent": "Airbook/1.0",
          Accept: "application/json",
        },
      });

      return {
        success: true,
        data: response.data as T,
        source: this.name,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "API request failed",
        source: this.name,
      };
    }
  }

  async fetchAirlines(): Promise<ApiResponse<ExternalAirlineData[]>> {
    try {
      const response = await this.makeRequest<any[]>("/airlines");

      if (!response.success || !response.data) {
        return response;
      }

      const mappedData: ExternalAirlineData[] = response.data.map(
        (airline: any) => ({
          name: airline.name || airline.airline_name || "Unknown",
          code: airline.iata_code || airline.code || "XXX",
          country: airline.country || airline.country_name || "Unknown",
          logo: airline.logo_url || airline.logo,
          description: airline.description,
        })
      );

      return {
        success: true,
        data: mappedData,
        source: this.name,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch airlines",
        source: this.name,
      };
    }
  }

  async fetchAirlineByCode(
    code: string
  ): Promise<ApiResponse<ExternalAirlineData>> {
    try {
      const response = await this.makeRequest<any>(
        `/airlines/${code.toUpperCase()}`
      );

      if (!response.success || !response.data) {
        return response;
      }

      const airline = response.data;
      const mappedData: ExternalAirlineData = {
        name: airline.name || airline.airline_name || "Unknown",
        code: airline.iata_code || airline.code || code,
        country: airline.country || airline.country_name || "Unknown",
        logo: airline.logo_url || airline.logo,
        description: airline.description,
      };

      return {
        success: true,
        data: mappedData,
        source: this.name,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch airline",
        source: this.name,
      };
    }
  }
}
