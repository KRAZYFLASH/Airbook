import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import {
  CreateBookingSchema,
  UpdateBookingSchema,
  BookingQuerySchema,
} from "./booking.schema";
import "../../../common/types/auth.types"; // Import global type extensions

export class BookingController {
  private bookingService: BookingService;

  constructor() {
    this.bookingService = new BookingService();
  }

  // POST /api/bookings - Create new booking
  createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      // Validate request body
      const validation = CreateBookingSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.issues,
        });
        return;
      }

      const result = await this.bookingService.createBooking(
        userId,
        validation.data
      );

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in createBooking:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // GET /api/bookings/:id - Get booking by ID
  getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.role === "ADMIN" ? undefined : req.user?.userId;

      const result = await this.bookingService.getBookingById(id, userId);

      if (result.success) {
        res.json(result);
      } else {
        const status = result.message.includes("not found")
          ? 404
          : result.message.includes("Unauthorized")
          ? 403
          : 400;
        res.status(status).json(result);
      }
    } catch (error) {
      console.error("Error in getBookingById:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // GET /api/bookings/reference/:reference - Get booking by reference
  getBookingByReference = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { reference } = req.params;
      const userId = req.user?.role === "ADMIN" ? undefined : req.user?.userId;

      const result = await this.bookingService.getBookingByReference(
        reference,
        userId
      );

      if (result.success) {
        res.json(result);
      } else {
        const status = result.message.includes("not found")
          ? 404
          : result.message.includes("Unauthorized")
          ? 403
          : 400;
        res.status(status).json(result);
      }
    } catch (error) {
      console.error("Error in getBookingByReference:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // GET /api/bookings/my - Get current user's bookings
  getMyBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
        });
        return;
      }

      // Validate query parameters
      const queryValidation = BookingQuerySchema.safeParse({
        status: req.query.status,
        fromDate: req.query.fromDate,
        toDate: req.query.toDate,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      });

      if (!queryValidation.success) {
        res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: queryValidation.error.issues,
        });
        return;
      }

      const result = await this.bookingService.getUserBookings(
        userId,
        queryValidation.data
      );
      res.json(result);
    } catch (error) {
      console.error("Error in getMyBookings:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // GET /api/bookings - Get all bookings (admin only)
  getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      // Check admin role
      if (req.user?.role !== "ADMIN") {
        res.status(403).json({
          success: false,
          message: "Admin access required",
        });
        return;
      }

      // Validate query parameters
      const queryValidation = BookingQuerySchema.safeParse({
        status: req.query.status,
        fromDate: req.query.fromDate,
        toDate: req.query.toDate,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      });

      if (!queryValidation.success) {
        res.status(400).json({
          success: false,
          message: "Invalid query parameters",
          errors: queryValidation.error.issues,
        });
        return;
      }

      const result = await this.bookingService.getAllBookings(
        queryValidation.data
      );
      res.json(result);
    } catch (error) {
      console.error("Error in getAllBookings:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // PUT /api/bookings/:id - Update booking
  updateBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.role === "ADMIN" ? undefined : req.user?.userId;

      // Validate request body
      const validation = UpdateBookingSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.issues,
        });
        return;
      }

      const result = await this.bookingService.updateBooking(
        id,
        validation.data,
        userId
      );

      if (result.success) {
        res.json(result);
      } else {
        const status = result.message.includes("not found")
          ? 404
          : result.message.includes("Unauthorized")
          ? 403
          : 400;
        res.status(status).json(result);
      }
    } catch (error) {
      console.error("Error in updateBooking:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  // PUT /api/bookings/:id/cancel - Cancel booking
  cancelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.role === "ADMIN" ? undefined : req.user?.userId;

      const result = await this.bookingService.cancelBooking(id, userId);

      if (result.success) {
        res.json(result);
      } else {
        const status = result.message.includes("not found")
          ? 404
          : result.message.includes("Unauthorized")
          ? 403
          : 400;
        res.status(status).json(result);
      }
    } catch (error) {
      console.error("Error in cancelBooking:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
