const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTestData() {
  try {
    // Find or create a country first
    let country = await prisma.country.findFirst({
      where: { code: "ID" },
    });

    if (!country) {
      country = await prisma.country.create({
        data: {
          name: "Indonesia",
          code: "ID",
          continent: "Asia",
          currency: "IDR",
          timezone: "Asia/Jakarta",
        },
      });
    }

    // Find or create cities
    let jakarta = await prisma.city.findFirst({
      where: { name: "Jakarta", countryId: country.id },
    });

    if (!jakarta) {
      jakarta = await prisma.city.create({
        data: {
          name: "Jakarta",
          countryId: country.id,
          state: "DKI Jakarta",
        },
      });
    }

    let bali = await prisma.city.findFirst({
      where: { name: "Denpasar", countryId: country.id },
    });

    if (!bali) {
      bali = await prisma.city.create({
        data: {
          name: "Denpasar",
          countryId: country.id,
          state: "Bali",
        },
      });
    }

    // Find or create airports
    let cgk = await prisma.airport.findFirst({
      where: { iataCode: "CGK" },
    });

    if (!cgk) {
      cgk = await prisma.airport.create({
        data: {
          name: "Soekarno-Hatta International Airport",
          iataCode: "CGK",
          icaoCode: "WIII",
          cityId: jakarta.id,
          countryId: country.id,
        },
      });
    }

    let dps = await prisma.airport.findFirst({
      where: { iataCode: "DPS" },
    });

    if (!dps) {
      dps = await prisma.airport.create({
        data: {
          name: "Ngurah Rai International Airport",
          iataCode: "DPS",
          icaoCode: "WADD",
          cityId: bali.id,
          countryId: country.id,
        },
      });
    }

    console.log("✅ Airports ready:", cgk.iataCode, dps.iataCode);

    // Find or create a test airline
    let airline = await prisma.airline.findFirst({
      where: { code: "TA" },
    });

    if (!airline) {
      airline = await prisma.airline.create({
        data: {
          name: "Test Airlines",
          code: "TA",
          icaoCode: "TST",
          country: {
            connect: { id: country.id },
          },
        },
      });
    }

    console.log("✅ Airline ready:", airline.name, airline.id);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
