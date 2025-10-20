import { PrismaClient } from "@prisma/client";

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    console.log("Testing database connection...");
    const count = await prisma.airline.count();
    console.log("✅ Database connection successful");
    console.log(`Found ${count} airlines in database`);

    // Test a simple query
    const airlines = await prisma.airline.findMany({
      take: 2,
      select: { id: true, name: true, code: true },
    });
    console.log("Sample airlines:", airlines);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
