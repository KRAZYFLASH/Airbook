import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedDestinations() {
  console.log("🏗️ Seeding destinations data...");

  try {
    // Get Indonesia country ID
    const indonesia = await prisma.country.findFirst({
      where: { code: "ID" },
    });

    if (!indonesia) {
      throw new Error("Indonesia not found in countries");
    }

    console.log(`📍 Found Indonesia ID: ${indonesia.id}`);

    // Get cities
    const cities = await prisma.city.findMany({
      where: { countryId: indonesia.id },
    });

    console.log(`🏙️ Found ${cities.length} cities`);

    // Create airports first
    const airports = [
      {
        id: "cgk-airport",
        name: "Soekarno-Hatta International Airport",
        iataCode: "CGK",
        icaoCode: "WIII",
        cityId: cities.find((c) => c.name === "Jakarta")?.id || cities[0].id,
        countryId: indonesia.id,
        municipality: "Tangerang",
        lat: -6.1275,
        lon: 106.6537,
        elevation: 34,
        timezone: "Asia/Jakarta",
        isActive: true,
      },
      {
        id: "dps-airport",
        name: "Ngurah Rai International Airport",
        iataCode: "DPS",
        icaoCode: "WADD",
        cityId:
          cities.find(
            (c) => c.name.includes("Denpasar") || c.name.includes("Bali")
          )?.id ||
          cities[1]?.id ||
          cities[0].id,
        countryId: indonesia.id,
        municipality: "Badung",
        lat: -8.7467,
        lon: 115.167,
        elevation: 4,
        timezone: "Asia/Makassar",
        isActive: true,
      },
      {
        id: "mlg-airport",
        name: "Juanda International Airport",
        iataCode: "MLG",
        icaoCode: "WARJ",
        cityId:
          cities.find((c) => c.name === "Surabaya")?.id ||
          cities[2]?.id ||
          cities[0].id,
        countryId: indonesia.id,
        municipality: "Sidoarjo",
        lat: -7.3797,
        lon: 112.7869,
        elevation: 3,
        timezone: "Asia/Jakarta",
        isActive: true,
      },
      {
        id: "jog-airport",
        name: "Adisutcipto International Airport",
        iataCode: "JOG",
        icaoCode: "WAHH",
        cityId:
          cities.find((c) => c.name === "Yogyakarta")?.id ||
          cities[3]?.id ||
          cities[0].id,
        countryId: indonesia.id,
        municipality: "Yogyakarta",
        lat: -7.7881,
        lon: 110.4314,
        elevation: 106,
        timezone: "Asia/Jakarta",
        isActive: true,
      },
    ];

    // Upsert airports
    for (const airportData of airports) {
      await prisma.airport.upsert({
        where: { iataCode: airportData.iataCode },
        update: airportData,
        create: airportData,
      });
    }
    console.log("✅ Airports seeded successfully");

    // Create airlines
    const airlines = [
      {
        id: "garuda-indonesia",
        name: "Garuda Indonesia",
        code: "GA",
        icaoCode: "GIA",
        countryId: indonesia.id,
        logo: "https://logos-world.net/wp-content/uploads/2023/01/Garuda-Indonesia-Logo.png",
        description: "National flag carrier airline of Indonesia",
        website: "https://www.garuda-indonesia.com",
        isActive: true,
      },
      {
        id: "lion-air",
        name: "Lion Air",
        code: "JT",
        icaoCode: "LNI",
        countryId: indonesia.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Lion_Air_logo.svg/1200px-Lion_Air_logo.svg.png",
        description: "Low-cost airline based in Jakarta, Indonesia",
        website: "https://www.lionair.co.id",
        isActive: true,
      },
      {
        id: "citilink",
        name: "Citilink",
        code: "QG",
        icaoCode: "CTV",
        countryId: indonesia.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Citilink_logo.svg/1200px-Citilink_logo.svg.png",
        description: "Low-cost subsidiary of Garuda Indonesia",
        website: "https://www.citilink.co.id",
        isActive: true,
      },
    ];

    // Upsert airlines
    for (const airlineData of airlines) {
      await prisma.airline.upsert({
        where: { code: airlineData.code },
        update: airlineData,
        create: airlineData,
      });
    }
    console.log("✅ Airlines seeded successfully");

    // Get created airports for destinations
    const createdAirports = await prisma.airport.findMany({
      where: { countryId: indonesia.id },
    });

    // Create destinations
    const destinations = [
      {
        id: "jakarta-dest",
        name: "Jakarta City Break",
        cityId: cities.find((c) => c.name === "Jakarta")?.id || cities[0].id,
        countryId: indonesia.id,
        airportId:
          createdAirports.find((a) => a.iataCode === "CGK")?.id ||
          createdAirports[0].id,
        description:
          "Explore Indonesia vibrant capital city with modern attractions",
        imageUrl:
          "https://images.unsplash.com/photo-1555333145-4acf190da336?w=800",
        category: "CITY",
        rating: 4.3,
        isActive: true,
        isFeatured: true,
      },
      {
        id: "bali-dest",
        name: "Bali Paradise",
        cityId:
          cities.find(
            (c) => c.name.includes("Denpasar") || c.name.includes("Bali")
          )?.id ||
          cities[1]?.id ||
          cities[0].id,
        countryId: indonesia.id,
        airportId:
          createdAirports.find((a) => a.iataCode === "DPS")?.id ||
          createdAirports[1]?.id ||
          createdAirports[0].id,
        description:
          "Experience the beautiful beaches, temples, and culture of Bali",
        imageUrl:
          "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
        category: "BEACH",
        rating: 4.8,
        isActive: true,
        isFeatured: true,
      },
      {
        id: "surabaya-dest",
        name: "Surabaya Adventure",
        cityId:
          cities.find((c) => c.name === "Surabaya")?.id ||
          cities[2]?.id ||
          cities[0].id,
        countryId: indonesia.id,
        airportId:
          createdAirports.find((a) => a.iataCode === "MLG")?.id ||
          createdAirports[2]?.id ||
          createdAirports[0].id,
        description:
          "East Java largest city with historical sites and culinary delights",
        imageUrl:
          "https://images.unsplash.com/photo-1590329291243-a47e2dead2d7?w=800",
        category: "CITY",
        rating: 4.2,
        isActive: true,
        isFeatured: false,
      },
      {
        id: "yogya-dest",
        name: "Yogyakarta Cultural Tour",
        cityId:
          cities.find((c) => c.name === "Yogyakarta")?.id ||
          cities[3]?.id ||
          cities[0].id,
        countryId: indonesia.id,
        airportId:
          createdAirports.find((a) => a.iataCode === "JOG")?.id ||
          createdAirports[3]?.id ||
          createdAirports[0].id,
        description:
          "Discover the cultural heart of Java with ancient temples and traditions",
        imageUrl:
          "https://images.unsplash.com/photo-1599833842960-0143f48e65f8?w=800",
        category: "CULTURAL",
        rating: 4.6,
        isActive: true,
        isFeatured: true,
      },
    ];

    // Upsert destinations
    for (const destData of destinations) {
      await prisma.destination.upsert({
        where: { id: destData.id },
        update: destData,
        create: destData,
      });
    }
    console.log("✅ Destinations seeded successfully");

    // Create promotions
    const createdDestinations = await prisma.destination.findMany({
      where: { countryId: indonesia.id },
    });

    const promotions = [
      {
        id: "bali-weekend-promo",
        title: "Bali Weekend Getaway",
        description:
          "Escape to Bali this weekend with up to 40% off flights and exclusive hotel deals",
        discountType: "PERCENTAGE",
        discountValue: 40,
        minPurchase: 500000,
        maxDiscount: 800000,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        code: "BALIWEEKEND40",
        isActive: true,
        destinationId: createdDestinations.find((d) => d.name.includes("Bali"))
          ?.id,
        usageLimit: 1000,
        usedCount: 0,
      },
      {
        id: "jakarta-business-promo",
        title: "Jakarta Business Special",
        description:
          "Business travelers save big on Jakarta flights with our corporate discount",
        discountType: "FIXED",
        discountValue: 300000,
        minPurchase: 1000000,
        maxDiscount: 300000,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        code: "BIZJAKARTA300",
        isActive: true,
        destinationId: createdDestinations.find((d) =>
          d.name.includes("Jakarta")
        )?.id,
        usageLimit: 500,
        usedCount: 0,
      },
    ];

    // Upsert promotions
    for (const promoData of promotions) {
      await prisma.promotion.upsert({
        where: { code: promoData.code },
        update: promoData,
        create: promoData,
      });
    }
    console.log("✅ Promotions seeded successfully");

    // Summary
    const summary = await Promise.all([
      prisma.country.count(),
      prisma.city.count(),
      prisma.airport.count(),
      prisma.airline.count(),
      prisma.destination.count(),
      prisma.promotion.count(),
    ]);

    console.log("📊 Seeding Summary:");
    console.log(`  - Countries: ${summary[0]}`);
    console.log(`  - Cities: ${summary[1]}`);
    console.log(`  - Airports: ${summary[2]}`);
    console.log(`  - Airlines: ${summary[3]}`);
    console.log(`  - Destinations: ${summary[4]}`);
    console.log(`  - Promotions: ${summary[5]}`);

    console.log("🏗️ Destinations seeding completed!");
  } catch (error) {
    console.error("❌ Error in destinations seeding:", error);
    throw error;
  }
}
