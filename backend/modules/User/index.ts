import { Router } from "express";
import { bookingRoutes } from "./booking";
import { destinationRoutes } from "./destination";
import { airportRoutes } from "./airports";

export function setupUserRoutes(): Router {
  const router = Router();

  // User routes
  router.use("/bookings", bookingRoutes);
  router.use("/destinations", destinationRoutes);
  router.use("/user-airports", airportRoutes);

  return router;
}
