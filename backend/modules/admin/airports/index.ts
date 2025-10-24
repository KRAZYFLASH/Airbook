// =============================================================
// Airport Module Index - Export all airport-related components
// =============================================================

export { AirportRepository } from "./airport.repository";
export { AirportService } from "./airport.service";
export { AirportController } from "./airport.controller";
export {
  createAirportSchema,
  updateAirportSchema,
  airportQuerySchema,
  type CreateAirportInput,
  type UpdateAirportInput,
  type AirportQueryInput,
} from "./airport.schemas";
export { default as airportRoutes } from "./airport.routes";
