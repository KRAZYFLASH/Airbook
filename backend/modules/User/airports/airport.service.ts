import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AirportSearchResult {
  // Frontend compatible fields
  id: string;
  name: string;
  city: string;
  country: string;
  airport: string;
  code: string;
  description?: string;
  imageUrl?: string;
  // Additional backend fields
  iataCode: string | null;
  icaoCode: string | null;
  cityName: string;
  countryName: string;
  municipality: string | null;
  lat: number | null;
  lon: number | null;
}

export class AirportService {
  /**
   * Search airports by name, IATA code, or city name
   */
  async searchAirports(
    query: string,
    limit: number = 10
  ): Promise<AirportSearchResult[]> {
    const searchQuery = query.toLowerCase();

    const airports = await prisma.airport.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              {
                name: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
              {
                iataCode: {
                  contains: searchQuery.toUpperCase(),
                  mode: "insensitive",
                },
              },
              {
                icaoCode: {
                  contains: searchQuery.toUpperCase(),
                  mode: "insensitive",
                },
              },
              {
                city: {
                  name: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
              },
              {
                country: {
                  name: {
                    contains: searchQuery,
                    mode: "insensitive",
                  },
                },
              },
              {
                municipality: {
                  contains: searchQuery,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      include: {
        city: {
          select: {
            name: true,
          },
        },
        country: {
          select: {
            name: true,
          },
        },
      },
      take: limit,
      orderBy: [
        {
          name: "asc",
        },
      ],
    });

    return airports.map((airport) => ({
      id: airport.id,
      name: airport.name,
      city: airport.city.name,
      country: airport.country.name,
      airport: airport.name,
      code:
        airport.iataCode ||
        airport.icaoCode ||
        airport.id.slice(-3).toUpperCase(),
      description: `${airport.name} - ${airport.city.name}, ${airport.country.name}`,
      imageUrl: undefined,
      // Keep original fields for backward compatibility
      iataCode: airport.iataCode,
      icaoCode: airport.icaoCode,
      cityName: airport.city.name,
      countryName: airport.country.name,
      municipality: airport.municipality,
      lat: airport.lat,
      lon: airport.lon,
    }));
  }

  /**
   * Get popular airports (you can customize this logic)
   */
  async getPopularAirports(limit: number = 20): Promise<AirportSearchResult[]> {
    const airports = await prisma.airport.findMany({
      where: {
        isActive: true,
        iataCode: {
          not: null,
        },
      },
      include: {
        city: {
          select: {
            name: true,
          },
        },
        country: {
          select: {
            name: true,
          },
        },
      },
      take: limit,
      orderBy: [
        {
          name: "asc",
        },
      ],
    });

    return airports.map((airport) => ({
      id: airport.id,
      name: airport.name,
      city: airport.city.name,
      country: airport.country.name,
      airport: airport.name,
      code:
        airport.iataCode ||
        airport.icaoCode ||
        airport.id.slice(-3).toUpperCase(),
      description: `${airport.name} - ${airport.city.name}, ${airport.country.name}`,
      imageUrl: undefined,
      // Keep original fields for backward compatibility
      iataCode: airport.iataCode,
      icaoCode: airport.icaoCode,
      cityName: airport.city.name,
      countryName: airport.country.name,
      municipality: airport.municipality,
      lat: airport.lat,
      lon: airport.lon,
    }));
  }

  /**
   * Get airports by country
   */
  async getAirportsByCountry(
    countryCode: string,
    limit: number = 50
  ): Promise<AirportSearchResult[]> {
    const airports = await prisma.airport.findMany({
      where: {
        isActive: true,
        country: {
          code: countryCode.toUpperCase(),
        },
      },
      include: {
        city: {
          select: {
            name: true,
          },
        },
        country: {
          select: {
            name: true,
          },
        },
      },
      take: limit,
      orderBy: [
        {
          name: "asc",
        },
      ],
    });

    return airports.map((airport) => ({
      id: airport.id,
      name: airport.name,
      city: airport.city.name,
      country: airport.country.name,
      airport: airport.name,
      code:
        airport.iataCode ||
        airport.icaoCode ||
        airport.id.slice(-3).toUpperCase(),
      description: `${airport.name} - ${airport.city.name}, ${airport.country.name}`,
      imageUrl: undefined,
      // Keep original fields for backward compatibility
      iataCode: airport.iataCode,
      icaoCode: airport.icaoCode,
      cityName: airport.city.name,
      countryName: airport.country.name,
      municipality: airport.municipality,
      lat: airport.lat,
      lon: airport.lon,
    }));
  }

  /**
   * Get airport by IATA code
   */
  async getAirportByIata(
    iataCode: string
  ): Promise<AirportSearchResult | null> {
    const airport = await prisma.airport.findFirst({
      where: {
        iataCode: iataCode.toUpperCase(),
        isActive: true,
      },
      include: {
        city: {
          select: {
            name: true,
          },
        },
        country: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!airport) {
      return null;
    }

    return {
      id: airport.id,
      name: airport.name,
      city: airport.city.name,
      country: airport.country.name,
      airport: airport.name,
      code:
        airport.iataCode ||
        airport.icaoCode ||
        airport.id.slice(-3).toUpperCase(),
      description: `${airport.name} - ${airport.city.name}, ${airport.country.name}`,
      imageUrl: undefined,
      // Keep original fields for backward compatibility
      iataCode: airport.iataCode,
      icaoCode: airport.icaoCode,
      cityName: airport.city.name,
      countryName: airport.country.name,
      municipality: airport.municipality,
      lat: airport.lat,
      lon: airport.lon,
    };
  }

  /**
   * Get Indonesian airports (popular ones)
   */
  async getIndonesianAirports(
    limit: number = 30
  ): Promise<AirportSearchResult[]> {
    return this.getAirportsByCountry("ID", limit);
  }
}

export const airportService = new AirportService();
