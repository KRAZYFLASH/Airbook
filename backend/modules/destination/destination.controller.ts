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

  // Mock data untuk testing frontend (sementara)
  getMockDestinations = async (req: Request, res: Response) => {
    try {
      const mockDestinations = [
        {
          id: "bali-dest",
          name: "Bali Paradise",
          description:
            "Experience the beautiful beaches, temples, and culture of Bali",
          category: "BEACH",
          rating: 4.8,
          imageUrl:
            "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
          isActive: true,
          isFeatured: true,
          city: { id: "denpasar-city", name: "Denpasar" },
          country: { id: "indonesia-id", name: "Indonesia" },
          airport: {
            id: "dps-airport",
            name: "Ngurah Rai International Airport",
            iataCode: "DPS",
          },
        },
        {
          id: "jakarta-dest",
          name: "Jakarta City Break",
          description:
            "Explore Indonesia's vibrant capital city with modern attractions",
          category: "CITY",
          rating: 4.3,
          imageUrl:
            "https://images.unsplash.com/photo-1555333145-4acf190da336?w=800",
          isActive: true,
          isFeatured: true,
          city: { id: "jakarta-city", name: "Jakarta" },
          country: { id: "indonesia-id", name: "Indonesia" },
          airport: {
            id: "cgk-airport",
            name: "Soekarno-Hatta International Airport",
            iataCode: "CGK",
          },
        },
        {
          id: "yogya-dest",
          name: "Yogyakarta Cultural Tour",
          description:
            "Discover the cultural heart of Java with ancient temples and traditions",
          category: "CULTURAL",
          rating: 4.6,
          imageUrl:
            "https://images.unsplash.com/photo-1599833842960-0143f48e65f8?w=800",
          isActive: true,
          isFeatured: true,
          city: { id: "yogya-city", name: "Yogyakarta" },
          country: { id: "indonesia-id", name: "Indonesia" },
          airport: {
            id: "jog-airport",
            name: "Adisutcipto International Airport",
            iataCode: "JOG",
          },
        },
      ];

      res.json({
        success: true,
        message: "Mock destinations retrieved successfully",
        data: mockDestinations,
        pagination: {
          page: 1,
          limit: 10,
          total: 3,
          totalPages: 1,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // CSV Import Endpoints

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

  // DELETE /api/destinations/:id
  deleteDestination = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await this.destinationService.deleteDestination(id);

      if (result.success) {
        res.json(result);
      } else {
        res
          .status(result.message === "Destination not found" ? 404 : 400)
          .json(result);
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // GET /api/destinations/popular
  getPopularDestinations = async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const result = await this.destinationService.getPopularDestinations(
        limit
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
}
