// Test Prisma Client dengan model Booking
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testBookingModel() {
  try {
    console.log("🧪 Testing Booking Model...\n");

    // Test count bookings
    const bookingCount = await prisma.booking.count();
    console.log(`📊 Total bookings: ${bookingCount}`);

    // Test count users
    const userCount = await prisma.user.count();
    console.log(`👥 Total users: ${userCount}`);

    // Test count destinations
    const destinationCount = await prisma.destination.count();
    console.log(`🎯 Total destinations: ${destinationCount}`);

    console.log("\n✅ Prisma Client berhasil mengakses model Booking!");
    console.log("🎉 Database schema sudah sinkron!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testBookingModel();
