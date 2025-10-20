import { PrismaClient } from "@prisma/client";
import {
  Destination,
  CreateDestinationInput,
  UpdateDestinationInput,
  DestinationWithRelations,
} from "./destination.schema";

const prisma = new PrismaClient();

export class DestinationRepository {
  // Get all destinations with pagination
  async findAll(
    page: number = 1,
    limit: number = 10,
    isActive?: boolean
  ): Promise<{ destinations: Destination[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = isActive !== undefined ? { isActive } : {};

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.destination.count({ where }),
    ]);

    return {
      destinations: destinations as Destination[],
      total,
    };
  }

  // Get destinations with relations for frontend display
  async findAllWithRelations(
    page: number = 1,
    limit: number = 10,
    isActive?: boolean
  ): Promise<{ destinations: DestinationWithRelations[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = isActive !== undefined ? { isActive } : {};

    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: limit,
        include: {
          city: {
            select: { id: true, name: true },
          },
          country: {
            select: { id: true, name: true },
          },
          airport: {
            select: { id: true, name: true, iataCode: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.destination.count({ where }),
    ]);

    return {
      destinations: destinations as DestinationWithRelations[],
      total,
    };
  }

  // Find by ID
  async findById(id: string): Promise<Destination | null> {
    return (await prisma.destination.findUnique({
      where: { id },
    })) as Destination | null;
  }

  // Find by ID with relations
  async findByIdWithRelations(
    id: string
  ): Promise<DestinationWithRelations | null> {
    return (await prisma.destination.findUnique({
      where: { id },
      include: {
        city: {
          select: { id: true, name: true },
        },
        country: {
          select: { id: true, name: true },
        },
        airport: {
          select: { id: true, name: true, iataCode: true },
        },
      },
    })) as DestinationWithRelations | null;
  }

  // Search destinations
  async search(
    query?: string,
    countryId?: string,
    cityId?: string,
    category?: string,
    isActive?: boolean
  ): Promise<Destination[]> {
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (countryId) {
      where.countryId = countryId;
    }

    if (cityId) {
      where.cityId = cityId;
    }

    if (category) {
      where.category = { contains: category, mode: "insensitive" };
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ];
    }

    return (await prisma.destination.findMany({
      where,
      orderBy: { name: "asc" },
    })) as Destination[];
  }

  // Search destinations with relations
  async searchWithRelations(
    query?: string,
    countryId?: string,
    cityId?: string,
    category?: string,
    isActive?: boolean
  ): Promise<DestinationWithRelations[]> {
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (countryId) {
      where.countryId = countryId;
    }

    if (cityId) {
      where.cityId = cityId;
    }

    if (category) {
      where.category = { contains: category, mode: "insensitive" };
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ];
    }

    return (await prisma.destination.findMany({
      where,
      include: {
        city: {
          select: { id: true, name: true },
        },
        country: {
          select: { id: true, name: true },
        },
        airport: {
          select: { id: true, name: true, iataCode: true },
        },
      },
      orderBy: { name: "asc" },
    })) as DestinationWithRelations[];
  }

  // Create destination
  async create(data: CreateDestinationInput): Promise<Destination> {
    return (await prisma.destination.create({
      data: {
        ...data,
      },
    })) as Destination;
  }

  // Update destination
  async update(id: string, data: UpdateDestinationInput): Promise<Destination> {
    return (await prisma.destination.update({
      where: { id },
      data: data,
    })) as Destination;
  }

  // Soft delete (set isActive to false)
  async softDelete(id: string): Promise<Destination> {
    return (await prisma.destination.update({
      where: { id },
      data: { isActive: false },
    })) as Destination;
  }

  // Hard delete
  async delete(id: string): Promise<void> {
    await prisma.destination.delete({
      where: { id },
    });
  }

  // Get popular destinations (for homepage)
  async getPopular(limit: number = 6): Promise<Destination[]> {
    return (await prisma.destination.findMany({
      where: { isActive: true, isFeatured: true },
      take: limit,
      orderBy: { rating: "desc" },
    })) as Destination[];
  }

  // Get popular destinations with relations
  async getPopularWithRelations(
    limit: number = 6
  ): Promise<DestinationWithRelations[]> {
    return (await prisma.destination.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        city: {
          select: { id: true, name: true },
        },
        country: {
          select: { id: true, name: true },
        },
        airport: {
          select: { id: true, name: true, iataCode: true },
        },
      },
      take: limit,
      orderBy: { rating: "desc" },
    })) as DestinationWithRelations[];
  }
}
