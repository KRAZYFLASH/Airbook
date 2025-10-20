const { PrismaClient } = require("@prisma/client");

async function testUpdate() {
  const prisma = new PrismaClient();

  try {
    // Check current value
    const before = await prisma.airline.findUnique({
      where: { id: "cmgstiw37000nhre4f2ig651s" },
      select: { name: true, code: true, icaoCode: true },
    });
    console.log("Before update:", before);

    // Try update
    const result = await prisma.airline.update({
      where: { id: "cmgstiw37000nhre4f2ig651s" },
      data: { icaoCode: "TEST" },
    });
    console.log("Update result:", {
      name: result.name,
      code: result.code,
      icaoCode: result.icaoCode,
    });

    // Check after
    const after = await prisma.airline.findUnique({
      where: { id: "cmgstiw37000nhre4f2ig651s" },
      select: { name: true, code: true, icaoCode: true },
    });
    console.log("After update:", after);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testUpdate();
