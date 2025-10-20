import { PrismaClient } from "@prisma/client";
import { seedCountries } from "./seeds/countries";
import { seedCities } from "./seeds/cities";
import { seedDestinations } from "./seeds/destinations";
import { seedAirlines } from "./seeds/airlines";
import { seedFlightSchedules } from "./seeds/flightSchedules";
import { seedPromotions } from "./seeds/promotions";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting comprehensive database seeding...");
  console.log("=" .repeat(60));

  try {
    // Phase 1: Basic geographic data
    console.log("📍 Phase 1: Seeding geographic data...");
    await seedCountries();
    await seedCities();

    // Phase 2: Aviation infrastructure 
    console.log("\n✈️ Phase 2: Seeding aviation infrastructure...");
    await seedDestinations(); // This includes airports from the previous implementation
    await seedAirlines();

    // Phase 3: Flight operations
    console.log("\n🛫 Phase 3: Seeding flight operations...");
    await seedFlightSchedules(); // This includes aircraft types, aircraft, flights, and schedules

    // Phase 4: Marketing and promotions
    console.log("\n🎉 Phase 4: Seeding promotions and marketing...");
    await seedPromotions();

    console.log("\n" + "=".repeat(60));
    console.log("� COMPLETE DATABASE SEEDING FINISHED SUCCESSFULLY! 🎊");
    console.log("=" .repeat(60));
    
    // Final summary
    console.log("\n📊 Final Database Summary:");
    const counts = await Promise.all([
      prisma.country.count(),
      prisma.city.count(),
      prisma.airport.count(),
      prisma.destination.count(),
      prisma.airline.count(),
      prisma.aircraftType.count(),
      prisma.aircraft.count(),
      prisma.flight.count(),
      prisma.flightSchedule.count(),
      prisma.promotion.count()
    ]);

    const [countries, cities, airports, destinations, airlines, aircraftTypes, aircraft, flights, flightSchedules, promotions] = counts;

    console.log(`   🌍 Countries: ${countries}`);
    console.log(`   🏙️  Cities: ${cities}`);
    console.log(`   🛬 Airports: ${airports}`);
    console.log(`   🏖️  Destinations: ${destinations}`);
    console.log(`   🛫 Airlines: ${airlines}`);
    console.log(`   ✈️  Aircraft Types: ${aircraftTypes}`);
    console.log(`   🛩️  Aircraft: ${aircraft}`);
    console.log(`   📅 Flights: ${flights}`);
    console.log(`   💺 Flight Schedules: ${flightSchedules}`);
    console.log(`   🎁 Promotions: ${promotions}`);
    
    console.log("\n🚀 Your Airbook database is now ready for action!");

  } catch (error) {
    console.error("\n❌ Error during seeding:", error);
    console.error("\n💡 Tip: Make sure PostgreSQL is running and accessible");
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
