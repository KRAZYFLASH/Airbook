import axios from "axios";
import csv from "csv-parser";
import { Readable } from "stream";

export interface OurAirportsData {
  id: string;
  ident: string;
  type: string;
  name: string;
  latitude_deg: string;
  longitude_deg: string;
  elevation_ft: string;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string;
  scheduled_service: string;
  gps_code: string;
  iata_code: string;
  local_code: string;
  home_link: string;
  wikipedia_link: string;
  keywords: string;
}

export interface ProcessedAirportData {
  name: string;
  city: string;
  country: string;
  airport: string;
  code: string;
  description?: string;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  type: string;
  continent: string;
}

export class CsvImportService {
  private csvUrl: string;

  constructor() {
    this.csvUrl =
      process.env.OURAIRPORTS_CSV_URL ||
      "https://davidmegginson.github.io/ourairports-data/airports.csv";
  }

  // Download and parse CSV data
  async downloadAirportsCSV(): Promise<OurAirportsData[]> {
    try {
      console.log("🔄 Downloading airports CSV data...");

      const response = await axios.get(this.csvUrl, {
        responseType: "stream",
        timeout: 30000, // 30 seconds timeout
      });

      const results: OurAirportsData[] = [];

      return new Promise((resolve, reject) => {
        (response.data as any)
          .pipe(csv())
          .on("data", (data: OurAirportsData) => {
            results.push(data);
          })
          .on("end", () => {
            console.log(
              `✅ Successfully parsed ${results.length} airports from CSV`
            );
            resolve(results);
          })
          .on("error", (error: any) => {
            console.error("❌ Error parsing CSV:", error);
            reject(error);
          });
      });
    } catch (error) {
      console.error("❌ Error downloading CSV:", error);
      throw new Error("Failed to download airports CSV data");
    }
  }

  // Filter and process airports data
  processAirportsData(
    rawData: OurAirportsData[],
    options?: {
      countries?: string[];
      types?: string[];
      hasIataCode?: boolean;
      limit?: number;
    }
  ): ProcessedAirportData[] {
    let filtered = rawData;

    // Filter by country codes (ISO 2-letter codes)
    if (options?.countries && options.countries.length > 0) {
      filtered = filtered.filter((airport) =>
        options.countries!.includes(airport.iso_country.toUpperCase())
      );
    }

    // Filter by airport types
    if (options?.types && options.types.length > 0) {
      filtered = filtered.filter((airport) =>
        options.types!.includes(airport.type)
      );
    }

    // Filter only airports with IATA codes
    if (options?.hasIataCode) {
      filtered = filtered.filter(
        (airport) => airport.iata_code && airport.iata_code.length === 3
      );
    }

    // Apply limit
    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    // Transform to our format
    const processed = filtered
      .map((airport) => {
        const city =
          airport.municipality || this.extractCityFromName(airport.name);
        const country = this.getCountryName(airport.iso_country);

        return {
          name: city,
          city: city,
          country: country,
          airport: airport.name,
          code: airport.iata_code || airport.ident,
          description: this.generateDescription(airport),
          imageUrl: this.generateImageUrl(city, country),
          latitude: airport.latitude_deg
            ? parseFloat(airport.latitude_deg)
            : undefined,
          longitude: airport.longitude_deg
            ? parseFloat(airport.longitude_deg)
            : undefined,
          type: airport.type,
          continent: airport.continent,
        };
      })
      .filter((airport) => airport.code && airport.code.length >= 3);

    return processed;
  }

  // Get Indonesian airports specifically
  async getIndonesianAirports(
    limit: number = 50
  ): Promise<ProcessedAirportData[]> {
    try {
      const rawData = await this.downloadAirportsCSV();

      return this.processAirportsData(rawData, {
        countries: ["ID"], // Indonesia
        types: ["large_airport", "medium_airport"], // Major airports only
        hasIataCode: true,
        limit: limit,
      });
    } catch (error) {
      console.error("❌ Error getting Indonesian airports:", error);
      return this.getFallbackIndonesianAirports();
    }
  }

