import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAirports() {
  try {
    console.log("🔍 Checking airports in database...");

    const airportCount = await prisma.airport.count();
    console.log(`📊 Total airports: ${airportCount}`);

    if (airportCount > 0) {
      const sampleAirports = await prisma.airport.findMany({
        take: 5,
        include: {
          city: {
            select: {
              name: true,
            },
          },
          country: {
            select: {
              name: true,
            },
          },
        },
      });

      console.log("📋 Sample airports:");
      sampleAirports.forEach((airport, index) => {
        console.log(
          `${index + 1}. ${airport.name} (${airport.iataCode || "No IATA"}) - ${
            airport.city.name
          }, ${airport.country.name}`
        );
      });
    } else {
      console.log(
        "⚠️  No airports found in database. You may need to seed the database first."
      );
    }
  } catch (error) {
    console.error("❌ Error checking airports:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAirports();
