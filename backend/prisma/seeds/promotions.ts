import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🎯 Promotions Seeding
 * Seeds various promotional campaigns with different discount types and validity periods
 */
export async function seedPromotions() {
  console.log("🎯 Seeding promotions...");

  const promotions = await Promise.all([
    // Early Bird Promotion
    prisma.promotion.upsert({
      where: { code: "EARLY2025" },
      update: {},
      create: {
        title: "Early Bird 2025",
        description: "Book early and save up to 30% on domestic flights",
        code: "EARLY2025",
        discountType: "PERCENTAGE",
        discountValue: 30,
        minPurchase: 500000,
        maxDiscount: 200000,
        startDate: new Date("2025-01-01T00:00:00Z"),
        endDate: new Date("2025-03-31T23:59:59Z"),
        usageLimit: 1000,
        usedCount: 45,
        isActive: true,
      },
    }),

    // Weekend Promotion
    prisma.promotion.upsert({
      where: { code: "WEEKEND50" },
      update: {},
      create: {
        title: "Weekend Getaway",
        description: "Special weekend discount for leisure travelers",
        code: "WEEKEND50",
        discountType: "FIXED",
        discountValue: 150000,
        minPurchase: 800000,
        maxDiscount: 150000,
        startDate: new Date("2025-10-01T00:00:00Z"),
        endDate: new Date("2025-12-31T23:59:59Z"),
        usageLimit: 500,
        usedCount: 123,
        isActive: true,
      },
    }),

    // Student Discount
    prisma.promotion.upsert({
      where: { code: "STUDENT25" },
      update: {},
      create: {
        title: "Student Discount",
        description: "Special rate for students with valid student ID",
        code: "STUDENT25",
        discountType: "PERCENTAGE",
        discountValue: 25,
        minPurchase: 400000,
        maxDiscount: 300000,
        startDate: new Date("2025-09-01T00:00:00Z"),
        endDate: new Date("2025-12-31T23:59:59Z"),
        usageLimit: 200,
        usedCount: 67,
        isActive: true,
      },
    }),

    // Flash Sale
    prisma.promotion.upsert({
      where: { code: "FLASH24H" },
      update: {},
      create: {
        title: "Flash Sale 24 Hours",
        description: "Limited time flash sale - grab it while you can!",
        code: "FLASH24H",
        discountType: "PERCENTAGE",
        discountValue: 40,
        minPurchase: 600000,
        maxDiscount: 500000,
        startDate: new Date("2025-10-20T00:00:00Z"),
        endDate: new Date("2025-10-21T23:59:59Z"),
        usageLimit: 100,
        usedCount: 89,
        isActive: true,
      },
    }),

    // New Year Promotion
    prisma.promotion.upsert({
      where: { code: "NEWYEAR2025" },
      update: {},
      create: {
        title: "New Year Special",
        description: "Start 2025 with amazing travel deals",
        code: "NEWYEAR2025",
        discountType: "PERCENTAGE",
        discountValue: 35,
        minPurchase: 1000000,
        maxDiscount: 400000,
        startDate: new Date("2025-12-25T00:00:00Z"),
        endDate: new Date("2026-01-15T23:59:59Z"),
        usageLimit: 500,
        usedCount: 0,
        isActive: true,
      },
    }),

    // Family Package (Expired)
    prisma.promotion.upsert({
      where: { code: "FAMILY20" },
      update: {},
      create: {
        title: "Family Package",
        description: "Special discount for family bookings (3+ passengers)",
        code: "FAMILY20",
        discountType: "PERCENTAGE",
        discountValue: 20,
        minPurchase: 1500000,
        maxDiscount: 300000,
        startDate: new Date("2025-06-01T00:00:00Z"),
        endDate: new Date("2025-08-31T23:59:59Z"),
        usageLimit: 300,
        usedCount: 45,
        isActive: false, // Expired
      },
    }),
  ]);

  console.log(`✅ Seeded ${promotions.length} promotions`);
  return promotions;
}

/**
 * Standalone execution for testing
 */
if (require.main === module) {
  seedPromotions()
    .then(() => {
      console.log("🎯 Promotions seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Promotions seeding failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
