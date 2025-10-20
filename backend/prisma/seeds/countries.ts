import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedCountries() {
  const countries = [
    {
      name: "Indonesia",
      code: "ID",
      continent: "Asia",
      currency: "IDR",
      timezone: "Asia/Jakarta",
    },
    {
      name: "Malaysia",
      code: "MY",
      continent: "Asia",
      currency: "MYR",
      timezone: "Asia/Kuala_Lumpur",
    },
    {
      name: "Singapore",
      code: "SG",
      continent: "Asia",
      currency: "SGD",
      timezone: "Asia/Singapore",
    },
    {
      name: "Thailand",
      code: "TH",
      continent: "Asia",
      currency: "THB",
      timezone: "Asia/Bangkok",
    },
    {
      name: "United Arab Emirates",
      code: "AE",
      continent: "Asia",
      currency: "AED",
      timezone: "Asia/Dubai",
    },
    {
      name: "Turkey",
      code: "TR",
      continent: "Europe",
      currency: "TRY",
      timezone: "Europe/Istanbul",
    },
    {
      name: "Qatar",
      code: "QA",
      continent: "Asia",
      currency: "QAR",
      timezone: "Asia/Qatar",
    },
    {
      name: "Japan",
      code: "JP",
      continent: "Asia",
      currency: "JPY",
      timezone: "Asia/Tokyo",
    },
    {
      name: "South Korea",
      code: "KR",
      continent: "Asia",
      currency: "KRW",
      timezone: "Asia/Seoul",
    },
    {
      name: "Australia",
      code: "AU",
      continent: "Oceania",
      currency: "AUD",
      timezone: "Australia/Sydney",
    },
  ];

  console.log("Seeding countries...");

  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: country,
      create: country,
    });
  }

  console.log(`✅ Seeded ${countries.length} countries`);
}
