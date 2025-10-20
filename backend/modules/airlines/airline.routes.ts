import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { AirlineRepository } from "./airline.repository";
import { AirlineService } from "./airline.service";
import { AirlineController } from "./airline.controller";

const router = Router();
const prisma = new PrismaClient();

// Initialize dependencies
const airlineRepository = new AirlineRepository(prisma);
const airlineService = new AirlineService(airlineRepository);
const airlineController = new AirlineController(airlineService);

// Bind methods to maintain 'this' context
const getAllAirlines = airlineController.getAllAirlines.bind(airlineController);
const getActiveAirlines =
  airlineController.getActiveAirlines.bind(airlineController);
const getAirlineById = airlineController.getAirlineById.bind(airlineController);
const getAirlineByCode =
  airlineController.getAirlineByCode.bind(airlineController);
const searchAirlines = airlineController.searchAirlines.bind(airlineController);
const createAirline = airlineController.createAirline.bind(airlineController);
const updateAirline = airlineController.updateAirline.bind(airlineController);
const deleteAirline = airlineController.deleteAirline.bind(airlineController);
const fetchExternalAirlines =
  airlineController.fetchExternalAirlines.bind(airlineController);
const fetchExternalAirlineByCode =
  airlineController.fetchExternalAirlineByCode.bind(airlineController);
const syncExternalAirlines =
  airlineController.syncExternalAirlines.bind(airlineController);
const getExternalProviders =
  airlineController.getExternalProviders.bind(airlineController);

// Routes
router.use((req, res, next) => {
  console.log(`🛣️ Airlines Route: ${req.method} ${req.path}`, req.body);
  next();
});

router.get("/", getAllAirlines);
router.get("/active", getActiveAirlines);
router.get("/search", searchAirlines);
router.get("/external/fetch", fetchExternalAirlines);
router.get("/external/providers", getExternalProviders);
router.get("/external/code/:code", fetchExternalAirlineByCode);
router.post("/external/sync", syncExternalAirlines);
router.get("/code/:code", getAirlineByCode);
router.get("/:id", getAirlineById);
router.post("/", createAirline);
router.put("/:id", updateAirline);
router.delete("/:id", deleteAirline);

export { router as airlineRoutes };
