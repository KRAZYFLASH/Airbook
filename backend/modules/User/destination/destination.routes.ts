import { Router } from "express";
import { DestinationController } from "./destination.controller";

const router = Router();
const destinationController = new DestinationController();

// CSV Live search routes (used by frontend)
router.get("/csv/search", destinationController.searchCSV);
router.get("/csv/indonesia", destinationController.getIndonesianFromCSV);

// Special routes (must come before parameterized routes)
router.get("/mock", destinationController.getMockDestinations);
router.get("/popular", destinationController.getPopularDestinations);
router.get("/search", destinationController.searchDestinations);

// Database routes (existing)
router.get("/", destinationController.getAllDestinations);
router.get("/:id", destinationController.getDestinationById);
router.post("/", destinationController.createDestination);
router.put("/:id", destinationController.updateDestination);
router.delete("/:id", destinationController.deleteDestination);

export default router;
