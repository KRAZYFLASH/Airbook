import { Router } from "express";
import { DestinationController } from "./destination.controller";

const router = Router();
const destinationController = new DestinationController();

// CSV Import routes (admin only - requires authentication in production)
router.post("/import/csv", destinationController.importAirportsFromCSV);
router.post("/import/indonesia", destinationController.bulkImportIndonesian);
router.post(
  "/import/international",
  destinationController.bulkImportInternational
);

// CSV Live search routes (public - reads from CSV without saving to DB)
router.get("/csv/search", destinationController.searchCSV);
router.get("/csv/indonesia", destinationController.getIndonesianFromCSV);
router.get("/csv/international", destinationController.getInternationalFromCSV);

// Frontend-optimized routes
router.get("/frontend/search", destinationController.frontendSearch);
router.get("/frontend/indonesia", destinationController.frontendIndonesia);
router.get(
  "/frontend/international",
  destinationController.frontendInternational
);

// Database routes (existing)
router.get("/search", destinationController.searchDestinations);
router.get("/", destinationController.getAllDestinations);
router.get("/:id", destinationController.getDestinationById);
router.post("/", destinationController.createDestination);
router.put("/:id", destinationController.updateDestination);

export default router;
