const { PrismaClient } = require("@prisma/client");

async function testSingaporeAirlines() {
  const prisma = new PrismaClient();

  try {
    // Check current value
    const current = await prisma.airline.findUnique({
      where: { id: "cmgstiw4f000vhre407aaydq3" },
      select: { name: true, code: true, icaoCode: true },
    });
    console.log("Current Singapore Airlines:", current);

    // Test update ICAO to different value
    const updated = await prisma.airline.update({
      where: { id: "cmgstiw4f000vhre407aaydq3" },
      data: { icaoCode: "SIA" },
    });
    console.log("After update to SIA:", {
      name: updated.name,
      code: updated.code,
      icaoCode: updated.icaoCode,
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testSingaporeAirlines();
