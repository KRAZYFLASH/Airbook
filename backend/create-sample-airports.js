// Script untuk menambahkan sample airports ke database
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createSampleAirports() {
  try {
    console.log("🚀 Creating sample airports...");

    // Airport CGK - Soekarno-Hatta
    const cgk = await prisma.airport.create({
      data: {
        name: "Soekarno-Hatta International Airport",
        iataCode: "CGK",
        icaoCode: "WIII",
        cityId: "jakarta-cmgsa7nvl0000hr4k0vgccwlu",
        countryId: "cmgsa7nvl0000hr4k0vgccwlu",
        municipality: "Jakarta",
        lat: -6.1256,
        lon: 106.6551,
        elevation: 8,
        timezone: "Asia/Jakarta",
        isActive: true,
      },
    });
    console.log("✅ Created CGK:", cgk.name);

    // Airport DPS - Ngurah Rai
    const dps = await prisma.airport.create({
      data: {
        name: "Ngurah Rai International Airport",
        iataCode: "DPS",
        icaoCode: "WADD",
        cityId: "bali-(denpasar)-cmgsa7nvl0000hr4k0vgccwlu",
        countryId: "cmgsa7nvl0000hr4k0vgccwlu",
        municipality: "Denpasar",
        lat: -8.7467,
        lon: 115.1669,
        elevation: 4,
        timezone: "Asia/Makassar",
        isActive: true,
      },
    });
    console.log("✅ Created DPS:", dps.name);

    // Airport MLG - Abdul Rachman Saleh
    const mlg = await prisma.airport.create({
      data: {
        name: "Abdul Rachman Saleh Airport",
        iataCode: "MLG",
        icaoCode: "WARA",
        cityId: "jakarta-cmgsa7nvl0000hr4k0vgccwlu", // Use Jakarta for now
        countryId: "cmgsa7nvl0000hr4k0vgccwlu",
        municipality: "Malang",
        lat: -7.9266,
        lon: 112.7147,
        elevation: 526,
        timezone: "Asia/Jakarta",
        isActive: true,
      },
    });
    console.log("✅ Created MLG:", mlg.name);

    console.log("🎉 Sample airports created successfully!");
  } catch (error) {
    if (error.code === "P2002") {
      console.log("⚠️ Some airports already exist (duplicate IATA/ICAO codes)");
    } else {
      console.error("❌ Error creating airports:", error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createSampleAirports();
