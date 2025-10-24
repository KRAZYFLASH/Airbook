// =============================================================
// Airport API Routes - Database Integration
// =============================================================

import { Router } from "express";
import { DatabaseAirportService } from "../../services/database/airport.service";

const router = Router();

/**
 * GET /api/airports
 * Get all airports
 */
router.get("/", async (req, res) => {
  try {
    const airports = await DatabaseAirportService.getAllAirports();
    res.json({
      success: true,
      data: airports,
      total: airports.length,
    });
  } catch (error) {
    console.error("Error fetching airports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch airports",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/indonesian
 * Get Indonesian airports only
 */
router.get("/indonesian", async (req, res) => {
  try {
    const airports = await DatabaseAirportService.getIndonesianAirports();
    res.json({
      success: true,
      data: airports,
      total: airports.length,
    });
  } catch (error) {
    console.error("Error fetching Indonesian airports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Indonesian airports",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/regional
 * Get regional airports (ASEAN)
 */
router.get("/regional", async (req, res) => {
  try {
    const airports = await DatabaseAirportService.getRegionalAirports();
    res.json({
      success: true,
      data: airports,
      total: airports.length,
    });
  } catch (error) {
    console.error("Error fetching regional airports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch regional airports",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/international
 * Get international airports
 */
router.get("/international", async (req, res) => {
  try {
    const airports = await DatabaseAirportService.getInternationalAirports();
    res.json({
      success: true,
      data: airports,
      total: airports.length,
    });
  } catch (error) {
    console.error("Error fetching international airports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch international airports",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/search?q=searchTerm
 * Search airports
 */
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters long",
      });
    }

    const airports = await DatabaseAirportService.searchAirports(query);
    return res.json({
      success: true,
      data: airports,
      total: airports.length,
      query: query,
    });
  } catch (error) {
    console.error("Error searching airports:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to search airports",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/country/:countryCode
 * Get airports by country code
 */
router.get("/country/:countryCode", async (req, res) => {
  try {
    const { countryCode } = req.params;
    const airports = await DatabaseAirportService.getAirportsByCountry(
      countryCode.toUpperCase()
    );

    res.json({
      success: true,
      data: airports,
      total: airports.length,
      countryCode: countryCode.toUpperCase(),
    });
  } catch (error) {
    console.error("Error fetching airports by country:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch airports by country",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/region/:continent
 * Get airports by region/continent
 */
router.get("/region/:continent", async (req, res) => {
  try {
    const { continent } = req.params;
    const airports = await DatabaseAirportService.getAirportsByRegion(
      continent
    );

    res.json({
      success: true,
      data: airports,
      total: airports.length,
      continent: continent,
    });
  } catch (error) {
    console.error("Error fetching airports by region:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch airports by region",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/city/:cityName
 * Get airports by city name
 */
router.get("/city/:cityName", async (req, res) => {
  try {
    const { cityName } = req.params;
    const airports = await DatabaseAirportService.getAirportsByCity(cityName);

    res.json({
      success: true,
      data: airports,
      total: airports.length,
      city: cityName,
    });
  } catch (error) {
    console.error("Error fetching airports by city:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch airports by city",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/iata/:iataCode
 * Get airport by IATA code
 */
router.get("/iata/:iataCode", async (req, res) => {
  try {
    const { iataCode } = req.params;
    const airport = await DatabaseAirportService.getAirportByIATA(iataCode);

    if (!airport) {
      return res.status(404).json({
        success: false,
        message: `Airport with IATA code '${iataCode.toUpperCase()}' not found`,
      });
    }

    return res.json({
      success: true,
      data: airport,
    });
  } catch (error) {
    console.error("Error fetching airport by IATA:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch airport by IATA code",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * POST /api/airports
 * Create new airport
 */
router.post("/", async (req, res) => {
  try {
    const { name, iataCode, icaoCode, cityId, timezone } = req.body;

    if (!name || !cityId) {
      return res.status(400).json({
        success: false,
        message: "Name and cityId are required",
      });
    }

    const airport = await DatabaseAirportService.createAirport({
      name,
      iataCode,
      icaoCode,
      cityId,
      timezone,
    });

    return res.status(201).json({
      success: true,
      data: airport,
      message: "Airport created successfully",
    });
  } catch (error) {
    console.error("Error creating airport:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create airport",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/:id
 * Get airport by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const airport = await DatabaseAirportService.getAirportById(id);

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
    console.error("Error fetching airport:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch airport",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * PUT /api/airports/:id
 * Update airport
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, iataCode, icaoCode, cityId, timezone } = req.body;

    const airport = await DatabaseAirportService.updateAirport(id, {
      name,
      iataCode,
      icaoCode,
      cityId,
      timezone,
    });

    return res.json({
      success: true,
      data: airport,
      message: "Airport updated successfully",
    });
  } catch (error) {
    console.error("Error updating airport:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update airport",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * DELETE /api/airports/:id
 * Delete airport (soft delete)
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await DatabaseAirportService.deleteAirport(id);

    return res.json({
      success: true,
      message: "Airport deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting airport:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete airport",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/dropdown/countries
 * Get all countries for dropdown
 */
router.get("/dropdown/countries", async (req, res) => {
  try {
    const countries = await DatabaseAirportService.getAllCountries();
    return res.json({
      success: true,
      data: countries,
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch countries",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/dropdown/cities/:countryId
 * Get cities by country for dropdown
 */
router.get("/dropdown/cities/:countryId", async (req, res) => {
  try {
    const { countryId } = req.params;
    const cities = await DatabaseAirportService.getCitiesByCountry(countryId);
    return res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cities",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * GET /api/airports/stats
 * Get airport statistics
 */
router.get("/stats", async (req, res) => {
  try {
    const stats = await DatabaseAirportService.getAirportStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching airport stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch airport statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
