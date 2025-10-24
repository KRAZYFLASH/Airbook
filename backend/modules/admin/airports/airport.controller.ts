// =============================================================
// Airport Controller - REST API endpoints untuk Airport
// =============================================================

import { Request, Response, NextFunction } from "express";
import { AirportService } from "./airport.service";
import {
  createAirportSchema,
  updateAirportSchema,
  airportQuerySchema,
} from "./airport.schemas";
import { ZodError } from "zod";

export class AirportController {
  constructor(private airportService: AirportService) {}

  // GET /api/airports - Get all airports with pagination and filtering
  async getAirports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const query = airportQuerySchema.parse(req.query);
      const result = await this.airportService.getAirports(query);

      res.json({
        success: true,
        message: "Data airports berhasil diambil",
        data: result.airports,
        pagination: result.pagination,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Parameter query tidak valid",
          errors: error.issues,
        });
        return;
      }
      next(error);
    }
  }

  // GET /api/airports/:id - Get airport by ID
  async getAirportById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const airport = await this.airportService.getAirportById(id);

      res.json({
        success: true,
        message: "Data airport berhasil diambil",
        data: airport,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("tidak ditemukan")) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  // GET /api/airports/iata/:code - Get airport by IATA code
  async getAirportByIATA(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code } = req.params;
      const airport = await this.airportService.getAirportByIATA(code);

      res.json({
        success: true,
        message: "Data airport berhasil diambil",
        data: airport,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("tidak ditemukan") ||
          error.message.includes("harus 3 karakter"))
      ) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  // GET /api/airports/icao/:code - Get airport by ICAO code
  async getAirportByICAO(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code } = req.params;
      const airport = await this.airportService.getAirportByICAO(code);

      res.json({
        success: true,
        message: "Data airport berhasil diambil",
        data: airport,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes("tidak ditemukan") ||
          error.message.includes("harus 4 karakter"))
      ) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  // POST /api/airports - Create new airport
  async createAirport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = createAirportSchema.parse(req.body);
      const airport = await this.airportService.createAirport(data);

      res.status(201).json({
        success: true,
        message: "Airport berhasil dibuat",
        data: airport,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Data tidak valid",
          errors: error.issues,
        });
        return;
      }
      if (error instanceof Error && error.message.includes("sudah digunakan")) {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  // PUT /api/airports/:id - Update airport
  async updateAirport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = updateAirportSchema.parse(req.body);
      const airport = await this.airportService.updateAirport(id, data);

      res.json({
        success: true,
        message: "Airport berhasil diupdate",
        data: airport,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Data tidak valid",
          errors: error.issues,
        });
        return;
      }
      if (error instanceof Error && error.message.includes("tidak ditemukan")) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      if (error instanceof Error && error.message.includes("sudah digunakan")) {
        res.status(409).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  // DELETE /api/airports/:id - Delete airport
  async deleteAirport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.airportService.deleteAirport(id);

      res.json({
        success: true,
        message: "Airport berhasil dihapus",
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("tidak ditemukan")) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      if (error instanceof Error && error.message.includes("masih digunakan")) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  // PATCH /api/airports/:id/toggle-status - Toggle airport active status
  async toggleAirportStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const airport = await this.airportService.toggleAirportStatus(id);

      res.json({
        success: true,
        message: `Status airport berhasil diubah menjadi ${
          airport.isActive ? "aktif" : "tidak aktif"
        }`,
        data: airport,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes("tidak ditemukan")) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }

  // GET /api/airports/dropdown/countries - Get countries for dropdown
  async getDropdownData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await this.airportService.getDropdownData();

      res.json({
        success: true,
        message: "Data dropdown berhasil diambil",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/airports/dropdown/cities/:countryId - Get cities by country
  async getCitiesByCountry(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { countryId } = req.params;
      const cities = await this.airportService.getCitiesByCountry(countryId);

      res.json({
        success: true,
        message: "Data cities berhasil diambil",
        data: cities,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/airports/dropdown/airports - Get airports for dropdown (grouped by country)
  async getAirportsForDropdown(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const airports = await this.airportService.getAirportsForDropdown();

      res.json({
        success: true,
        message: "Data airports untuk dropdown berhasil diambil",
        data: airports,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/airports/search?q=query - Search airports (autocomplete)
  async searchAirports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { q, limit } = req.query;

      if (!q || typeof q !== "string") {
        res.status(400).json({
          success: false,
          message: "Parameter 'q' (query) diperlukan",
        });
        return;
      }

      const limitNum = limit ? parseInt(limit as string) : 10;
      const airports = await this.airportService.searchAirports(q, limitNum);

      res.json({
        success: true,
        message: "Pencarian airports berhasil",
        data: airports,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("minimal 2 karakter")
      ) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
        return;
      }
      next(error);
    }
  }
}
