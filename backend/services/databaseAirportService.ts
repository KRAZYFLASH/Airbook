// =============================================================
// Airport Service - Backend Database Access
// =============================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AirportResponse {
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

export class DatabaseAirportService {
  /**
   * Get all airports with city and country info
   */
  static async getAllAirports(): Promise<AirportResponse[]> {
    const airports = await prisma.airport.findMany({
      where: { isActive: true },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
    });

    return airports;
  }

  /**
   * Get airports by country
   */
  static async getAirportsByCountry(
    countryCode: string
  ): Promise<AirportResponse[]> {
    const airports = await prisma.airport.findMany({
      where: {
        isActive: true,
        city: {
          country: {
            code: countryCode,
          },
        },
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
    });

    return airports;
  }

  /**
   * Get Indonesian airports only
   */
  static async getIndonesianAirports(): Promise<AirportResponse[]> {
    return this.getAirportsByCountry("ID");
  }

  /**
   * Get regional airports (ASEAN countries)
   */
  static async getRegionalAirports(): Promise<AirportResponse[]> {
    const regionalCountryCodes = ["SG", "MY", "TH", "PH", "VN"];

    const airports = await prisma.airport.findMany({
      where: {
        isActive: true,
        city: {
          country: {
            code: { in: regionalCountryCodes },
          },
        },
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
    });

    return airports;
  }

  /**
   * Get international airports (non-ASEAN, non-Indonesia)
   */
  static async getInternationalAirports(): Promise<AirportResponse[]> {
    const excludeCountryCodes = ["ID", "SG", "MY", "TH", "PH", "VN"];

    const airports = await prisma.airport.findMany({
      where: {
        isActive: true,
        city: {
          country: {
            code: { not: { in: excludeCountryCodes } },
          },
        },
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
    });

    return airports;
  }

  /**
   * Get airport by IATA code
   */
  static async getAirportByIATA(
    iataCode: string
  ): Promise<AirportResponse | null> {
    const airport = await prisma.airport.findFirst({
      where: {
        iataCode: iataCode.toUpperCase(),
        isActive: true,
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
    });

    return airport;
  }

  /**
   * Search airports by name, IATA code, city, or country
   */
  static async searchAirports(query: string): Promise<AirportResponse[]> {
    const searchTerm = query.toLowerCase();

    const airports = await prisma.airport.findMany({
      where: {
        isActive: true,
        OR: [
          { iataCode: { contains: searchTerm, mode: "insensitive" } },
          { icaoCode: { contains: searchTerm, mode: "insensitive" } },
          { name: { contains: searchTerm, mode: "insensitive" } },
          {
            city: {
              name: { contains: searchTerm, mode: "insensitive" },
            },
          },
          {
            city: {
              country: {
                name: { contains: searchTerm, mode: "insensitive" },
              },
            },
          },
        ],
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
    });

    return airports;
  }

  /**
   * Get airports by region (continent)
   */
  static async getAirportsByRegion(
    continent: string
  ): Promise<AirportResponse[]> {
    const airports = await prisma.airport.findMany({
      where: {
        isActive: true,
        city: {
          country: {
            continent: continent,
          },
        },
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
    });

    return airports;
  }

  /**
   * Get airports by city
   */
  static async getAirportsByCity(cityName: string): Promise<AirportResponse[]> {
    const airports = await prisma.airport.findMany({
      where: {
        isActive: true,
        city: {
          name: { contains: cityName, mode: "insensitive" },
        },
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
      orderBy: [{ name: "asc" }],
    });

    return airports;
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
  }): Promise<AirportResponse> {
    const airport = await prisma.airport.create({
      data: {
        name: data.name,
        iataCode: data.iataCode,
        icaoCode: data.icaoCode,
        cityId: data.cityId,
        countryId: await this.getCityCountryId(data.cityId),
        timezone: data.timezone,
      },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
    });

    return airport;
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
  ): Promise<AirportResponse> {
    const updateData: any = { ...data };

    if (data.cityId) {
      updateData.countryId = await this.getCityCountryId(data.cityId);
    }

    const airport = await prisma.airport.update({
      where: { id },
      data: updateData,
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
    });

    return airport;
  }

  /**
   * Delete airport
   */
  static async deleteAirport(id: string): Promise<void> {
    await prisma.airport.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Get airport by ID
   */
  static async getAirportById(id: string): Promise<AirportResponse | null> {
    const airport = await prisma.airport.findUnique({
      where: { id, isActive: true },
      include: {
        city: {
          include: {
            country: true,
          },
        },
      },
    });

    return airport;
  }

  /**
   * Get all countries for dropdown
   */
  static async getAllCountries() {
    return await prisma.country.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get cities by country for dropdown
   */
  static async getCitiesByCountry(countryId: string) {
    return await prisma.city.findMany({
      where: {
        countryId,
        isActive: true,
      },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Helper function to get country ID from city ID
   */
  private static async getCityCountryId(cityId: string): Promise<string> {
    const city = await prisma.city.findUnique({
      where: { id: cityId },
      select: { countryId: true },
    });

    if (!city) {
      throw new Error("City not found");
    }

    return city.countryId;
  }

  /**
   * Get airport statistics
   */
  static async getAirportStats() {
    const totalAirports = await prisma.airport.count({
      where: { isActive: true },
    });
    const totalCities = await prisma.city.count({ where: { isActive: true } });
    const totalCountries = await prisma.country.count({
      where: { isActive: true },
    });

    // Get top countries by airport count
    const topCountries = await prisma.country.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { airports: { where: { isActive: true } } },
        },
      },
      orderBy: {
        airports: { _count: "desc" },
      },
      take: 10,
    });

    const topCountriesWithNames = topCountries.map((country) => ({
      country: {
        id: country.id,
        name: country.name,
        code: country.code,
      },
      airportCount: country._count.airports,
    }));

    return {
      totalAirports,
      totalCities,
      totalCountries,
      topCountries: topCountriesWithNames,
    };
  }
}

export default DatabaseAirportService;
