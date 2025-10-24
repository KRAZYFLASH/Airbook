// =============================================================
// Airport Repository - Database operations untuk Airport
// =============================================================

import { PrismaClient } from "@prisma/client";
import type {
  CreateAirportInput,
  UpdateAirportInput,
  AirportQueryInput,
} from "./airport.schemas";

export class AirportRepository {
  constructor(private prisma: PrismaClient) {}

  // Get all airports with pagination and filtering
  async findMany(query: AirportQueryInput) {
    const { page, limit, search, country, region, isActive } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { iataCode: { contains: search, mode: "insensitive" } },
        { icaoCode: { contains: search, mode: "insensitive" } },
        { municipality: { contains: search, mode: "insensitive" } },
        { city: { name: { contains: search, mode: "insensitive" } } },
        { country: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (country) {
      where.country = { name: { contains: country, mode: "insensitive" } };
    }

    if (region) {
      where.city = { name: { contains: region, mode: "insensitive" } };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    try {
      const [airports, total] = await Promise.all([
        this.prisma.airport.findMany({
          where,
          skip,
          take: limit,
          include: {
            city: { select: { name: true } },
            country: { select: { name: true } },
          },
          orderBy: [
            { country: { name: "asc" } },
            { city: { name: "asc" } },
            { name: "asc" },
          ],
        }),
        this.prisma.airport.count({ where }),
      ]);

      return {
        airports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("❌ Error in findMany:", error);
      throw error;
    }
  }

  // Get airport by ID
  async findById(id: string) {
    const airport = await this.prisma.airport.findUnique({
      where: { id },
      include: {
        city: { select: { name: true } },
        country: { select: { name: true } },
      },
    });

    if (!airport) {
      throw new Error(`Airport dengan ID ${id} tidak ditemukan`);
    }

    return airport;
  }

  // Get airport by IATA code
  async findByIATA(iataCode: string) {
    return await this.prisma.airport.findUnique({
      where: { iataCode: iataCode.toUpperCase() },
      include: {
        city: { select: { name: true } },
        country: { select: { name: true } },
      },
    });
  }

  // Get airport by ICAO code
  async findByICAO(icaoCode: string) {
    return await this.prisma.airport.findUnique({
      where: { icaoCode: icaoCode.toUpperCase() },
      include: {
        city: { select: { name: true } },
        country: { select: { name: true } },
      },
    });
  }

  // Create new airport
  async create(data: CreateAirportInput) {
    // Check if IATA code already exists
    if (data.iataCode) {
      const existingIATA = await this.prisma.airport.findUnique({
        where: { iataCode: data.iataCode.toUpperCase() },
      });
      if (existingIATA) {
        throw new Error(`Kode IATA ${data.iataCode} sudah digunakan`);
      }
    }

    // Check if ICAO code already exists
    if (data.icaoCode) {
      const existingICAO = await this.prisma.airport.findUnique({
        where: { icaoCode: data.icaoCode.toUpperCase() },
      });
      if (existingICAO) {
        throw new Error(`Kode ICAO ${data.icaoCode} sudah digunakan`);
      }
    }

    return await this.prisma.airport.create({
      data: {
        ...data,
        iataCode: data.iataCode?.toUpperCase(),
        icaoCode: data.icaoCode?.toUpperCase(),
      },
      include: {
        city: { select: { name: true } },
        country: { select: { name: true } },
      },
    });
  }

  // Update airport
  async update(id: string, data: UpdateAirportInput) {
    // Check if airport exists
    await this.findById(id);

    // Check if new IATA code conflicts
    if (data.iataCode) {
      const existingIATA = await this.prisma.airport.findUnique({
        where: { iataCode: data.iataCode.toUpperCase() },
      });
      if (existingIATA && existingIATA.id !== id) {
        throw new Error(`Kode IATA ${data.iataCode} sudah digunakan`);
      }
    }

    // Check if new ICAO code conflicts
    if (data.icaoCode) {
      const existingICAO = await this.prisma.airport.findUnique({
        where: { icaoCode: data.icaoCode.toUpperCase() },
      });
      if (existingICAO && existingICAO.id !== id) {
        throw new Error(`Kode ICAO ${data.icaoCode} sudah digunakan`);
      }
    }

    return await this.prisma.airport.update({
      where: { id },
      data: {
        ...data,
        iataCode: data.iataCode?.toUpperCase(),
        icaoCode: data.icaoCode?.toUpperCase(),
      },
      include: {
        city: { select: { name: true } },
        country: { select: { name: true } },
      },
    });
  }

  // Delete airport
  async delete(id: string) {
    // Check if airport exists
    await this.findById(id);

    // Check if airport is used in flight schedules
    const usedInFlights = await this.prisma.flight.count({
      where: {
        OR: [{ departureAirportId: id }, { arrivalAirportId: id }],
      },
    });

    if (usedInFlights > 0) {
      throw new Error(
        "Airport tidak dapat dihapus karena masih digunakan dalam jadwal penerbangan"
      );
    }

    return await this.prisma.airport.delete({
      where: { id },
    });
  }

  // Get countries for dropdown
  async getCountries() {
    return await this.prisma.country.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  }

  // Get cities by country for dropdown
  async getCitiesByCountry(countryId: string) {
    return await this.prisma.city.findMany({
      where: { countryId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
  }
}
