import { prisma } from "../../../db/prisma";
import {
  Booking,
  CreateBookingInput,
  UpdateBookingInput,
  BookingQuery,
} from "./booking.schema";

export class BookingRepository {
  // Create new booking
  async create(
    data: CreateBookingInput & {
      userId: string;
      totalPrice: number;
      bookingReference: string;
    }
  ) {
    return await prisma.booking.create({
      data: {
        userId: data.userId,
        destinationId: data.destinationId,
        fromDestinationId: data.fromDestinationId,
        departureDate: new Date(data.departureDate),
        returnDate: data.returnDate ? new Date(data.returnDate) : null,
        passengerCount: data.passengers, // Use passengerCount instead of passengers
        bookingClass: data.bookingClass,
        totalPrice: data.totalPrice,
        finalPrice: data.totalPrice, // Set finalPrice same as totalPrice for now
        bookingReference: data.bookingReference,
      },
      include: {
        destination: true,
        fromDestination: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // Find booking by ID
  async findById(id: string) {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        destination: true,
        fromDestination: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // Find booking by reference
  async findByReference(bookingReference: string) {
    return await prisma.booking.findUnique({
      where: { bookingReference },
      include: {
        destination: true,
        fromDestination: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // Find bookings by user ID
  async findByUserId(userId: string, query: BookingQuery) {
    const where: any = { userId };

    // Add status filter
    if (query.status) {
      where.status = query.status;
    }

    // Add date range filter
    if (query.fromDate || query.toDate) {
      where.departureDate = {};
      if (query.fromDate) {
        where.departureDate.gte = new Date(query.fromDate);
      }
      if (query.toDate) {
        where.departureDate.lte = new Date(query.toDate);
      }
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          destination: true,
          fromDestination: true,
        },
        orderBy: { createdAt: "desc" },
        take: query.limit,
        skip: query.offset,
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      total,
      hasMore: query.offset + query.limit < total,
    };
  }

  // Find all bookings (admin)
  async findAll(query: BookingQuery) {
    const where: any = {};

    // Add status filter
    if (query.status) {
      where.status = query.status;
    }

    // Add date range filter
    if (query.fromDate || query.toDate) {
      where.departureDate = {};
      if (query.fromDate) {
        where.departureDate.gte = new Date(query.fromDate);
      }
      if (query.toDate) {
        where.departureDate.lte = new Date(query.toDate);
      }
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: {
          destination: true,
          fromDestination: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: query.limit,
        skip: query.offset,
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      total,
      hasMore: query.offset + query.limit < total,
    };
  }

  // Update booking
  async update(id: string, data: UpdateBookingInput) {
    const updateData: any = {};

    if (data.departureDate) {
      updateData.departureDate = new Date(data.departureDate);
    }
    if (data.returnDate) {
      updateData.returnDate = new Date(data.returnDate);
    }
    if (data.passengers) {
      updateData.passengers = data.passengers;
    }
    if (data.bookingClass) {
      updateData.bookingClass = data.bookingClass;
    }
    if (data.status) {
      updateData.status = data.status;
    }

    return await prisma.booking.update({
      where: { id },
      data: updateData,
      include: {
        destination: true,
        fromDestination: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // Cancel booking (soft delete by status)
  async cancel(id: string) {
    return await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: {
        destination: true,
        fromDestination: true,
      },
    });
  }

  // Delete booking (hard delete)
  async delete(id: string) {
    return await prisma.booking.delete({
      where: { id },
    });
  }

  // Check booking conflicts
  async checkConflicts(
    userId: string,
    departureDate: Date,
    destinationId: string
  ) {
    return await prisma.booking.findMany({
      where: {
        userId,
        destinationId,
        departureDate: {
          gte: new Date(departureDate.getTime() - 24 * 60 * 60 * 1000), // 1 day before
          lte: new Date(departureDate.getTime() + 24 * 60 * 60 * 1000), // 1 day after
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
    });
  }

  // Generate unique booking reference
  async generateBookingReference(): Promise<string> {
    let reference: string;
    let exists = true;

    while (exists) {
      // Generate format: AIR-YYYYMMDD-XXXX
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const random = Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, "0");
      reference = `AIR-${date}-${random}`;

      const existing = await prisma.booking.findUnique({
        where: { bookingReference: reference },
      });
      exists = !!existing;
    }

    return reference!;
  }
}
