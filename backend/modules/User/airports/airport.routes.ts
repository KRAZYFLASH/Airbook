import { Router } from "express";
import { airportController } from "./airport.controller";

const router = Router();

// Search airports
router.get("/search", airportController.searchAirports);

// Get popular airports
router.get("/popular", airportController.getPopularAirports);

// Get Indonesian airports
router.get("/indonesia", airportController.getIndonesianAirports);

// Get airports by country
router.get("/country/:countryCode", airportController.getAirportsByCountry);

// Get airport by IATA code
router.get("/iata/:iataCode", airportController.getAirportByIata);

export default router;
