const { PrismaClient } = require("@prisma/client");

async function checkValue() {
  const prisma = new PrismaClient();
  const result = await prisma.airline.findUnique({
    where: { id: "cmgstiw37000nhre4f2ig651s" },
    select: { name: true, code: true, icaoCode: true },
  });
  console.log("Current DB value:", result);
  await prisma.$disconnect();
}

checkValue();
