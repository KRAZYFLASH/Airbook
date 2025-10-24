import { Request, Response } from "express";
import { FlightScheduleService } from "./flight-schedule.service";
import { CreateFlightScheduleSchema, UpdateFlightScheduleSchema } from "./flight-schedule.schemas";

export class FlightScheduleController {
  constructor(private flightScheduleService: FlightScheduleService) {}

  async getAllFlightSchedules(req: Request, res: Response) {
    try {
      console.log("📋 GET /api/flight-schedules - Request received");
      
      const schedules = await this.flightScheduleService.getAllFlightSchedules();
      console.log("✅ Flight schedules retrieved:", schedules.length);

      res.json({
        success: true,
        message: "Flight schedules retrieved successfully",
        data: schedules,
      });
    } catch (error) {
      console.error("❌ Error getting flight schedules:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to get flight schedules",
      });
    }
  }

  async getFlightScheduleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log("📋 GET /api/flight-schedules/:id - Request received:", { id });

      const schedule = await this.flightScheduleService.getFlightScheduleById(id);
      console.log("✅ Flight schedule found:", schedule);

      res.json({
        success: true,
        message: "Flight schedule retrieved successfully",
        data: schedule,
      });
    } catch (error) {
      console.error("❌ Error getting flight schedule:", error);
      const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to get flight schedule",
      });
    }
  }

  async createFlightSchedule(req: Request, res: Response) {
    try {
      console.log("✈️ POST /api/flight-schedules - Request received:", {
        body: req.body,
        headers: req.headers["content-type"],
      });

      // Clean empty strings to undefined for optional fields
      const cleanedBody = {
        ...req.body,
        flightNo: req.body.flightNo?.trim(),
        origin: req.body.origin?.trim()?.toUpperCase(),
        destination: req.body.destination?.trim()?.toUpperCase(),
      };

      console.log("🧹 Cleaned create body:", cleanedBody);

      const validatedData = CreateFlightScheduleSchema.parse(cleanedBody);
      console.log("✅ Create validation passed:", validatedData);

      const schedule = await this.flightScheduleService.createFlightSchedule(validatedData);
      console.log("✅ Flight schedule created:", schedule);

      res.status(201).json({
        success: true,
        message: "Flight schedule created successfully",
        data: schedule,
      });
    } catch (error) {
      console.error("❌ Error creating flight schedule:", error);
      const statusCode = error instanceof Error && error.message.includes("validation") ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to create flight schedule",
      });
    }
  }

  async updateFlightSchedule(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log("✈️ PUT /api/flight-schedules/:id - Request received:", {
        id,
        body: req.body,
        headers: req.headers["content-type"],
      });

      // Clean empty strings to undefined for optional fields  
      const cleanedBody = {
        ...req.body,
        flightNo: req.body.flightNo === "" ? undefined : req.body.flightNo?.trim(),
        origin: req.body.origin === "" ? undefined : req.body.origin?.trim()?.toUpperCase(),
        destination: req.body.destination === "" ? undefined : req.body.destination?.trim()?.toUpperCase(),
      };

      console.log("🧹 Cleaned update body:", cleanedBody);

      const validatedData = UpdateFlightScheduleSchema.parse(cleanedBody);
      console.log("✅ Update validation passed:", validatedData);

      const schedule = await this.flightScheduleService.updateFlightSchedule(id, validatedData);
      console.log("✅ Flight schedule updated:", schedule);

      res.json({
        success: true,
        message: "Flight schedule updated successfully",
        data: schedule,
      });
    } catch (error) {
      console.error("❌ Error updating flight schedule:", error);
      const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 
                        error instanceof Error && error.message.includes("validation") ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to update flight schedule",
      });
    }
  }

  async deleteFlightSchedule(req: Request, res: Response) {
    try {
      const { id } = req.params;
      console.log("🗑️ DELETE /api/flight-schedules/:id - Request received:", { id });

      await this.flightScheduleService.deleteFlightSchedule(id);
      console.log("✅ Flight schedule deleted");

      res.json({
        success: true,
        message: "Flight schedule deleted successfully",
      });
    } catch (error) {
      console.error("❌ Error deleting flight schedule:", error);
      const statusCode = error instanceof Error && error.message.includes("not found") ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete flight schedule",
      });
    }
  }
}