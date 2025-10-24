import { Request, Response } from "express";
import { AirlineService } from "./airline.service";
import { CreateAirlineSchema, UpdateAirlineSchema } from "./airline.schemas";

export class AirlineController {
  private airlineService: AirlineService;

  constructor(airlineService: AirlineService) {
    this.airlineService = airlineService;
  }

  // GET /api/airlines
  async getAllAirlines(req: Request, res: Response) {
    try {
      const airlines = await this.airlineService.getAllAirlines();

      res.json({
        success: true,
        message: "Airlines retrieved successfully",
        data: airlines,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve airlines",
      });
    }
  }

  // GET /api/airlines/active
  async getActiveAirlines(req: Request, res: Response) {
    try {
      const airlines = await this.airlineService.getActiveAirlines();

      res.json({
        success: true,
        message: "Active airlines retrieved successfully",
        data: airlines,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve active airlines",
      });
    }
  }

  // GET /api/airlines/:id
  async getAirlineById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const airline = await this.airlineService.getAirlineById(id);

      res.json({
        success: true,
        message: "Airline retrieved successfully",
        data: airline,
      });
    } catch (error: any) {
      const statusCode = error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to retrieve airline",
      });
    }
  }

  // GET /api/airlines/code/:code
  async getAirlineByCode(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      const airline = await this.airlineService.getAirlineByCode(
        code.toUpperCase()
      );

      if (!airline) {
        res.status(404).json({
          success: false,
          message: "Airline not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Airline retrieved successfully",
        data: airline,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve airline",
      });
    }
  }

  // GET /api/airlines/search?q=query
  async searchAirlines(req: Request, res: Response) {
    try {
      const { q } = req.query;
      const airlines = await this.airlineService.searchAirlines(
        (q as string) || ""
      );

      res.json({
        success: true,
        message: "Search completed successfully",
        data: airlines,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to search airlines",
      });
    }
  }

  // POST /api/airlines
  async createAirline(req: Request, res: Response) {
    console.log("🛬 POST /api/airlines - Request received:", {
      body: req.body,
      headers: req.headers["content-type"],
    });

    try {
      // Clean up empty strings and null values to undefined for optional URL fields
      const cleanedBody = {
        ...req.body,
        logo:
          req.body.logo === "" || req.body.logo === null
            ? undefined
            : req.body.logo,
        website:
          req.body.website === "" || req.body.website === null
            ? undefined
            : req.body.website,
        icaoCode:
          req.body.icaoCode === "" || req.body.icaoCode === null
            ? undefined
            : req.body.icaoCode,
        description:
          req.body.description === "" || req.body.description === null
            ? undefined
            : req.body.description,
      };

      console.log("🧹 Cleaned body:", cleanedBody);

      const validatedData = CreateAirlineSchema.parse(cleanedBody);
      console.log("✅ Validation passed:", validatedData);

      const airline = await this.airlineService.createAirline(validatedData);
      console.log("✅ Airline created:", airline);

      res.status(201).json({
        success: true,
        message: "Airline created successfully",
        data: airline,
      });
    } catch (error: any) {
      console.error("❌ Create airline error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      const statusCode = error.message.includes("already exists") ? 409 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to create airline",
      });
    }
  }

  // PUT /api/airlines/:id
  async updateAirline(req: Request, res: Response) {
    console.log("✈️ PUT /api/airlines/:id - Request received:", {
      id: req.params.id,
      body: req.body,
      headers: req.headers["content-type"],
    });

    try {
      const { id } = req.params;

      // Clean up empty strings and null values to undefined for optional fields
      const cleanedBody = {
        ...req.body,
        logo:
          req.body.logo === "" || req.body.logo === null
            ? undefined
            : req.body.logo,
        website:
          req.body.website === "" || req.body.website === null
            ? undefined
            : req.body.website,
        icaoCode:
          req.body.icaoCode === "" || req.body.icaoCode === null
            ? undefined
            : req.body.icaoCode,
        description:
          req.body.description === "" || req.body.description === null
            ? undefined
            : req.body.description,
      };

      console.log("🧹 Cleaned update body:", cleanedBody);

      const validatedData = UpdateAirlineSchema.parse(cleanedBody);
      console.log("✅ Update validation passed:", validatedData);

      const airline = await this.airlineService.updateAirline(
        id,
        validatedData
      );
      console.log("✅ Airline updated:", airline);

      res.json({
        success: true,
        message: "Airline updated successfully",
        data: airline,
      });
    } catch (error: any) {
      console.error("❌ Update airline error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });

      let statusCode = 400;
      if (error.message.includes("not found")) statusCode = 404;
      if (error.message.includes("already exists")) statusCode = 409;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to update airline",
      });
    }
  }

  // DELETE /api/airlines/:id
  async deleteAirline(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.airlineService.deleteAirline(id);

      res.json({
        success: true,
        message: "Airline deleted successfully",
      });
    } catch (error: any) {
      const statusCode = error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to delete airline",
      });
    }
  }
}
