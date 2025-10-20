import express from "express";
import cors from "cors";
import { authRoutes } from "./modules/auth";
import destinationRoutes from "./modules/destination/destination.routes";
import { bookingRoutes } from "./modules/User/booking";
import { airlineRoutes } from "./modules/airlines";
import { flightScheduleRoutes } from "./modules/flight-schedule";
import { promotionRoutes } from "./modules/promotion";
import { airportRoutes } from "./modules/airports";
import databaseAirportRoutes from "./modules/airports/database-airport.routes";
import countriesRoutes from "./modules/countries/countries.routes";
import citiesRoutes from "./modules/cities/cities.routes";
import { requestLogger } from "./common/middleware";

const app = express();

// Middleware
app.use(requestLogger);
app.use(
  cors({
    origin: true, // Allow all origins in development
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// General logging middleware
app.use((req, res, next) => {
  if (req.url.includes("/api/")) {
    console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === "PUT" && req.body) {
      console.log("📦 Body:", JSON.stringify(req.body, null, 2));
    }
  }
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/airlines", airlineRoutes);
app.use("/api/flight-schedules", flightScheduleRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/airports", airportRoutes);
app.use("/api/db-airports", databaseAirportRoutes);
// Debug: Countries and Cities Routes
console.log("🌍 Mounting countries routes at /api");
app.use("/api", countriesRoutes);
console.log("🏙️ Mounting cities routes at /api");
app.use("/api", citiesRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Airbook API is running",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
