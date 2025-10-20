import { AirlineApiProvider, ExternalAirlineData, ApiResponse } from "./types";

export class StaticDataProvider implements AirlineApiProvider {
  public readonly name = "Static Data Provider";

  // Static airline data as fallback
  private readonly staticAirlines: ExternalAirlineData[] = [
    {
      name: "Garuda Indonesia",
      code: "GA",
      country: "Indonesia",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/14/Garuda_Indonesia_logo.svg",
      description: "National flag carrier of Indonesia",
    },
    {
      name: "Lion Air",
      code: "JT",
      country: "Indonesia",
      logo: "https://upload.wikimedia.org/wikipedia/en/4/4b/Lion_Air_logo.svg",
      description: "Low-cost airline based in Jakarta, Indonesia",
    },
    {
      name: "Citilink",
      code: "QG",
      country: "Indonesia",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3e/Citilink_logo.svg",
      description: "Indonesian low-cost airline subsidiary of Garuda Indonesia",
    },
    {
      name: "AirAsia",
      code: "AK",
      country: "Malaysia",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f5/AirAsia_Logo.svg",
      description: "Malaysian multinational low-cost airline",
    },
    {
      name: "Singapore Airlines",
      code: "SQ",
      country: "Singapore",
      logo: "https://upload.wikimedia.org/wikipedia/en/6/6b/Singapore_Airlines_Logo_2.svg",
      description: "Flag carrier airline of Singapore",
    },
    {
      name: "Emirates",
      code: "EK",
      country: "United Arab Emirates",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg",
      description: "Major airline based in Dubai, United Arab Emirates",
    },
    {
      name: "Turkish Airlines",
      code: "TK",
      country: "Turkey",
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/Turkish_Airlines_logo.svg",
      description: "National flag carrier airline of Turkey",
    },
    {
      name: "Qatar Airways",
      code: "QR",
      country: "Qatar",
      logo: "https://upload.wikimedia.org/wikipedia/en/9/9b/Qatar_Airways_Logo.svg",
      description: "State-owned flag carrier of Qatar",
    },
  ];

  async fetchAirlines(): Promise<ApiResponse<ExternalAirlineData[]>> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        data: this.staticAirlines,
        source: this.name,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch static airline data",
        source: this.name,
      };
    }
  }

  async fetchAirlineByCode(
    code: string
  ): Promise<ApiResponse<ExternalAirlineData>> {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const airline = this.staticAirlines.find(
        (a) => a.code.toLowerCase() === code.toLowerCase()
      );

      if (!airline) {
        return {
          success: false,
          error: "Airline not found",
          source: this.name,
        };
      }

      return {
        success: true,
        data: airline,
        source: this.name,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Failed to fetch airline data",
        source: this.name,
      };
    }
  }
}
