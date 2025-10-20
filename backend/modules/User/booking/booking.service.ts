import { BookingRepository } from "./booking.repo";
import { DestinationRepository } from "../../destination/destination.repo";
import { prisma } from "../../../db/prisma";
import {
  CreateBookingInput,
  UpdateBookingInput,
  BookingQuery,
  BookingResponse,
  BookingListResponse,
  BookingCreateResponse,
  PRICE_PER_PASSENGER,
  DISTANCE_MULTIPLIER,
} from "./booking.schema";

export class BookingService {
  private bookingRepo: BookingRepository;
  private destinationRepo: DestinationRepository;

  constructor() {
    this.bookingRepo = new BookingRepository();
    this.destinationRepo = new DestinationRepository();
  }

  // Create new booking
  async createBooking(
    userId: string,
    data: CreateBookingInput
  ): Promise<BookingCreateResponse> {
    try {
      // Validate destinations exist
      const [destination, fromDestination] = await Promise.all([
        prisma.destination.findUnique({
          where: { id: data.destinationId },
          include: {
            country: true,
            city: true,
            airport: true,
          },
        }),
        prisma.destination.findUnique({
          where: { id: data.fromDestinationId },
          include: {
            country: true,
            city: true,
            airport: true,
          },
        }),
      ]);

      if (!destination) {
        return {
          success: false,
          message: "Destination not found",
          data: null as any,
        };
      }

      if (!fromDestination) {
        return {
          success: false,
          message: "From destination not found",
          data: null as any,
        };
      }

      // Check for booking conflicts
      const conflicts = await this.bookingRepo.checkConflicts(
        userId,
        new Date(data.departureDate),
        data.destinationId
      );

      if (conflicts.length > 0) {
        return {
          success: false,
          message:
            "You already have a booking for this destination around the same date",
          data: null as any,
        };
      }

      // Validate return date if provided
      if (data.returnDate) {
        const departureDate = new Date(data.departureDate);
        const returnDate = new Date(data.returnDate);

        if (returnDate <= departureDate) {
          return {
            success: false,
            message: "Return date must be after departure date",
            data: null as any,
          };
        }
      }

      // Calculate total price
      const totalPrice = this.calculatePrice(
        data.passengers,
        data.bookingClass,
        destination.country.name,
        fromDestination.country.name
      );

      // Generate booking reference
      const bookingReference =
        await this.bookingRepo.generateBookingReference();

      // Create booking
      const booking = await this.bookingRepo.create({
        ...data,
        userId,
        totalPrice,
        bookingReference,
      });

      return {
        success: true,
        message: "Booking created successfully",
        data: this.formatBookingResponse(booking),
      };
    } catch (error) {
      console.error("Error creating booking:", error);
      return {
        success: false,
        message: "Failed to create booking",
        data: null as any,
      };
    }
  }

  // Get booking by ID
  async getBookingById(
    id: string,
    userId?: string
  ): Promise<BookingCreateResponse> {
    try {
      const booking = await this.bookingRepo.findById(id);

      if (!booking) {
        return {
          success: false,
          message: "Booking not found",
          data: null as any,
        };
      }

      // Check if user owns the booking (for regular users)
      if (userId && booking.userId !== userId) {
        return {
          success: false,
          message: "Unauthorized access to booking",
          data: null as any,
        };
      }

      return {
        success: true,
        message: "Booking retrieved successfully",
        data: this.formatBookingResponse(booking),
      };
    } catch (error) {
      console.error("Error getting booking:", error);
      return {
        success: false,
        message: "Failed to retrieve booking",
        data: null as any,
      };
    }
  }

  // Get booking by reference
  async getBookingByReference(
    reference: string,
    userId?: string
  ): Promise<BookingCreateResponse> {
    try {
      const booking = await this.bookingRepo.findByReference(reference);

      if (!booking) {
        return {
          success: false,
          message: "Booking not found",
          data: null as any,
        };
      }

      // Check if user owns the booking (for regular users)
      if (userId && booking.userId !== userId) {
        return {
          success: false,
          message: "Unauthorized access to booking",
          data: null as any,
        };
      }

      return {
        success: true,
        message: "Booking retrieved successfully",
        data: this.formatBookingResponse(booking),
      };
    } catch (error) {
      console.error("Error getting booking by reference:", error);
      return {
        success: false,
        message: "Failed to retrieve booking",
        data: null as any,
      };
    }
  }

  // Get user bookings
  async getUserBookings(
    userId: string,
    query: BookingQuery
  ): Promise<BookingListResponse> {
    try {
      const result = await this.bookingRepo.findByUserId(userId, query);

      return {
        success: true,
        message: "Bookings retrieved successfully",
        data: {
          bookings: result.bookings.map((booking) =>
            this.formatBookingResponse(booking)
          ),
          total: result.total,
          hasMore: result.hasMore,
        },
      };
    } catch (error) {
      console.error("Error getting user bookings:", error);
      return {
        success: false,
        message: "Failed to retrieve bookings",
        data: {
          bookings: [],
          total: 0,
          hasMore: false,
        },
      };
    }
  }

