// =============================================================
// AirBook Backend — Countries Controller
// =============================================================

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CountriesController {
  // Get all countries
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const countries = await prisma.country.findMany({
        orderBy: { name: "asc" },
        include: {
          cities: {
            select: {
              id: true,
              name: true,
              isActive: true,
            },
          },
        },
      });

      res.json(countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({
        error: "Failed to fetch countries",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get country by ID
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const country = await prisma.country.findUnique({
        where: { id },
        include: {
          cities: {
            select: {
              id: true,
              name: true,
              isActive: true,
            },
          },
        },
      });

      if (!country) {
        res.status(404).json({ error: "Country not found" });
        return;
      }

      res.json(country);
    } catch (error) {
      console.error("Error fetching country:", error);
      res.status(500).json({
        error: "Failed to fetch country",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Create new country
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        code,
        continent,
        currency,
        timezone,
        isActive = true,
      } = req.body;

      // Validation
      if (!name || !code || !continent) {
        res.status(400).json({
          error:
            "Missing required fields: name, code, and continent are required",
        });
        return;
      }

      if (code.length !== 2) {
        res.status(400).json({
          error: "Country code must be exactly 2 characters",
        });
        return;
      }

      // Check if country with this code already exists
      const existingCountry = await prisma.country.findFirst({
        where: {
          OR: [{ code: code.toUpperCase() }, { name: { equals: name } }],
        },
      });

      if (existingCountry) {
        res.status(409).json({
          error: "Country with this name or code already exists",
        });
        return;
      }

      const country = await prisma.country.create({
        data: {
          name: name.trim(),
          code: code.toUpperCase().trim(),
          continent: continent.trim(),
          currency: currency?.trim() || "TBD", // To Be Determined
          timezone: timezone?.trim() || "TBD", // To Be Determined
          isActive: Boolean(isActive),
        },
      });

      res.status(201).json(country);
    } catch (error) {
      console.error("Error creating country:", error);
      res.status(500).json({
        error: "Failed to create country",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Update country
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, code, continent, currency, timezone, isActive } = req.body;

      // Check if country exists
      const existingCountry = await prisma.country.findUnique({
        where: { id },
      });

      if (!existingCountry) {
        res.status(404).json({ error: "Country not found" });
        return;
      }

      // Validation
      if (name !== undefined && !name.trim()) {
        res.status(400).json({ error: "Country name cannot be empty" });
        return;
      }

      if (code !== undefined && (!code || code.length !== 2)) {
        res
          .status(400)
          .json({ error: "Country code must be exactly 2 characters" });
        return;
      }

      if (timezone !== undefined && !timezone.trim()) {
        res.status(400).json({ error: "Timezone cannot be empty" });
        return;
      }

      // Check for duplicate name or code (excluding current country)
      if (name || code) {
        const orConditions = [];
        if (name) orConditions.push({ name: name.trim() });
        if (code) orConditions.push({ code: code.toUpperCase().trim() });

        const duplicateCountry = await prisma.country.findFirst({
          where: {
            id: { not: id },
            OR: orConditions,
          },
        });

        if (duplicateCountry) {
          res.status(409).json({
            error: "Country with this name or code already exists",
          });
          return;
        }
      }

      const updatedData: any = {};
      if (name !== undefined) updatedData.name = name.trim();
      if (code !== undefined) updatedData.code = code.toUpperCase().trim();
      if (continent !== undefined) updatedData.continent = continent.trim();
      if (currency !== undefined) updatedData.currency = currency.trim();
      if (timezone !== undefined) updatedData.timezone = timezone.trim();
      if (isActive !== undefined) updatedData.isActive = Boolean(isActive);

      const country = await prisma.country.update({
        where: { id },
        data: updatedData,
      });

      res.json(country);
    } catch (error) {
      console.error("Error updating country:", error);
      res.status(500).json({
        error: "Failed to update country",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Delete country
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { force } = req.query; // Add force parameter untuk cascade delete

      // Check if country exists
      const existingCountry = await prisma.country.findUnique({
        where: { id },
        include: {
          cities: true,
          airlines: true,
          airports: true,
          destinations: true,
        },
      });

      if (!existingCountry) {
        res.status(404).json({ error: "Country not found" });
        return;
      }

      // Check for related records
      const relatedRecords = [];
      if (existingCountry.cities.length > 0) {
        relatedRecords.push(`${existingCountry.cities.length} cities`);
      }
      if (existingCountry.airlines.length > 0) {
        relatedRecords.push(`${existingCountry.airlines.length} airlines`);
      }
      if (existingCountry.airports.length > 0) {
        relatedRecords.push(`${existingCountry.airports.length} airports`);
      }
      if (existingCountry.destinations.length > 0) {
        relatedRecords.push(
          `${existingCountry.destinations.length} destinations`
        );
      }

      if (relatedRecords.length > 0 && force !== "true") {
        res.status(400).json({
          error: `Cannot delete country with associated records: ${relatedRecords.join(
            ", "
          )}. Use force delete to remove all related records.`,
          relatedRecords: {
            cities: existingCountry.cities.length,
            airlines: existingCountry.airlines.length,
            airports: existingCountry.airports.length,
            destinations: existingCountry.destinations.length,
          },
          canForceDelete: true,
        });
        return;
      }

      // If force delete is requested, delete related records first
      if (force === "true") {
        // Delete in correct order to respect foreign key constraints
        // 1. Delete destinations first
        if (existingCountry.destinations.length > 0) {
          await prisma.destination.deleteMany({
            where: { countryId: id },
          });
        }

        // 2. Delete airports
        if (existingCountry.airports.length > 0) {
          await prisma.airport.deleteMany({
            where: { countryId: id },
          });
        }

        // 3. Delete airlines
        if (existingCountry.airlines.length > 0) {
          await prisma.airline.deleteMany({
            where: { countryId: id },
          });
        }

        // 4. Delete cities
        if (existingCountry.cities.length > 0) {
          await prisma.city.deleteMany({
            where: { countryId: id },
          });
        }
      }

      // Now delete the country
      await prisma.country.delete({
        where: { id },
      });

      const deletedRecords =
        force === "true"
          ? ` and ${existingCountry.cities.length} cities, ${existingCountry.airlines.length} airlines, ${existingCountry.airports.length} airports, ${existingCountry.destinations.length} destinations`
          : "";

      res.json({
        message: `Country deleted successfully${deletedRecords}`,
        deletedRecords:
          force === "true"
            ? {
                country: 1,
                cities: existingCountry.cities.length,
                airlines: existingCountry.airlines.length,
                airports: existingCountry.airports.length,
                destinations: existingCountry.destinations.length,
              }
            : { country: 1 },
      });
    } catch (error) {
      console.error("Error deleting country:", error);
      res.status(500).json({
        error: "Failed to delete country",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  // Get active countries only
  static async getActive(req: Request, res: Response): Promise<void> {
    try {
      const countries = await prisma.country.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
        include: {
          cities: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              isActive: true,
            },
          },
        },
      });

      res.json(countries);
    } catch (error) {
      console.error("Error fetching active countries:", error);
      res.status(500).json({
        error: "Failed to fetch active countries",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
