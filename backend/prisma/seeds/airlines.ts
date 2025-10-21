import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🛫 Airlines Seeding
 * Seeds major airlines with logos, IATA/ICAO codes, and country relationships
 */
export async function seedAirlines() {
  console.log("🛫 Seeding airlines...");

  // Get all countries that we'll reference
  const countries = await prisma.country.findMany({
    where: {
      code: { in: ["ID", "SG", "MY", "TH", "VN"] },
    },
  });

  const airlines = await Promise.all([
    // Indonesian Airlines
    prisma.airline.upsert({
      where: { code: "GA" },
      update: {},
      create: {
        name: "Garuda Indonesia",
        code: "GA",
        icaoCode: "GIA",
        countryId: countries.find((c) => c.code === "ID")!.id,
        logo: "https://logos-world.net/wp-content/uploads/2023/01/Garuda-Indonesia-Logo.png",
        description: "The national airline of Indonesia",
        website: "https://www.garuda-indonesia.com",
        isActive: true,
      },
    }),

    prisma.airline.upsert({
      where: { code: "JT" },
      update: {},
      create: {
        name: "Lion Air",
        code: "JT",
        icaoCode: "LNI",
        countryId: countries.find((c) => c.code === "ID")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lion_Air_logo.svg/1200px-Lion_Air_logo.svg.png",
        description: "Indonesian low-cost airline",
        website: "https://www.lionair.co.id",
        isActive: true,
      },
    }),

    prisma.airline.upsert({
      where: { code: "ID" },
      update: {},
      create: {
        name: "Batik Air",
        code: "ID",
        icaoCode: "BTK",
        countryId: countries.find((c) => c.code === "ID")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Batik_Air_logo.svg/1200px-Batik_Air_logo.svg.png",
        description: "Full-service airline subsidiary of Lion Air Group",
        website: "https://www.batikair.com",
        isActive: true,
      },
    }),

    prisma.airline.upsert({
      where: { code: "QZ" },
      update: {},
      create: {
        name: "Indonesia AirAsia",
        code: "QZ",
        icaoCode: "AWQ",
        countryId: countries.find((c) => c.code === "ID")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1200px-AirAsia_New_Logo.svg.png",
        description: "Low-cost airline based in Indonesia",
        website: "https://www.airasia.com",
        isActive: true,
      },
    }),

    // Singapore Airlines
    prisma.airline.upsert({
      where: { code: "SQ" },
      update: {},
      create: {
        name: "Singapore Airlines",
        code: "SQ",
        icaoCode: "SIA",
        countryId: countries.find((c) => c.code === "SG")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/1200px-Singapore_Airlines_Logo_2.svg.png",
        description: "Flag carrier airline of Singapore",
        website: "https://www.singaporeair.com",
        isActive: true,
      },
    }),

    // Malaysia Airlines
    prisma.airline.upsert({
      where: { code: "MH" },
      update: {},
      create: {
        name: "Malaysia Airlines",
        code: "MH",
        icaoCode: "MAS",
        countryId: countries.find((c) => c.code === "MY")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Malaysia_Airlines_logo.svg/1200px-Malaysia_Airlines_logo.svg.png",
        description: "Flag carrier airline of Malaysia",
        website: "https://www.malaysiaairlines.com",
        isActive: true,
      },
    }),

    // Thai Airways
    prisma.airline.upsert({
      where: { code: "TG" },
      update: {},
      create: {
        name: "Thai Airways",
        code: "TG",
        icaoCode: "THA",
        countryId: countries.find((c) => c.code === "TH")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/Thai_Airways_Logo.svg/1200px-Thai_Airways_Logo.svg.png",
        description: "Flag carrier airline of Thailand",
        website: "https://www.thaiairways.com",
        isActive: true,
      },
    }),

    // Vietnam Airlines
    prisma.airline.upsert({
      where: { code: "VN" },
      update: {},
      create: {
        name: "Vietnam Airlines",
        code: "VN",
        icaoCode: "HVN",
        countryId: countries.find((c) => c.code === "VN")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vietnam_Airlines_logo.svg/1200px-Vietnam_Airlines_logo.svg.png",
        description: "Flag carrier airline of Vietnam",
        website: "https://www.vietnamairlines.com",
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Seeded ${airlines.length} airlines`);
  return airlines;
}

/**
 * Standalone execution for testing
 */
if (require.main === module) {
  seedAirlines()
    .then(() => {
      console.log("🛫 Airlines seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Airlines seeding failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
