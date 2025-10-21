import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * ✈️ Airports Seeding
 * Seeds major international airports with IATA/ICAO codes and geographic data
 */
export async function seedAirports() {
  console.log("✈️ Seeding airports...");

  // Get all countries and cities that we'll reference
  const countries = await prisma.country.findMany({
    where: {
      code: { in: ["ID", "SG", "MY", "TH", "VN", "PH", "JP", "AU"] },
    },
  });

  const cities = await prisma.city.findMany({
    where: {
      name: {
        in: [
          "Jakarta",
          "Surabaya",
          "Denpasar",
          "Medan",
          "Singapore",
          "Kuala Lumpur",
          "Bangkok",
          "Ho Chi Minh City",
          "Manila",
          "Tokyo",
          "Sydney",
        ],
      },
    },
  });

  const airports = await Promise.all([
    // Indonesia
    prisma.airport.upsert({
      where: { iataCode: "CGK" },
      update: {},
      create: {
        name: "Soekarno-Hatta International Airport",
        iataCode: "CGK",
        icaoCode: "WIII",
        cityId: cities.find((c) => c.name === "Jakarta")!.id,
        countryId: countries.find((c) => c.code === "ID")!.id,
        municipality: "Tangerang",
        lat: -6.1256,
        lon: 106.6558,
        elevation: 34,
        timezone: "Asia/Jakarta",
        isActive: true,
      },
    }),

    prisma.airport.upsert({
      where: { iataCode: "MLG" },
      update: {},
      create: {
        name: "Abdul Rachman Saleh Airport",
        iataCode: "MLG",
        icaoCode: "WARA",
        cityId: cities.find((c) => c.name === "Surabaya")!.id,
        countryId: countries.find((c) => c.code === "ID")!.id,
        municipality: "Malang",
        lat: -7.9266,
        lon: 112.7148,
        elevation: 526,
        timezone: "Asia/Jakarta",
        isActive: true,
      },
    }),

    prisma.airport.upsert({
      where: { iataCode: "DPS" },
      update: {},
      create: {
        name: "Ngurah Rai International Airport",
        iataCode: "DPS",
        icaoCode: "WADD",
        cityId: cities.find((c) => c.name === "Denpasar")!.id,
        countryId: countries.find((c) => c.code === "ID")!.id,
        municipality: "Denpasar",
        lat: -8.7482,
        lon: 115.1679,
        elevation: 14,
        timezone: "Asia/Makassar",
        isActive: true,
      },
    }),

    prisma.airport.upsert({
      where: { iataCode: "KNO" },
      update: {},
      create: {
        name: "Kualanamu International Airport",
        iataCode: "KNO",
        icaoCode: "WIMM",
        cityId: cities.find((c) => c.name === "Medan")!.id,
        countryId: countries.find((c) => c.code === "ID")!.id,
        municipality: "Deli Serdang",
        lat: 3.6422,
        lon: 98.8853,
        elevation: 23,
        timezone: "Asia/Jakarta",
        isActive: true,
      },
    }),

    // Singapore
    prisma.airport.upsert({
      where: { iataCode: "SIN" },
      update: {},
      create: {
        name: "Singapore Changi Airport",
        iataCode: "SIN",
        icaoCode: "WSSS",
        cityId: cities.find((c) => c.name === "Singapore")!.id,
        countryId: countries.find((c) => c.code === "SG")!.id,
        municipality: "Singapore",
        lat: 1.3644,
        lon: 103.9915,
        elevation: 22,
        timezone: "Asia/Singapore",
        isActive: true,
      },
    }),

    // Malaysia
    prisma.airport.upsert({
      where: { iataCode: "KUL" },
      update: {},
      create: {
        name: "Kuala Lumpur International Airport",
        iataCode: "KUL",
        icaoCode: "WMKK",
        cityId: cities.find((c) => c.name === "Kuala Lumpur")!.id,
        countryId: countries.find((c) => c.code === "MY")!.id,
        municipality: "Sepang",
        lat: 2.7456,
        lon: 101.7072,
        elevation: 69,
        timezone: "Asia/Kuala_Lumpur",
        isActive: true,
      },
    }),

    // Thailand
    prisma.airport.upsert({
      where: { iataCode: "BKK" },
      update: {},
      create: {
        name: "Suvarnabhumi Airport",
        iataCode: "BKK",
        icaoCode: "VTBS",
        cityId: cities.find((c) => c.name === "Bangkok")!.id,
        countryId: countries.find((c) => c.code === "TH")!.id,
        municipality: "Bang Phli",
        lat: 13.69,
        lon: 100.7501,
        elevation: 2,
        timezone: "Asia/Bangkok",
        isActive: true,
      },
    }),

    // Vietnam
    prisma.airport.upsert({
      where: { iataCode: "SGN" },
      update: {},
      create: {
        name: "Tan Son Nhat International Airport",
        iataCode: "SGN",
        icaoCode: "VVTS",
        cityId: cities.find((c) => c.name === "Ho Chi Minh City")!.id,
        countryId: countries.find((c) => c.code === "VN")!.id,
        municipality: "Ho Chi Minh City",
        lat: 10.8189,
        lon: 106.6519,
        elevation: 33,
        timezone: "Asia/Ho_Chi_Minh",
        isActive: true,
      },
    }),

    // Philippines
    prisma.airport.upsert({
      where: { iataCode: "MNL" },
      update: {},
      create: {
        name: "Ninoy Aquino International Airport",
        iataCode: "MNL",
        icaoCode: "RPLL",
        cityId: cities.find((c) => c.name === "Manila")!.id,
        countryId: countries.find((c) => c.code === "PH")!.id,
        municipality: "Pasay",
        lat: 14.5086,
        lon: 121.0194,
        elevation: 23,
        timezone: "Asia/Manila",
        isActive: true,
      },
    }),

    // Japan
    prisma.airport.upsert({
      where: { iataCode: "NRT" },
      update: {},
      create: {
        name: "Narita International Airport",
        iataCode: "NRT",
        icaoCode: "RJAA",
        cityId: cities.find((c) => c.name === "Tokyo")!.id,
        countryId: countries.find((c) => c.code === "JP")!.id,
        municipality: "Narita",
        lat: 35.772,
        lon: 140.3929,
        elevation: 43,
        timezone: "Asia/Tokyo",
        isActive: true,
      },
    }),

    // Australia
    prisma.airport.upsert({
      where: { iataCode: "SYD" },
      update: {},
      create: {
        name: "Sydney Kingsford Smith Airport",
        iataCode: "SYD",
        icaoCode: "YSSY",
        cityId: cities.find((c) => c.name === "Sydney")!.id,
        countryId: countries.find((c) => c.code === "AU")!.id,
        municipality: "Sydney",
        lat: -33.9399,
        lon: 151.1753,
        elevation: 21,
        timezone: "Australia/Sydney",
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Seeded ${airports.length} airports`);
  return airports;
}

/**
 * Standalone execution for testing
 */
if (require.main === module) {
  seedAirports()
    .then(() => {
      console.log("✈️ Airports seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Airports seeding failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
