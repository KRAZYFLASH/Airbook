import { PrismaClient } from "@prisma/client";
import { seedCountries } from "./countries";
import { seedCities } from "./cities";
import { seedAirports } from "./airports";
import { seedAirlines } from "./airlines";
import { seedFlightSchedules } from "./flightSchedules";
import { seedPromotions } from "./promotions";

const prisma = new PrismaClient();

/**
 * 🌱 Master Seeding Script
 * Executes all individual seed files in the correct order to maintain referential integrity
 */
async function masterSeed() {
  console.log(
    "🌱 Starting comprehensive database seeding with modular approach..."
  );

  try {
    // 1. Countries (no dependencies)
    console.log("\n📍 Step 1: Seeding countries...");
    const countries = await seedCountries();

    // 2. Cities (depends on countries)
    console.log("\n🏙️ Step 2: Seeding cities...");
    const cities = await seedCities();

    // 3. Airports (depends on cities and countries)
    console.log("\n✈️ Step 3: Seeding airports...");
    const airports = await seedAirports();

    // 4. Airlines (depends on countries)
    console.log("\n🛫 Step 4: Seeding airlines...");
    const airlines = await seedAirlines();

    // 5. Flight Schedules (depends on airlines and airports)
    console.log("\n🗓️ Step 5: Seeding flight schedules...");
    const flightSchedules = await seedFlightSchedules();

    // 6. Promotions (independent)
    console.log("\n🎯 Step 6: Seeding promotions...");
    const promotions = await seedPromotions();

    console.log("\n✅ Master seeding completed successfully!");
    console.log(`
📊 Final Seeded Data Summary:
├─ 🌍 Countries: ${countries.length}
├─ 🏙️ Cities: ${cities.length}  
├─ ✈️ Airports: ${airports.length}
├─ 🛫 Airlines: ${airlines.length}
├─ 🗓️ Flight Schedules: ${flightSchedules.length}
└─ 🎯 Promotions: ${promotions.length}

🚀 Your AirBook admin system is now ready with comprehensive sample data!
    `);
  } catch (error) {
    console.error("❌ Master seeding failed:", error);
    throw error;
  }
}

/**
 * Standalone execution
 */
if (require.main === module) {
  masterSeed()
    .then(() => {
      console.log("🎉 Database seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Database seeding failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { masterSeed };
