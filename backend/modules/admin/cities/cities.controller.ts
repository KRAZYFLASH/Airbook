// =============================================================
// AirBook Backend — Cities Controller
// =============================================================

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CitiesController {
  // Get all cities
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const cities = await prisma.city.findMany({
        orderBy: { name: "asc" },
        include: {
          country: {
            select: {
              id: true,
              name: true,
              code: true,
              isActive: true,
            },
          },
        },
      });

      res.json(cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      res.status(500).json({
        error: "Failed to fetch cities",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get city by ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const city = await prisma.city.findUnique({
        where: { id },
        include: {
          country: {
            select: {
              id: true,
              name: true,
              code: true,
              isActive: true,
            },
          },
        },
      });

      if (!city) {
        res.status(404).json({ error: "City not found" });
        return;
      }

      res.json(city);
    } catch (error) {
      console.error("Error fetching city:", error);
      res.status(500).json({
        error: "Failed to fetch city",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get cities by country
  static async getByCountry(req: Request, res: Response): Promise<void> {
    try {
      const { countryId } = req.params;

      const cities = await prisma.city.findMany({
        where: { countryId },
        orderBy: { name: "asc" },
        include: {
          country: {
            select: {
              id: true,
              name: true,
              code: true,
              isActive: true,
            },
          },
        },
      });

      res.json(cities);
    } catch (error) {
      console.error("Error fetching cities by country:", error);
      res.status(500).json({
        error: "Failed to fetch cities by country",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Create new city
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, countryId, timezone, isActive = true } = req.body;

      // Validation
      if (!name || !countryId) {
        res.status(400).json({
          error: "Missing required fields: name and countryId are required",
        });
        return;
      }

      // Check if country exists
      const country = await prisma.country.findUnique({
        where: { id: countryId },
      });

      if (!country) {
        res.status(400).json({ error: "Country not found" });
        return;
      }

      // Check if city with this name already exists in the same country
      const existingCity = await prisma.city.findFirst({
        where: {
          name: name.trim(),
          countryId,
        },
      });

      if (existingCity) {
        res.status(409).json({
          error: "City with this name already exists in the selected country",
        });
        return;
      }

      const city = await prisma.city.create({
        data: {
          name: name.trim(),
          countryId,
          timezone: timezone?.trim() || null, // Make it optional with null default
          isActive: Boolean(isActive),
        },
        include: {
          country: {
            select: {
              id: true,
              name: true,
              code: true,
              isActive: true,
            },
          },
        },
      });

      res.status(201).json(city);
    } catch (error) {
      console.error("Error creating city:", error);
      res.status(500).json({
        error: "Failed to create city",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Update city
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, countryId, timezone, isActive } = req.body;

      // Check if city exists
      const existingCity = await prisma.city.findUnique({
        where: { id },
      });

      if (!existingCity) {
        res.status(404).json({ error: "City not found" });
        return;
      }

      // Validation
      if (name !== undefined && !name.trim()) {
        res.status(400).json({ error: "City name cannot be empty" });
        return;
      }

      if (timezone !== undefined && !timezone.trim()) {
        res.status(400).json({ error: "Timezone cannot be empty" });
        return;
      }

      // Check if country exists (if countryId is being updated)
      if (countryId !== undefined) {
        const country = await prisma.country.findUnique({
          where: { id: countryId },
        });

        if (!country) {
          res.status(400).json({ error: "Country not found" });
          return;
        }
      }

      // Check for duplicate name in the same country (excluding current city)
      if (name || countryId) {
        const finalCountryId = countryId || existingCity.countryId;
        const finalName = name || existingCity.name;

        const duplicateCity = await prisma.city.findFirst({
          where: {
            id: { not: id },
            name: finalName.trim(),
            countryId: finalCountryId,
          },
        });

        if (duplicateCity) {
          res.status(409).json({
            error: "City with this name already exists in the selected country",
          });
          return;
        }
      }

      const updatedData: any = {};
      if (name !== undefined) updatedData.name = name.trim();
      if (countryId !== undefined) updatedData.countryId = countryId;
      if (timezone !== undefined) updatedData.timezone = timezone.trim();
      if (isActive !== undefined) updatedData.isActive = Boolean(isActive);

      const city = await prisma.city.update({
        where: { id },
        data: updatedData,
        include: {
          country: {
            select: {
              id: true,
              name: true,
              code: true,
              isActive: true,
            },
          },
        },
      });

      res.json(city);
    } catch (error) {
      console.error("Error updating city:", error);
      res.status(500).json({
        error: "Failed to update city",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Delete city
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { force } = req.query; // Add force parameter untuk cascade delete

      // Check if city exists
      const existingCity = await prisma.city.findUnique({
        where: { id },
        include: {
          airports: true,
          destinations: true,
        },
      });

      if (!existingCity) {
        res.status(404).json({ error: "City not found" });
        return;
      }

      // Check for related records
      const relatedRecords = [];
      if (existingCity.airports.length > 0) {
        relatedRecords.push(`${existingCity.airports.length} airports`);
      }
      if (existingCity.destinations.length > 0) {
        relatedRecords.push(`${existingCity.destinations.length} destinations`);
      }

      if (relatedRecords.length > 0 && force !== "true") {
        res.status(400).json({
          error: `Cannot delete city with associated records: ${relatedRecords.join(
            ", "
          )}. Use force delete to remove all related records.`,
          relatedRecords: {
            airports: existingCity.airports.length,
            destinations: existingCity.destinations.length,
          },
          canForceDelete: true,
        });
        return;
      }

      // If force delete is requested, delete related records first
      if (force === "true") {
        // Delete related destinations first (they might reference airports)
        if (existingCity.destinations.length > 0) {
          await prisma.destination.deleteMany({
            where: { cityId: id },
          });
        }

        // Delete related airports
        if (existingCity.airports.length > 0) {
          await prisma.airport.deleteMany({
            where: { cityId: id },
          });
        }
      }

      // Now delete the city
      await prisma.city.delete({
        where: { id },
      });

      const deletedRecords =
        force === "true"
          ? ` and ${existingCity.airports.length} airports, ${existingCity.destinations.length} destinations`
          : "";

      res.json({
        message: `City deleted successfully${deletedRecords}`,
        deletedRecords:
          force === "true"
            ? {
                city: 1,
                airports: existingCity.airports.length,
                destinations: existingCity.destinations.length,
              }
            : { city: 1 },
      });
    } catch (error) {
      console.error("Error deleting city:", error);
      res.status(500).json({
        error: "Failed to delete city",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get active cities only
  static async getActive(req: Request, res: Response): Promise<void> {
    try {
      const cities = await prisma.city.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        include: {
          country: {
            select: {
              id: true,
              name: true,
              code: true,
              isActive: true,
            },
          },
        },
      });

      res.json(cities);
    } catch (error) {
      console.error("Error fetching active cities:", error);
      res.status(500).json({
        error: "Failed to fetch active cities",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get active cities by country
  static async getActiveByCountry(req: Request, res: Response): Promise<void> {
    try {
      const { countryId } = req.params;

      const cities = await prisma.city.findMany({
        where: {
          countryId,
          isActive: true,
        },
        orderBy: { name: "asc" },
        include: {
          country: {
            select: {
              id: true,
              name: true,
              code: true,
              isActive: true,
            },
          },
        },
      });

      res.json(cities);
    } catch (error) {
      console.error("Error fetching active cities by country:", error);
      res.status(500).json({
        error: "Failed to fetch active cities by country",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