  // Get popular international airports
  async getPopularInternationalAirports(
    limit: number = 100
  ): Promise<ProcessedAirportData[]> {
    try {
      const rawData = await this.downloadAirportsCSV();

      // Popular countries for international travel
      const popularCountries = [
        "ID",
        "SG",
        "MY",
        "TH",
        "VN",
        "PH",
        "JP",
        "KR",
        "CN",
        "AU",
        "US",
        "GB",
        "FR",
        "DE",
        "NL",
        "AE",
        "SA",
      ];

      return this.processAirportsData(rawData, {
        countries: popularCountries,
        types: ["large_airport"], // Large airports only
        hasIataCode: true,
        limit: limit,
      });
    } catch (error) {
      console.error("❌ Error getting international airports:", error);
      return [];
    }
  }

  // Search airports by query
  async searchAirports(
    query: string,
    limit: number = 20
  ): Promise<ProcessedAirportData[]> {
    try {
      const rawData = await this.downloadAirportsCSV();

      const searchTerm = query.toLowerCase();
      const filtered = rawData.filter((airport) => {
        return (
          airport.name.toLowerCase().includes(searchTerm) ||
          airport.municipality?.toLowerCase().includes(searchTerm) ||
          airport.iata_code?.toLowerCase().includes(searchTerm) ||
          airport.iso_country.toLowerCase().includes(searchTerm)
        );
      });

      return this.processAirportsData(filtered, {
        hasIataCode: true,
        limit: limit,
      });
    } catch (error) {
      console.error("❌ Error searching airports:", error);
      return [];
    }
  }

  // Utility functions
  private extractCityFromName(airportName: string): string {
    // Remove common airport suffixes
    const cleaned = airportName
      .replace(/\s+(International\s+)?Airport$/i, "")
      .replace(/\s+(Regional\s+)?Airfield$/i, "")
      .replace(/\s+Air\s+Base$/i, "")
      .replace(/\s+Aerodrome$/i, "");

    return cleaned.trim();
  }

  private getCountryName(countryCode: string): string {
    const countryMap: { [key: string]: string } = {
      ID: "Indonesia",
      SG: "Singapore",
      MY: "Malaysia",
      TH: "Thailand",
      VN: "Vietnam",
      PH: "Philippines",
      JP: "Japan",
      KR: "South Korea",
      CN: "China",
      AU: "Australia",
      US: "United States",
      GB: "United Kingdom",
      FR: "France",
      DE: "Germany",
      NL: "Netherlands",
      AE: "United Arab Emirates",
      SA: "Saudi Arabia",
      // Add more as needed
    };

    return countryMap[countryCode.toUpperCase()] || countryCode;
  }

  private generateDescription(airport: OurAirportsData): string {
    const parts = [];

    if (airport.type) {
      parts.push(airport.type.replace("_", " "));
    }

    if (airport.municipality) {
      parts.push(`located in ${airport.municipality}`);
    }

    if (airport.iso_country) {
      const country = this.getCountryName(airport.iso_country);
      parts.push(country);
    }

    return parts.join(", ");
  }

  private generateImageUrl(city: string, country: string): string {
    const searchTerm = encodeURIComponent(`${city} ${country} airport`);
    return `https://source.unsplash.com/800x600/?${searchTerm}`;
  }

  // Fallback data in case CSV fails
  private getFallbackIndonesianAirports(): ProcessedAirportData[] {
    return [
      {
        name: "Jakarta",
        city: "Jakarta",
        country: "Indonesia",
        airport: "Soekarno-Hatta International Airport",
        code: "CGK",
        description: "Large airport located in Jakarta, Indonesia",
        imageUrl: "https://source.unsplash.com/800x600/?jakarta%20airport",
        latitude: -6.1275,
        longitude: 106.6537,
        type: "large_airport",
        continent: "AS",
      },
      {
        name: "Denpasar",
        city: "Denpasar",
        country: "Indonesia",
        airport: "Ngurah Rai International Airport",
        code: "DPS",
        description: "Large airport located in Denpasar, Indonesia",
        imageUrl: "https://source.unsplash.com/800x600/?bali%20airport",
        latitude: -8.7482,
        longitude: 115.1671,
        type: "large_airport",
        continent: "AS",
      },
      {
        name: "Surabaya",
        city: "Surabaya",
        country: "Indonesia",
        airport: "Juanda International Airport",
        code: "MLG",
        description: "Large airport located in Surabaya, Indonesia",
        imageUrl: "https://source.unsplash.com/800x600/?surabaya%20airport",
        latitude: -7.3797,
        longitude: 112.7869,
        type: "large_airport",
        continent: "AS",
      },
    ];
  }
}
