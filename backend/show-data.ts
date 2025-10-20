import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function showDatabaseData() {
  try {
    console.log("🔍 Database Contents:");
    console.log("=".repeat(50));

    // Check countries
    const countries = await prisma.country.findMany({
      select: { id: true, name: true, code: true },
    });
    console.log(`\n🌍 Countries (${countries.length}):`);
    countries
      .slice(0, 5)
      .forEach((c) => console.log(`  - ${c.name} (${c.code})`));

    // Check cities
    const cities = await prisma.city.findMany({
      include: { country: true },
      take: 5,
    });
    console.log(`\n🏙️ Cities (showing 5):`);
    cities.forEach((c) => console.log(`  - ${c.name}, ${c.country.name}`));

    // Check airports
    const airports = await prisma.airport.findMany({
      include: {
        city: true,
        country: true,
      },
    });
    console.log(`\n🛫 Airports (${airports.length}):`);
    airports.forEach((a) =>
      console.log(
        `  - ${a.name} (${a.iataCode}) - ${a.city.name}, ${a.country.name}`
      )
    );

    // Check airlines
    const airlines = await prisma.airline.findMany({
      include: { country: true },
    });
    console.log(`\n✈️ Airlines (${airlines.length}):`);
    airlines.forEach((a) =>
      console.log(`  - ${a.name} (${a.code}) - ${a.country.name}`)
    );

    // Check destinations
    const destinations = await prisma.destination.findMany({
      include: {
        city: true,
        country: true,
        airport: true,
      },
    });
    console.log(`\n🏖️ Destinations (${destinations.length}):`);
    destinations.forEach((d) =>
      console.log(
        `  - ${d.name} (${d.category}) - ${d.city.name}, ${d.country.name}`
      )
    );

    // Check promotions
    const promotions = await prisma.promotion.findMany({
      include: {
        destination: {
          include: { city: true },
        },
      },
    });
    console.log(`\n🎁 Promotions (${promotions.length}):`);
    promotions.forEach((p) =>
      console.log(
        `  - ${p.title} (${p.discountValue}${
          p.discountType === "PERCENTAGE" ? "%" : ""
        } off) - ${p.destination?.name || "No destination"}`
      )
    );

    console.log("\n" + "=".repeat(50));
    console.log("✅ Database overview complete!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

showDatabaseData();
