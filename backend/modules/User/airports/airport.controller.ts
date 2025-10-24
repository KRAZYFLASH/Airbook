import { Request, Response } from "express";
import { airportService } from "./airport.service";

export class AirportController {
  /**
   * Search airports
   * GET /api/airports/search?query=<search_term>&limit=<number>
   */
  async searchAirports(req: Request, res: Response): Promise<Response> {
    try {
      const { query, limit } = req.query;

      if (!query || typeof query !== "string") {
        return res.status(400).json({
          success: false,
          message: "Query parameter is required",
        });
      }

      const limitNumber = limit ? parseInt(limit as string) : 10;
      const airports = await airportService.searchAirports(query, limitNumber);

      return res.json({
        success: true,
        data: airports,
        count: airports.length,
      });
    } catch (error) {
      console.error("Error searching airports:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get popular airports
   * GET /api/airports/popular?limit=<number>
   */
  async getPopularAirports(req: Request, res: Response): Promise<Response> {
    try {
      const { limit } = req.query;
      const limitNumber = limit ? parseInt(limit as string) : 20;

      const airports = await airportService.getPopularAirports(limitNumber);

      return res.json({
        success: true,
        data: airports,
        count: airports.length,
      });
    } catch (error) {
      console.error("Error getting popular airports:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get airports by country
   * GET /api/airports/country/:countryCode?limit=<number>
   */
  async getAirportsByCountry(req: Request, res: Response): Promise<Response> {
    try {
      const { countryCode } = req.params;
      const { limit } = req.query;

      if (!countryCode) {
        return res.status(400).json({
          success: false,
          message: "Country code is required",
        });
      }

      const limitNumber = limit ? parseInt(limit as string) : 50;
      const airports = await airportService.getAirportsByCountry(
        countryCode,
        limitNumber
      );

      return res.json({
        success: true,
        data: airports,
        count: airports.length,
      });
    } catch (error) {
      console.error("Error getting airports by country:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get Indonesian airports
   * GET /api/airports/indonesia?limit=<number>
   */
  async getIndonesianAirports(req: Request, res: Response): Promise<Response> {
    try {
      const { limit } = req.query;
      const limitNumber = limit ? parseInt(limit as string) : 30;

      const airports = await airportService.getIndonesianAirports(limitNumber);

      return res.json({
        success: true,
        data: airports,
        count: airports.length,
      });
    } catch (error) {
      console.error("Error getting Indonesian airports:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  /**
   * Get airport by IATA code
   * GET /api/airports/iata/:iataCode
   */
  async getAirportByIata(req: Request, res: Response): Promise<Response> {
    try {
      const { iataCode } = req.params;

      if (!iataCode) {
        return res.status(400).json({
          success: false,
          message: "IATA code is required",
        });
      }

      const airport = await airportService.getAirportByIata(iataCode);

      if (!airport) {
        return res.status(404).json({
          success: false,
          message: "Airport not found",
        });
      }

      return res.json({
        success: true,
        data: airport,
      });
    } catch (error) {
      console.error("Error getting airport by IATA:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}

export const airportController = new AirportController();
