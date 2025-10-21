import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🏙️ Cities Seeding
 * Seeds major cities across Asia-Pacific region with population and geographic data
 */
export async function seedCities() {
  console.log("🏙️ Seeding cities...");

  // Get all countries that we'll reference
  const countries = await prisma.country.findMany({
    where: {
      code: { in: ["ID", "SG", "MY", "TH", "VN", "PH", "JP", "AU"] },
    },
  });

  const cities = await Promise.all([
    // Indonesia
    prisma.city.upsert({
      where: { id: "city-jakarta" },
      update: {},
      create: {
        id: "city-jakarta",
        name: "Jakarta",
        countryId: countries.find((c) => c.code === "ID")!.id,
        state: "DKI Jakarta",
        population: 10770000,
        timezone: "Asia/Jakarta",
        lat: -6.2088,
        lon: 106.8456,
        isActive: true,
      },
    }),
    prisma.city.upsert({
      where: { id: "city-surabaya" },
      update: {},
      create: {
        id: "city-surabaya",
        name: "Surabaya",
        countryId: countries.find((c) => c.code === "ID")!.id,
        state: "East Java",
        population: 2874000,
        timezone: "Asia/Jakarta",
        lat: -7.2575,
        lon: 112.7521,
        isActive: true,
      },
    }),
    prisma.city.upsert({
      where: { id: "city-denpasar" },
      update: {},
      create: {
        id: "city-denpasar",
        name: "Denpasar",
        countryId: countries.find((c) => c.code === "ID")!.id,
        state: "Bali",
        population: 897300,
        timezone: "Asia/Makassar",
        lat: -8.6705,
        lon: 115.2126,
        isActive: true,
      },
    }),
    prisma.city.upsert({
      where: { id: "city-medan" },
      update: {},
      create: {
        id: "city-medan",
        name: "Medan",
        countryId: countries.find((c) => c.code === "ID")!.id,
        state: "North Sumatra",
        population: 2435000,
        timezone: "Asia/Jakarta",
        lat: 3.5952,
        lon: 98.6722,
        isActive: true,
      },
    }),

    // Singapore
    prisma.city.upsert({
      where: { id: "city-singapore" },
      update: {},
      create: {
        id: "city-singapore",
        name: "Singapore",
        countryId: countries.find((c) => c.code === "SG")!.id,
        population: 5685000,
        timezone: "Asia/Singapore",
        lat: 1.3521,
        lon: 103.8198,
        isActive: true,
      },
    }),

    // Malaysia
    prisma.city.upsert({
      where: { id: "city-kuala-lumpur" },
      update: {},
      create: {
        id: "city-kuala-lumpur",
        name: "Kuala Lumpur",
        countryId: countries.find((c) => c.code === "MY")!.id,
        state: "Federal Territory",
        population: 1768000,
        timezone: "Asia/Kuala_Lumpur",
        lat: 3.139,
        lon: 101.6869,
        isActive: true,
      },
    }),

    // Thailand
    prisma.city.upsert({
      where: { id: "city-bangkok" },
      update: {},
      create: {
        id: "city-bangkok",
        name: "Bangkok",
        countryId: countries.find((c) => c.code === "TH")!.id,
        population: 10539000,
        timezone: "Asia/Bangkok",
        lat: 13.7563,
        lon: 100.5018,
        isActive: true,
      },
    }),

    // Vietnam
    prisma.city.upsert({
      where: { id: "city-ho-chi-minh" },
      update: {},
      create: {
        id: "city-ho-chi-minh",
        name: "Ho Chi Minh City",
        countryId: countries.find((c) => c.code === "VN")!.id,
        population: 9321000,
        timezone: "Asia/Ho_Chi_Minh",
        lat: 10.8231,
        lon: 106.6297,
        isActive: true,
      },
    }),

    // Philippines
    prisma.city.upsert({
      where: { id: "city-manila" },
      update: {},
      create: {
        id: "city-manila",
        name: "Manila",
        countryId: countries.find((c) => c.code === "PH")!.id,
        population: 13482000,
        timezone: "Asia/Manila",
        lat: 14.5995,
        lon: 120.9842,
        isActive: true,
      },
    }),

    // Japan
    prisma.city.upsert({
      where: { id: "city-tokyo" },
      update: {},
      create: {
        id: "city-tokyo",
        name: "Tokyo",
        countryId: countries.find((c) => c.code === "JP")!.id,
        population: 37435000,
        timezone: "Asia/Tokyo",
        lat: 35.6762,
        lon: 139.6503,
        isActive: true,
      },
    }),

    // Australia
    prisma.city.upsert({
      where: { id: "city-sydney" },
      update: {},
      create: {
        id: "city-sydney",
        name: "Sydney",
        countryId: countries.find((c) => c.code === "AU")!.id,
        state: "New South Wales",
        population: 5312000,
        timezone: "Australia/Sydney",
        lat: -33.8688,
        lon: 151.2093,
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Seeded ${cities.length} cities`);
  return cities;
}

/**
 * Standalone execution for testing
 */
if (require.main === module) {
  seedCities()
    .then(() => {
      console.log("🏙️ Cities seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Cities seeding failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
