import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🌍 Countries Seeding
 * Seeds comprehensive country data with currency, timezone, and continent information
 */
export async function seedCountries() {
  console.log("📍 Seeding countries...");

  const countries = await Promise.all([
    // Indonesia
    prisma.country.upsert({
      where: { code: "ID" },
      update: {},
      create: {
        name: "Indonesia",
        code: "ID",
        continent: "Asia",
        currency: "IDR",
        timezone: "Asia/Jakarta",
        isActive: true,
      },
    }),

    // Singapore
    prisma.country.upsert({
      where: { code: "SG" },
      update: {},
      create: {
        name: "Singapore",
        code: "SG",
        continent: "Asia",
        currency: "SGD",
        timezone: "Asia/Singapore",
        isActive: true,
      },
    }),

    // Malaysia
    prisma.country.upsert({
      where: { code: "MY" },
      update: {},
      create: {
        name: "Malaysia",
        code: "MY",
        continent: "Asia",
        currency: "MYR",
        timezone: "Asia/Kuala_Lumpur",
        isActive: true,
      },
    }),

    // Thailand
    prisma.country.upsert({
      where: { code: "TH" },
      update: {},
      create: {
        name: "Thailand",
        code: "TH",
        continent: "Asia",
        currency: "THB",
        timezone: "Asia/Bangkok",
        isActive: true,
      },
    }),

    // Vietnam
    prisma.country.upsert({
      where: { code: "VN" },
      update: {},
      create: {
        name: "Vietnam",
        code: "VN",
        continent: "Asia",
        currency: "VND",
        timezone: "Asia/Ho_Chi_Minh",
        isActive: true,
      },
    }),

    // Philippines
    prisma.country.upsert({
      where: { code: "PH" },
      update: {},
      create: {
        name: "Philippines",
        code: "PH",
        continent: "Asia",
        currency: "PHP",
        timezone: "Asia/Manila",
        isActive: true,
      },
    }),

    // Japan
    prisma.country.upsert({
      where: { code: "JP" },
      update: {},
      create: {
        name: "Japan",
        code: "JP",
        continent: "Asia",
        currency: "JPY",
        timezone: "Asia/Tokyo",
        isActive: true,
      },
    }),

    // Australia
    prisma.country.upsert({
      where: { code: "AU" },
      update: {},
      create: {
        name: "Australia",
        code: "AU",
        continent: "Oceania",
        currency: "AUD",
        timezone: "Australia/Sydney",
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Seeded ${countries.length} countries`);
  return countries;
}

/**
 * Standalone execution for testing
 */
if (require.main === module) {
  seedCountries()
    .then(() => {
      console.log("🌍 Countries seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Countries seeding failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
