import { Request, Response } from "express";
import { DestinationService } from "./destination.service";
import {
  createDestinationSchema,
  updateDestinationSchema,
} from "./destination.schema";

export class DestinationController {
  private destinationService: DestinationService;

  constructor() {
    this.destinationService = new DestinationService();
  }

  // CSV Import Endpoints

  // POST /api/destinations/import/csv
  importAirportsFromCSV = async (req: Request, res: Response) => {
    try {
      const { countries, types, limit, overwrite } = req.body;

      const options = {
        countries: countries || undefined,
        types: types || undefined,
        limit: limit ? parseInt(limit) : undefined,
        overwrite: overwrite === true,
      };

      const result = await this.destinationService.importAirportsFromCSV(
        options
      );

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error during CSV import",
      });
    }
  };

  // POST /api/destinations/import/indonesia
  bulkImportIndonesian = async (req: Request, res: Response) => {
    try {
      const result =
        await this.destinationService.bulkImportIndonesianAirports();

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error during Indonesian airports import",
      });
    }
  };

  // POST /api/destinations/import/international
  bulkImportInternational = async (req: Request, res: Response) => {
    try {
      const result =
        await this.destinationService.bulkImportInternationalAirports();

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error during international airports import",
      });
    }
  };

  // CSV Live Search Endpoints (without saving to DB)

  // GET /api/destinations/csv/search?query=jakarta
  searchCSV = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.query;

      if (!query) {
        res.status(400).json({
          success: false,
          message: "Search query is required",
        });
        return;
      }

      const result = await this.destinationService.searchAirportsFromCSV(
        query as string
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // GET /api/destinations/csv/indonesia
  getIndonesianFromCSV = async (req: Request, res: Response) => {
    try {
      const result =
        await this.destinationService.getIndonesianAirportsFromCSV();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // GET /api/destinations/csv/international
  getInternationalFromCSV = async (req: Request, res: Response) => {
    try {
      const result =
        await this.destinationService.getInternationalAirportsFromCSV();
      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // Frontend-specific endpoints for cleaner response

  // GET /api/destinations/frontend/search?q=jakarta
  frontendSearch = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string" || q.length < 2) {
        res.json({
          success: true,
          data: [],
        });
        return;
      }

      const result = await this.destinationService.searchAirportsFromCSV(q);

      if (result.success) {
        // Return clean response for frontend
        res.json({
          success: true,
          data: result.data,
        });
      } else {
        res.json({
          success: false,
          data: [],
          error: result.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        data: [],
        error: "Server error",
      });
    }
  };

  // GET /api/destinations/frontend/indonesia
  frontendIndonesia = async (req: Request, res: Response): Promise<void> => {
    try {
      const result =
        await this.destinationService.getIndonesianAirportsFromCSV();

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
        });
      } else {
        res.json({
          success: false,
          data: [],
          error: result.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        data: [],
        error: "Server error",
      });
    }
  };

  // GET /api/destinations/frontend/international
  frontendInternational = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const result =
        await this.destinationService.getInternationalAirportsFromCSV();

      if (result.success) {
        res.json({
          success: true,
          data: result.data,
        });
      } else {
        res.json({
          success: false,
          data: [],
          error: result.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        data: [],
        error: "Server error",
      });
    }
  };

  // Existing Database Endpoints

  // GET /api/destinations
  getAllDestinations = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const isActive =
        req.query.isActive === "true"
          ? true
          : req.query.isActive === "false"
          ? false
          : undefined;

      const result = await this.destinationService.getAllDestinations(
        page,
        limit,
        isActive
      );

      if (result.success) {
        res.json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // GET /api/destinations/:id
  getDestinationById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.destinationService.getDestinationById(id);

      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // GET /api/destinations/search?query=bali
  searchDestinations = async (req: Request, res: Response) => {
    try {
      const { query, country, isActive } = req.query;

      const result = await this.destinationService.searchDestinations(
        query as string,
        country as string,
        isActive === "true" ? true : isActive === "false" ? false : undefined
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // POST /api/destinations
  createDestination = async (req: Request, res: Response) => {
    try {
      const validatedData = createDestinationSchema.parse(req.body);
      const result = await this.destinationService.createDestination(
        validatedData
      );

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };

  // PUT /api/destinations/:id
  updateDestination = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const validatedData = updateDestinationSchema.parse(req.body);
      const result = await this.destinationService.updateDestination(
        id,
        validatedData
      );

      if (result.success) {
        res.json(result);
      } else {
        res
          .status(result.message === "Destination not found" ? 404 : 400)
          .json(result);
      }
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  };
}
