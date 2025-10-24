import { PrismaClient } from "@prisma/client";
import {
  CreateFlightScheduleInput,
  UpdateFlightScheduleInput,
} from "./flight-schedule.schemas";

export class FlightScheduleRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Get all flight schedules with combined flight data
  async findAll() {
    const flightSchedules = await this.prisma.flightSchedule.findMany({
      include: {
        flight: {
          include: {
            airline: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            departureAirport: {
              select: {
                id: true,
                name: true,
                iataCode: true,
              },
            },
            arrivalAirport: {
              select: {
                id: true,
                name: true,
                iataCode: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform to admin format
    return flightSchedules.map((schedule) => ({
      id: schedule.id,
      airlineId: schedule.flight.airlineId,
      flightNo: schedule.flight.flightNumber,
      origin: schedule.flight.departureAirport.iataCode || "",
      destination: schedule.flight.arrivalAirport.iataCode || "",
      departure: schedule.flight.departureTime.toISOString(),
      arrival: schedule.flight.arrivalTime.toISOString(),
      classType: schedule.classType,
      availableSeats: schedule.availableSeats,
      totalSeats: schedule.totalSeats,
      basePrice: schedule.basePrice,
      currentPrice: schedule.currentPrice,
      status: schedule.flight.status,
      isActive: schedule.isActive,
      createdAt: schedule.createdAt.toISOString(),
      updatedAt: schedule.updatedAt.toISOString(),
    }));
  }

  async findById(id: string) {
    const schedule = await this.prisma.flightSchedule.findUnique({
      where: { id },
      include: {
        flight: {
          include: {
            airline: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            departureAirport: {
              select: {
                id: true,
                name: true,
                iataCode: true,
              },
            },
            arrivalAirport: {
              select: {
                id: true,
                name: true,
                iataCode: true,
              },
            },
          },
        },
      },
    });

    if (!schedule) {
      throw new Error("Flight schedule not found");
    }

    // Transform to admin format
    return {
      id: schedule.id,
      airlineId: schedule.flight.airlineId,
      flightNo: schedule.flight.flightNumber,
      origin: schedule.flight.departureAirport.iataCode || "",
      destination: schedule.flight.arrivalAirport.iataCode || "",
      departure: schedule.flight.departureTime.toISOString(),
      arrival: schedule.flight.arrivalTime.toISOString(),
      classType: schedule.classType,
      availableSeats: schedule.availableSeats,
      totalSeats: schedule.totalSeats,
      basePrice: schedule.basePrice,
      currentPrice: schedule.currentPrice,
      status: schedule.flight.status,
      isActive: schedule.isActive,
      createdAt: schedule.createdAt.toISOString(),
      updatedAt: schedule.updatedAt.toISOString(),
    };
  }

  async create(data: CreateFlightScheduleInput) {
    // First, find the airports by IATA code
    const departureAirport = await this.prisma.airport.findFirst({
      where: { iataCode: data.origin },
    });
    const arrivalAirport = await this.prisma.airport.findFirst({
      where: { iataCode: data.destination },
    });

    if (!departureAirport || !arrivalAirport) {
      throw new Error("Invalid airport codes");
    }

    // Create Flight and FlightSchedule in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Find or create a default aircraft for this airline
      let aircraft = await tx.aircraft.findFirst({
        where: { airlineId: data.airlineId },
      });

      if (!aircraft) {
        // Create a default aircraft type if not exists
        let aircraftType = await tx.aircraftType.findFirst({
          where: { model: "Boeing 737-800" },
        });

        if (!aircraftType) {
          aircraftType = await tx.aircraftType.create({
            data: {
              manufacturer: "Boeing",
              model: "Boeing 737-800",
              capacity: 180,
              range: 5765,
              cruiseSpeed: 842,
              fuelCapacity: 26020,
            },
          });
        }

        // Create a default aircraft for this airline
        aircraft = await tx.aircraft.create({
          data: {
            registration: `${data.airlineId.slice(-6).toUpperCase()}-001`,
            airlineId: data.airlineId,
            aircraftTypeId: aircraftType.id,
            name: "Default Aircraft",
          },
        });
      }

      // Create the flight first
      const flight = await tx.flight.create({
        data: {
          flightNumber: data.flightNo,
          airlineId: data.airlineId,
          aircraftId: aircraft.id, // Use the found or created aircraft
          departureAirportId: departureAirport.id,
          arrivalAirportId: arrivalAirport.id,
          departureTime: new Date(data.departure),
          arrivalTime: new Date(data.arrival),
          duration: Math.round(
            (new Date(data.arrival).getTime() -
              new Date(data.departure).getTime()) /
              60000
          ), // duration in minutes
          status: data.status,
        },
      });

      // Create the flight schedule
      const schedule = await tx.flightSchedule.create({
        data: {
          flightId: flight.id,
          classType: data.classType,
          availableSeats: data.availableSeats,
          totalSeats: data.totalSeats,
          basePrice: data.basePrice,
          currentPrice: data.currentPrice,
          isActive: data.isActive,
        },
      });

      return schedule;
    });

    return this.findById(result.id);
  }

  async update(id: string, data: UpdateFlightScheduleInput) {
    const existingSchedule = await this.prisma.flightSchedule.findUnique({
      where: { id },
      include: { flight: true },
    });

    if (!existingSchedule) {
      throw new Error("Flight schedule not found");
    }

    // Handle airport lookups if origin/destination changed
    let departureAirportId = existingSchedule.flight.departureAirportId;
    let arrivalAirportId = existingSchedule.flight.arrivalAirportId;

    if (data.origin) {
      const departureAirport = await this.prisma.airport.findFirst({
        where: { iataCode: data.origin },
      });
      if (!departureAirport) throw new Error("Invalid origin airport code");
      departureAirportId = departureAirport.id;
    }

    if (data.destination) {
      const arrivalAirport = await this.prisma.airport.findFirst({
        where: { iataCode: data.destination },
      });
      if (!arrivalAirport) throw new Error("Invalid destination airport code");
      arrivalAirportId = arrivalAirport.id;
    }

    // Update both Flight and FlightSchedule in a transaction
    await this.prisma.$transaction(async (tx) => {
      // Update flight data
      const flightUpdateData: any = {};
      if (data.flightNo) flightUpdateData.flightNumber = data.flightNo;
      if (data.airlineId) flightUpdateData.airlineId = data.airlineId;
      if (data.departure)
        flightUpdateData.departureTime = new Date(data.departure);
      if (data.arrival) flightUpdateData.arrivalTime = new Date(data.arrival);
      if (data.status) flightUpdateData.status = data.status;
      if (data.origin) flightUpdateData.departureAirportId = departureAirportId;
      if (data.destination)
        flightUpdateData.arrivalAirportId = arrivalAirportId;

      if (data.departure && data.arrival) {
        flightUpdateData.duration = Math.round(
          (new Date(data.arrival).getTime() -
            new Date(data.departure).getTime()) /
            60000
        );
      }

      if (Object.keys(flightUpdateData).length > 0) {
        await tx.flight.update({
          where: { id: existingSchedule.flightId },
          data: flightUpdateData,
        });
      }

      // Update flight schedule data
      const scheduleUpdateData: any = {};
      if (data.classType !== undefined)
        scheduleUpdateData.classType = data.classType;
      if (data.availableSeats !== undefined)
        scheduleUpdateData.availableSeats = data.availableSeats;
      if (data.totalSeats !== undefined)
        scheduleUpdateData.totalSeats = data.totalSeats;
      if (data.basePrice !== undefined)
        scheduleUpdateData.basePrice = data.basePrice;
      if (data.currentPrice !== undefined)
        scheduleUpdateData.currentPrice = data.currentPrice;
      if (data.isActive !== undefined)
        scheduleUpdateData.isActive = data.isActive;

      if (Object.keys(scheduleUpdateData).length > 0) {
        await tx.flightSchedule.update({
          where: { id },
          data: scheduleUpdateData,
        });
      }
    });

    return this.findById(id);
  }

  async delete(id: string) {
    const schedule = await this.prisma.flightSchedule.findUnique({
      where: { id },
      include: { flight: true },
    });

    if (!schedule) {
      throw new Error("Flight schedule not found");
    }

    // Delete both FlightSchedule and Flight in a transaction
    await this.prisma.$transaction(async (tx) => {
      await tx.flightSchedule.delete({ where: { id } });
      await tx.flight.delete({ where: { id: schedule.flightId } });
    });

    return { success: true, message: "Flight schedule deleted successfully" };
  }
}
