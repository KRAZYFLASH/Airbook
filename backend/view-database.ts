import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function viewDatabaseContents() {
  try {
    console.log("🔍 Melihat isi database AirBook...\n");

    // 1. Airlines
    console.log("✈️  AIRLINES:");
    console.log("=".repeat(50));
    const airlines = await prisma.airline.findMany({
      include: {
        country: {
          select: { name: true },
        },
      },
      orderBy: { name: "asc" },
    });
    console.table(
      airlines.map((airline) => ({
        ID: airline.id,
        Name: airline.name,
        Code: airline.code,
        ICAO: airline.icaoCode || "N/A",
        Country: airline.country.name,
        Active: airline.isActive,
        Created: airline.createdAt.toLocaleDateString(),
      }))
    );

    // 2. Destinations
    console.log("\n🌍 DESTINATIONS:");
    console.log("=".repeat(50));
    const destinations = await prisma.destination.findMany({
      include: {
        city: { select: { name: true } },
        country: { select: { name: true } },
        airport: { select: { name: true, iataCode: true } },
      },
      orderBy: { name: "asc" },
    });
    console.table(
      destinations.map((dest) => ({
        ID: dest.id,
        Name: dest.name,
        City: dest.city.name,
        Country: dest.country.name,
        Airport: dest.airport.name,
        "IATA Code": dest.airport.iataCode || "N/A",
        Category: dest.category,
        Rating: dest.rating || "N/A",
        Active: dest.isActive,
      }))
    );

    // 3. Flights
    console.log("\n🛫 FLIGHTS:");
    console.log("=".repeat(50));
    const flights = await prisma.flight.findMany({
      include: {
        airline: { select: { name: true, code: true } },
        departureAirport: { select: { name: true, iataCode: true } },
        arrivalAirport: { select: { name: true, iataCode: true } },
      },
      orderBy: { departureTime: "asc" },
      take: 10, // Ambil 10 data pertama
    });
    console.table(
      flights.map((flight) => ({
        "Flight No": flight.flightNumber,
        Airline: `${flight.airline.name} (${flight.airline.code})`,
        Route: `${
          flight.departureAirport.iataCode || flight.departureAirport.name
        } → ${flight.arrivalAirport.iataCode || flight.arrivalAirport.name}`,
        Departure: flight.departureTime.toLocaleString(),
        Arrival: flight.arrivalTime.toLocaleString(),
        Duration: `${Math.floor(flight.duration / 60)}h ${
          flight.duration % 60
        }m`,
        Status: flight.status,
      }))
    );

    // 4. Flight Schedules
    console.log("\n📋 FLIGHT SCHEDULES:");
    console.log("=".repeat(50));
    const schedules = await prisma.flightSchedule.findMany({
      include: {
        flight: {
          include: {
            airline: { select: { name: true } },
          },
        },
      },
      take: 10,
    });
    console.table(
      schedules.map((schedule) => ({
        ID: schedule.id,
        "Flight ID": schedule.flightId,
        Airline: schedule.flight.airline.name,
        Class: schedule.classType,
        "Available Seats": schedule.availableSeats,
        "Total Seats": schedule.totalSeats,
        "Base Price": `Rp ${schedule.basePrice.toLocaleString()}`,
        "Current Price": `Rp ${schedule.currentPrice.toLocaleString()}`,
        Active: schedule.isActive,
      }))
    );

    // 5. Promotions
    console.log("\n🎉 PROMOTIONS:");
    console.log("=".repeat(50));
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" },
    });
    console.table(
      promotions.map((promo) => ({
        Title: promo.title,
        Code: promo.code || "N/A",
        "Discount Type": promo.discountType,
        "Discount Value": promo.discountValue,
        "Start Date": promo.startDate.toLocaleDateString(),
        "End Date": promo.endDate.toLocaleDateString(),
        "Usage Limit": promo.usageLimit || "Unlimited",
        "Used Count": promo.usedCount,
        Active: promo.isActive,
      }))
    );

    // 6. Countries
    console.log("\n🌎 COUNTRIES:");
    console.log("=".repeat(50));
    const countries = await prisma.country.findMany({
      orderBy: { name: "asc" },
      take: 10,
    });
    console.table(
      countries.map((country) => ({
        Name: country.name,
        Code: country.code,
        Continent: country.continent,
        Currency: country.currency,
        Timezone: country.timezone,
        Active: country.isActive,
      }))
    );

    // 7. Summary
    console.log("\n📊 DATABASE SUMMARY:");
    console.log("=".repeat(50));
    const summary = {
      "Total Countries": await prisma.country.count(),
      "Active Countries": await prisma.country.count({
        where: { isActive: true },
      }),
      "Total Cities": await prisma.city.count(),
      "Active Cities": await prisma.city.count({ where: { isActive: true } }),
      "Total Airlines": await prisma.airline.count(),
      "Active Airlines": await prisma.airline.count({
        where: { isActive: true },
      }),
      "Total Airports": await prisma.airport.count(),
      "Active Airports": await prisma.airport.count({
        where: { isActive: true },
      }),
      "Total Destinations": await prisma.destination.count(),
      "Active Destinations": await prisma.destination.count({
        where: { isActive: true },
      }),
      "Total Flights": await prisma.flight.count(),
      "Active Flights": await prisma.flight.count({
        where: { isActive: true },
      }),
      "Total Flight Schedules": await prisma.flightSchedule.count(),
      "Active Flight Schedules": await prisma.flightSchedule.count({
        where: { isActive: true },
      }),
      "Total Promotions": await prisma.promotion.count(),
      "Active Promotions": await prisma.promotion.count({
        where: { isActive: true },
      }),
      "Total Bookings": await prisma.booking.count(),
      "Total Users": await prisma.user.count(),
      "Active Users": await prisma.user.count({ where: { isActive: true } }),
    };

    Object.entries(summary).forEach(([key, value]) => {
      console.log(`${key.padEnd(25)}: ${value}`);
    });
  } catch (error) {
    console.error("❌ Error saat membaca database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan fungsi
viewDatabaseContents();
