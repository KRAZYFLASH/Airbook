import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🗓️ Flight Schedules Seeding
 * Seeds realistic flight schedules with various airlines, routes, and statuses
 */
export async function seedFlightSchedules() {
  console.log("🗓️ Seeding flight schedules...");

  // Get all airlines that we'll reference
  const airlines = await prisma.airline.findMany({
    where: {
      code: { in: ["GA", "JT", "ID", "QZ", "SQ"] },
    },
  });

  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const flightSchedules = await Promise.all([
    // Garuda Indonesia flights
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-ga-410" },
      update: {},
      create: {
        id: "flight-ga-410",
        airlineId: airlines.find((a) => a.code === "GA")!.id,
        flightNo: "GA-410",
        origin: "CGK",
        destination: "DPS",
        departure: new Date("2025-10-22T07:00:00Z"),
        arrival: new Date("2025-10-22T10:00:00Z"),
        basePrice: 1200000,
        seats: 180,
        status: "SCHEDULED",
      },
    }),

    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-ga-411" },
      update: {},
      create: {
        id: "flight-ga-411",
        airlineId: airlines.find((a) => a.code === "GA")!.id,
        flightNo: "GA-411",
        origin: "DPS",
        destination: "CGK",
        departure: new Date("2025-10-22T14:30:00Z"),
        arrival: new Date("2025-10-22T17:30:00Z"),
        basePrice: 1200000,
        seats: 180,
        status: "SCHEDULED",
      },
    }),

    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-ga-830" },
      update: {},
      create: {
        id: "flight-ga-830",
        airlineId: airlines.find((a) => a.code === "GA")!.id,
        flightNo: "GA-830",
        origin: "CGK",
        destination: "SIN",
        departure: new Date("2025-10-22T09:15:00Z"),
        arrival: new Date("2025-10-22T11:45:00Z"),
        basePrice: 2500000,
        seats: 180,
        status: "SCHEDULED",
      },
    }),

    // Lion Air flights
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-jt-610" },
      update: {},
      create: {
        id: "flight-jt-610",
        airlineId: airlines.find((a) => a.code === "JT")!.id,
        flightNo: "JT-610",
        origin: "CGK",
        destination: "MLG",
        departure: new Date("2025-10-22T06:30:00Z"),
        arrival: new Date("2025-10-22T09:00:00Z"),
        basePrice: 800000,
        seats: 189,
        status: "DELAYED",
      },
    }),

    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-jt-270" },
      update: {},
      create: {
        id: "flight-jt-270",
        airlineId: airlines.find((a) => a.code === "JT")!.id,
        flightNo: "JT-270",
        origin: "CGK",
        destination: "KNO",
        departure: new Date("2025-10-22T08:45:00Z"),
        arrival: new Date("2025-10-22T11:15:00Z"),
        basePrice: 900000,
        seats: 189,
        status: "SCHEDULED",
      },
    }),

    // Batik Air flights
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-id-7700" },
      update: {},
      create: {
        id: "flight-id-7700",
        airlineId: airlines.find((a) => a.code === "ID")!.id,
        flightNo: "ID-7700",
        origin: "CGK",
        destination: "BKK",
        departure: new Date("2025-10-22T10:20:00Z"),
        arrival: new Date("2025-10-22T13:40:00Z"),
        basePrice: 1800000,
        seats: 162,
        status: "SCHEDULED",
      },
    }),

    // AirAsia flights
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-qz-8398" },
      update: {},
      create: {
        id: "flight-qz-8398",
        airlineId: airlines.find((a) => a.code === "QZ")!.id,
        flightNo: "QZ-8398",
        origin: "CGK",
        destination: "KUL",
        departure: new Date("2025-10-22T13:50:00Z"),
        arrival: new Date("2025-10-22T16:30:00Z"),
        basePrice: 750000,
        seats: 180,
        status: "SCHEDULED",
      },
    }),

    // Singapore Airlines
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-sq-950" },
      update: {},
      create: {
        id: "flight-sq-950",
        airlineId: airlines.find((a) => a.code === "SQ")!.id,
        flightNo: "SQ-950",
        origin: "SIN",
        destination: "CGK",
        departure: new Date("2025-10-22T19:25:00Z"),
        arrival: new Date("2025-10-22T21:45:00Z"),
        basePrice: 3200000,
        seats: 253,
        status: "SCHEDULED",
      },
    }),
  ]);

  console.log(`✅ Seeded ${flightSchedules.length} flight schedules`);
  return flightSchedules;
}

/**
 * Standalone execution for testing
 */
if (require.main === module) {
  seedFlightSchedules()
    .then(() => {
      console.log("🗓️ Flight schedules seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Flight schedules seeding failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