  // Get all bookings (admin)
  async getAllBookings(query: BookingQuery): Promise<BookingListResponse> {
    try {
      const result = await this.bookingRepo.findAll(query);

      return {
        success: true,
        message: "All bookings retrieved successfully",
        data: {
          bookings: result.bookings.map((booking) =>
            this.formatBookingResponse(booking)
          ),
          total: result.total,
          hasMore: result.hasMore,
        },
      };
    } catch (error) {
      console.error("Error getting all bookings:", error);
      return {
        success: false,
        message: "Failed to retrieve bookings",
        data: {
          bookings: [],
          total: 0,
          hasMore: false,
        },
      };
    }
  }

  // Update booking
  async updateBooking(
    id: string,
    data: UpdateBookingInput,
    userId?: string
  ): Promise<BookingCreateResponse> {
    try {
      // Get existing booking
      const existing = await this.bookingRepo.findById(id);
      if (!existing) {
        return {
          success: false,
          message: "Booking not found",
          data: null as any,
        };
      }

      // Check ownership for regular users
      if (userId && existing.userId !== userId) {
        return {
          success: false,
          message: "Unauthorized access to booking",
          data: null as any,
        };
      }

      // Validate return date if provided
      if (data.returnDate && data.departureDate) {
        const departureDate = new Date(data.departureDate);
        const returnDate = new Date(data.returnDate);

        if (returnDate <= departureDate) {
          return {
            success: false,
            message: "Return date must be after departure date",
            data: null as any,
          };
        }
      }

      // Update booking
      const booking = await this.bookingRepo.update(id, data);

      return {
        success: true,
        message: "Booking updated successfully",
        data: this.formatBookingResponse(booking),
      };
    } catch (error) {
      console.error("Error updating booking:", error);
      return {
        success: false,
        message: "Failed to update booking",
        data: null as any,
      };
    }
  }

  // Cancel booking
  async cancelBooking(
    id: string,
    userId?: string
  ): Promise<BookingCreateResponse> {
    try {
      // Get existing booking
      const existing = await this.bookingRepo.findById(id);
      if (!existing) {
        return {
          success: false,
          message: "Booking not found",
          data: null as any,
        };
      }

      // Check ownership for regular users
      if (userId && existing.userId !== userId) {
        return {
          success: false,
          message: "Unauthorized access to booking",
          data: null as any,
        };
      }

      // Check if booking can be cancelled
      if (existing.status === "CANCELLED") {
        return {
          success: false,
          message: "Booking is already cancelled",
          data: null as any,
        };
      }

      if (existing.status === "COMPLETED") {
        return {
          success: false,
          message: "Cannot cancel completed booking",
          data: null as any,
        };
      }

      // Cancel booking
      const booking = await this.bookingRepo.cancel(id);

      return {
        success: true,
        message: "Booking cancelled successfully",
        data: this.formatBookingResponse(booking),
      };
    } catch (error) {
      console.error("Error cancelling booking:", error);
      return {
        success: false,
        message: "Failed to cancel booking",
        data: null as any,
      };
    }
  }

  // Helper: Calculate booking price
  private calculatePrice(
    passengers: number,
    bookingClass: string,
    toCountry: string,
    fromCountry: string
  ): number {
    const basePrice =
      PRICE_PER_PASSENGER[bookingClass as keyof typeof PRICE_PER_PASSENGER];

    // Determine if international
    const isInternational =
      toCountry !== "Indonesia" || fromCountry !== "Indonesia";
    const multiplier = isInternational
      ? DISTANCE_MULTIPLIER.INTERNATIONAL
      : DISTANCE_MULTIPLIER.DOMESTIC;

    return basePrice * passengers * multiplier;
  }

  // Helper: Format booking response
  private formatBookingResponse(booking: any): BookingResponse {
    return {
      id: booking.id,
      userId: booking.userId,
      destination: {
        id: booking.destination.id,
        name: booking.destination.name,
        city: booking.destination.city?.name || "",
        country: booking.destination.country?.name || "",
        code: booking.destination.airport?.iataCode || "",
        airport: booking.destination.airport?.name || "",
      },
      fromDestination: {
        id: booking.fromDestination.id,
        name: booking.fromDestination.name,
        city: booking.fromDestination.city?.name || "",
        country: booking.fromDestination.country?.name || "",
        code: booking.fromDestination.airport?.iataCode || "",
        airport: booking.fromDestination.airport?.name || "",
      },
      departureDate: booking.departureDate,
      returnDate: booking.returnDate,
      passengers: booking.passengerCount,
      bookingClass: booking.bookingClass,
      totalPrice: booking.totalPrice,
      status: booking.status,
      bookingReference: booking.bookingReference,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }
}
