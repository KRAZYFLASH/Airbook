import { Router } from "express";
import { airlineRoutes } from "./airlines";
import { airportRoutes } from "./airports";
import citiesRoutes from "./cities/cities.routes";
import countriesRoutes from "./countries/countries.routes";
import { flightScheduleRoutes } from "./flight-schedule";
import { promotionRoutes } from "./promotion";

export function setupAdminRoutes(): Router {
  const router = Router();

  // Admin routes
  router.use("/airlines", airlineRoutes);
  router.use("/airports", airportRoutes);
  router.use("/cities", citiesRoutes);
  router.use("/countries", countriesRoutes);
  router.use("/flight-schedules", flightScheduleRoutes);
  router.use("/promotions", promotionRoutes);

  return router;
}
