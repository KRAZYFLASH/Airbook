import { Router } from "express";
import { prisma } from "../../db/prisma";
import { FlightScheduleRepository } from "./flight-schedule.repository";
import { FlightScheduleService } from "./flight-schedule.service";
import { FlightScheduleController } from "./flight-schedule.controller";

const router = Router();

// Initialize layers
const flightScheduleRepository = new FlightScheduleRepository(prisma);
const flightScheduleService = new FlightScheduleService(flightScheduleRepository);
const flightScheduleController = new FlightScheduleController(flightScheduleService);

// Bind methods to preserve 'this' context
const getAllFlightSchedules = flightScheduleController.getAllFlightSchedules.bind(flightScheduleController);
const getFlightScheduleById = flightScheduleController.getFlightScheduleById.bind(flightScheduleController);
const createFlightSchedule = flightScheduleController.createFlightSchedule.bind(flightScheduleController);
const updateFlightSchedule = flightScheduleController.updateFlightSchedule.bind(flightScheduleController);
const deleteFlightSchedule = flightScheduleController.deleteFlightSchedule.bind(flightScheduleController);

// Add logging middleware
router.use((req, res, next) => {
  console.log(`🛣️ Flight Schedules Route: ${req.method} ${req.path}`, req.body);
  next();
});

// Routes
router.get("/", getAllFlightSchedules);
router.get("/:id", getFlightScheduleById);
router.post("/", createFlightSchedule);
router.put("/:id", updateFlightSchedule);
router.delete("/:id", deleteFlightSchedule);

export { router as flightScheduleRoutes };