import { PrismaClient } from "@prisma/client";
import { CreateAirlineInput, UpdateAirlineInput } from "./airline.schemas";

export class AirlineRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll() {
    try {
      return await this.prisma.airline.findMany({
        include: {
          country: true,
        },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to fetch airlines: ${error}`);
    }
  }

  async findById(id: string) {
    try {
      const airline = await this.prisma.airline.findUnique({
        where: { id },
        include: {
          country: true,
        },
      });

      if (!airline) {
        throw new Error("Airline not found");
      }

      return airline;
    } catch (error) {
      throw new Error(`Failed to fetch airline: ${error}`);
    }
  }

  async findByCode(code: string) {
    try {
      return await this.prisma.airline.findUnique({
        where: { code },
      });
    } catch (error) {
      throw new Error(`Failed to fetch airline by code: ${error}`);
    }
  }

  async create(data: CreateAirlineInput) {
    try {
      // Check if airline code already exists
      const existingAirline = await this.findByCode(data.code);
      if (existingAirline) {
        throw new Error("Airline with this code already exists");
      }

      return await this.prisma.airline.create({
        data,
        include: {
          country: true,
        },
      });
    } catch (error) {
      throw new Error(`Failed to create airline: ${error}`);
    }
  }

  async update(id: string, data: UpdateAirlineInput) {
    try {
      console.log("🗃️ Repository - Update called with:", { id, data });

      // Check if airline exists
      await this.findById(id);

      // If code is being updated, check if new code already exists
      if (data.code) {
        const existingAirline = await this.findByCode(data.code);
        if (existingAirline && existingAirline.id !== id) {
          throw new Error("Airline with this code already exists");
        }
      }

      console.log("🗃️ Repository - About to update with data:", data);
      const result = await this.prisma.airline.update({
        where: { id },
        data,
        include: {
          country: true,
        },
      });
      console.log("🗃️ Repository - Update result:", result);

      return result;
    } catch (error) {
      throw new Error(`Failed to update airline: ${error}`);
    }
  }

  async delete(id: string) {
    try {
      // Check if airline exists
      await this.findById(id);

      return await this.prisma.airline.delete({
        where: { id },
      });
    } catch (error) {
      throw new Error(`Failed to delete airline: ${error}`);
    }
  }

  async search(query: string) {
    try {
      return await this.prisma.airline.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { code: { contains: query, mode: "insensitive" } },
            { country: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: {
          country: true,
        },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to search airlines: ${error}`);
    }
  }

  // New method to get airlines with relations
  async findAllWithRelations() {
    try {
      return await this.prisma.airline.findMany({
        include: {
          country: true,
        },
        orderBy: { name: "asc" },
      });
    } catch (error) {
      throw new Error(`Failed to get airlines: ${error}`);
    }
  }

  async findByIdWithRelations(id: string) {
    try {
      const airline = await this.prisma.airline.findUnique({
        where: { id },
        include: {
          country: true,
        },
      });

      if (!airline) {
        throw new Error("Airline not found");
      }

      return airline;
    } catch (error) {
      throw new Error(`Failed to get airline: ${error}`);
    }
  }
}
