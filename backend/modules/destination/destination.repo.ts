import { PrismaClient } from "@prisma/client";
import { Destination, CreateDestinationInput, UpdateDestinationInput } from "./destination.schema";

const prisma = new PrismaClient();

export class DestinationRepository {
  // Get all destinations with pagination
  async findAll(page: number = 1, limit: number = 10, isActive?: boolean): Promise<{destinations: Destination[], total: number}> {
    const skip = (page - 1) * limit;
    
    const where = isActive !== undefined ? { isActive } : {};
    
    const [destinations, total] = await Promise.all([
      prisma.destination.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.destination.count({ where })
    ]);

    return { 
      destinations: destinations as Destination[], 
      total 
    };
  }

  // Find by ID
  async findById(id: string): Promise<Destination | null> {
    return await prisma.destination.findUnique({
      where: { id }
    }) as Destination | null;
  }

  // Find by airport code
  async findByCode(code: string): Promise<Destination | null> {
    return await prisma.destination.findUnique({
      where: { code: code.toUpperCase() }
    }) as Destination | null;
  }

  // Search destinations
  async search(query?: string, country?: string, isActive?: boolean): Promise<Destination[]> {
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { country: { contains: query, mode: 'insensitive' } },
        { airport: { contains: query, mode: 'insensitive' } },
        { code: { contains: query, mode: 'insensitive' } }
      ];
    }

    return await prisma.destination.findMany({
      where,
      orderBy: { name: 'asc' }
    }) as Destination[];
  }

  // Create destination
  async create(data: CreateDestinationInput): Promise<Destination> {
    return await prisma.destination.create({
      data: {
        ...data,
        code: data.code.toUpperCase()
      }
    }) as Destination;
  }

  // Update destination
  async update(id: string, data: UpdateDestinationInput): Promise<Destination> {
    const updateData = { ...data };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }

    return await prisma.destination.update({
      where: { id },
      data: updateData
    }) as Destination;
  }

  // Soft delete (set isActive to false)
  async softDelete(id: string): Promise<Destination> {
    return await prisma.destination.update({
      where: { id },
      data: { isActive: false }
    }) as Destination;
  }

  // Hard delete
  async delete(id: string): Promise<void> {
    await prisma.destination.delete({
      where: { id }
    });
  }

  // Get popular destinations (for homepage)
  async getPopular(limit: number = 6): Promise<Destination[]> {
    return await prisma.destination.findMany({
      where: { isActive: true },
      take: limit,
      orderBy: { createdAt: 'desc' }
    }) as Destination[];
  }
}