import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedCities() {
  console.log("Seeding cities...");

  // Get countries first
  const indonesia = await prisma.country.findUnique({ where: { code: "ID" } });
  const malaysia = await prisma.country.findUnique({ where: { code: "MY" } });
  const singapore = await prisma.country.findUnique({ where: { code: "SG" } });
  const thailand = await prisma.country.findUnique({ where: { code: "TH" } });
  const uae = await prisma.country.findUnique({ where: { code: "AE" } });
  const turkey = await prisma.country.findUnique({ where: { code: "TR" } });
  const qatar = await prisma.country.findUnique({ where: { code: "QA" } });
  const japan = await prisma.country.findUnique({ where: { code: "JP" } });
  const australia = await prisma.country.findUnique({ where: { code: "AU" } });

  const cities = [
    // Indonesia
    {
      name: "Jakarta",
      countryId: indonesia!.id,
      state: "DKI Jakarta",
      population: 10770000,
      timezone: "Asia/Jakarta",
      lat: -6.2088,
      lon: 106.8456,
    },
    {
      name: "Surabaya",
      countryId: indonesia!.id,
      state: "East Java",
      population: 2874000,
      timezone: "Asia/Jakarta",
      lat: -7.2575,
      lon: 112.7521,
    },
    {
      name: "Medan",
      countryId: indonesia!.id,
      state: "North Sumatra",
      population: 2435000,
      timezone: "Asia/Jakarta",
      lat: 3.5952,
      lon: 98.6722,
    },
    {
      name: "Bandung",
      countryId: indonesia!.id,
      state: "West Java",
      population: 2504000,
      timezone: "Asia/Jakarta",
      lat: -6.9175,
      lon: 107.6191,
    },
    {
      name: "Yogyakarta",
      countryId: indonesia!.id,
      state: "Special Region of Yogyakarta",
      population: 422000,
      timezone: "Asia/Jakarta",
      lat: -7.7956,
      lon: 110.3695,
    },
    {
      name: "Bali (Denpasar)",
      countryId: indonesia!.id,
      state: "Bali",
      population: 897300,
      timezone: "Asia/Makassar",
      lat: -8.65,
      lon: 115.2167,
    },

    // Malaysia
    {
      name: "Kuala Lumpur",
      countryId: malaysia!.id,
      state: "Federal Territory",
      population: 1800000,
      timezone: "Asia/Kuala_Lumpur",
      lat: 3.139,
      lon: 101.6869,
    },
    {
      name: "Penang",
      countryId: malaysia!.id,
      state: "Penang",
      population: 708127,
      timezone: "Asia/Kuala_Lumpur",
      lat: 5.4164,
      lon: 100.3327,
    },
    {
      name: "Johor Bahru",
      countryId: malaysia!.id,
      state: "Johor",
      population: 497097,
      timezone: "Asia/Kuala_Lumpur",
      lat: 1.4927,
      lon: 103.7414,
    },

    // Singapore
    {
      name: "Singapore",
      countryId: singapore!.id,
      state: null,
      population: 5454000,
      timezone: "Asia/Singapore",
      lat: 1.3521,
      lon: 103.8198,
    },

    // Thailand
    {
      name: "Bangkok",
      countryId: thailand!.id,
      state: "Bangkok",
      population: 8281000,
      timezone: "Asia/Bangkok",
      lat: 13.7563,
      lon: 100.5018,
    },
    {
      name: "Phuket",
      countryId: thailand!.id,
      state: "Phuket",
      population: 416582,
      timezone: "Asia/Bangkok",
      lat: 7.8804,
      lon: 98.3923,
    },

    // UAE
    {
      name: "Dubai",
      countryId: uae!.id,
      state: "Dubai",
      population: 3331000,
      timezone: "Asia/Dubai",
      lat: 25.2048,
      lon: 55.2708,
    },
    {
      name: "Abu Dhabi",
      countryId: uae!.id,
      state: "Abu Dhabi",
      population: 1482000,
      timezone: "Asia/Dubai",
      lat: 24.4539,
      lon: 54.3773,
    },

    // Turkey
    {
      name: "Istanbul",
      countryId: turkey!.id,
      state: "Istanbul",
      population: 15460000,
      timezone: "Europe/Istanbul",
      lat: 41.0082,
      lon: 28.9784,
    },

    // Qatar
    {
      name: "Doha",
      countryId: qatar!.id,
      state: "Doha",
      population: 956460,
      timezone: "Asia/Qatar",
      lat: 25.2854,
      lon: 51.531,
    },

    // Japan
    {
      name: "Tokyo",
      countryId: japan!.id,
      state: "Tokyo",
      population: 13960000,
      timezone: "Asia/Tokyo",
      lat: 35.6762,
      lon: 139.6503,
    },

    // Australia
    {
      name: "Sydney",
      countryId: australia!.id,
      state: "New South Wales",
      population: 5312000,
      timezone: "Australia/Sydney",
      lat: -33.8688,
      lon: 151.2093,
    },
    {
      name: "Melbourne",
      countryId: australia!.id,
      state: "Victoria",
      population: 5078000,
      timezone: "Australia/Melbourne",
      lat: -37.8136,
      lon: 144.9631,
    },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: {
        id: `${city.name.toLowerCase().replace(/\s+/g, "-")}-${city.countryId}`,
      },
      update: city,
      create: {
        id: `${city.name.toLowerCase().replace(/\s+/g, "-")}-${city.countryId}`,
        ...city,
      },
    });
  }

  console.log(`✅ Seeded ${cities.length} cities`);
}
