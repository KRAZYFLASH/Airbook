import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("🔍 Checking existing data...");

    const countries = await prisma.country.findMany();
    console.log(`📊 Countries in DB: ${countries.length}`);
    countries.forEach((c) => console.log(`   - ${c.name} (${c.code})`));

    const cities = await prisma.city.findMany();
    console.log(`🏙️ Cities in DB: ${cities.length}`);

    const airports = await prisma.airport.findMany();
    console.log(`✈️ Airports in DB: ${airports.length}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
