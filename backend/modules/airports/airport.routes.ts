// =============================================================
// Airport Routes - Express routes untuk Airport API
// =============================================================

import { Router } from "express";
import { AirportController } from "./airport.controller";
import { AirportService } from "./airport.service";
import { AirportRepository } from "./airport.repository";
import { prisma } from "../../db/prisma";

// Create router
const router = Router();

// Initialize dependencies
const airportRepository = new AirportRepository(prisma);
const airportService = new AirportService(airportRepository);
const airportController = new AirportController(airportService);

// Bind methods to preserve 'this' context
const bindController = (controller: AirportController) => ({
  getAirports: controller.getAirports.bind(controller),
  getAirportById: controller.getAirportById.bind(controller),
  getAirportByIATA: controller.getAirportByIATA.bind(controller),
  getAirportByICAO: controller.getAirportByICAO.bind(controller),
  createAirport: controller.createAirport.bind(controller),
  updateAirport: controller.updateAirport.bind(controller),
  deleteAirport: controller.deleteAirport.bind(controller),
  toggleAirportStatus: controller.toggleAirportStatus.bind(controller),
  getDropdownData: controller.getDropdownData.bind(controller),
  getCitiesByCountry: controller.getCitiesByCountry.bind(controller),
  getAirportsForDropdown: controller.getAirportsForDropdown.bind(controller),
  searchAirports: controller.searchAirports.bind(controller),
});

const boundController = bindController(airportController);

// =============================================================
// CRUD Routes
// =============================================================

// GET /api/airports - Get all airports (with pagination and filtering)
router.get("/", boundController.getAirports);

// GET /api/airports/:id - Get airport by ID
router.get("/:id", boundController.getAirportById);

// POST /api/airports - Create new airport
router.post("/", boundController.createAirport);

// PUT /api/airports/:id - Update airport
router.put("/:id", boundController.updateAirport);

// DELETE /api/airports/:id - Delete airport
router.delete("/:id", boundController.deleteAirport);

// PATCH /api/airports/:id/toggle-status - Toggle airport active status
router.patch("/:id/toggle-status", boundController.toggleAirportStatus);

// =============================================================
// Lookup Routes
// =============================================================

// GET /api/airports/iata/:code - Get airport by IATA code
router.get("/iata/:code", boundController.getAirportByIATA);

// GET /api/airports/icao/:code - Get airport by ICAO code
router.get("/icao/:code", boundController.getAirportByICAO);

// =============================================================
// Dropdown & Search Routes
// =============================================================

// GET /api/airports/dropdown/countries - Get countries for dropdown
router.get("/dropdown/countries", boundController.getDropdownData);

// GET /api/airports/dropdown/cities/:countryId - Get cities by country
router.get("/dropdown/cities/:countryId", boundController.getCitiesByCountry);

// GET /api/airports/dropdown/airports - Get airports for dropdown (grouped by country)
router.get("/dropdown/airports", boundController.getAirportsForDropdown);

// GET /api/airports/search?q=query - Search airports (autocomplete)
router.get("/search", boundController.searchAirports);

export default router;
