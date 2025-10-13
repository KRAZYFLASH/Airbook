import { Router } from "express";
import { BookingController } from "./booking.controller";
import {
  authMiddleware,
  adminOnlyMiddleware,
} from "../../../common/middleware";

const router = Router();
const bookingController = new BookingController();

// Protected routes (require authentication)
router.post("/", authMiddleware, bookingController.createBooking);
router.get("/my", authMiddleware, bookingController.getMyBookings);
router.get(
  "/reference/:reference",
  authMiddleware,
  bookingController.getBookingByReference
);
router.get("/:id", authMiddleware, bookingController.getBookingById);
router.put("/:id", authMiddleware, bookingController.updateBooking);
router.put("/:id/cancel", authMiddleware, bookingController.cancelBooking);

// Admin only routes
router.get(
  "/",
  authMiddleware,
  adminOnlyMiddleware,
  bookingController.getAllBookings
);

export default router;
