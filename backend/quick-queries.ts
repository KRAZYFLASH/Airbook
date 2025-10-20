import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function quickQueries() {
  try {
    console.log("🔍 Quick Database Queries\n");

    // Query custom dengan SQL raw
    console.log("📊 Airlines Count by Country:");
    const airlinesByCountry = await prisma.$queryRaw`
      SELECT 
        c.name as country,
        COUNT(a.id) as airline_count
      FROM airlines a
      JOIN countries c ON a."countryId" = c.id
      GROUP BY c.name
      ORDER BY airline_count DESC;
    `;
    console.table(airlinesByCountry);

    console.log("\n💰 Most Expensive Flights:");
    const expensiveFlights = await prisma.$queryRaw`
      SELECT 
        f."flightNumber",
        al.name as airline,
        fs."currentPrice",
        fs."classType"
      FROM flight_schedules fs
      JOIN flights f ON fs."flightId" = f.id
      JOIN airlines al ON f."airlineId" = al.id
      ORDER BY fs."currentPrice" DESC
      LIMIT 5;
    `;
    console.table(expensiveFlights);

    console.log("\n🎯 Active Promotions Summary:");
    const activePromos = await prisma.$queryRaw`
      SELECT 
        title,
        code,
        "discountType",
        "discountValue",
        "startDate",
        "endDate",
        "usageLimit",
        "usedCount"
      FROM promotions 
      WHERE "isActive" = true
      AND "startDate" <= CURRENT_DATE
      AND "endDate" >= CURRENT_DATE
      ORDER BY "discountValue" DESC;
    `;
    console.table(activePromos);

    console.log("\n✈️ Flight Routes Summary:");
    const routes = await prisma.$queryRaw`
      SELECT 
        dep_airport.name as departure,
        arr_airport.name as arrival,
        COUNT(f.id) as flight_count
      FROM flights f
      JOIN airports dep_airport ON f."departureAirportId" = dep_airport.id
      JOIN airports arr_airport ON f."arrivalAirportId" = arr_airport.id
      GROUP BY dep_airport.name, arr_airport.name
      ORDER BY flight_count DESC;
    `;
    console.table(routes);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

quickQueries();
