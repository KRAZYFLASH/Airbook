const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function setupTestData() {
  console.log("🚀 Setting up test data for flight schedules...");

  try {
    // Step 1: Create or get Indonesia country
    let indonesia = await prisma.country.findFirst({
      where: { code: "ID" },
    });

    if (!indonesia) {
      indonesia = await prisma.country.create({
        data: {
          name: "Indonesia",
          code: "ID",
          continent: "Asia",
          currency: "IDR",
          timezone: "Asia/Jakarta",
        },
      });
      console.log("✅ Created Indonesia country");
    } else {
      console.log("✅ Indonesia country already exists");
    }

    // Step 2: Create cities
    let jakarta = await prisma.city.findFirst({
      where: { name: "Jakarta", countryId: indonesia.id },
    });

    if (!jakarta) {
      jakarta = await prisma.city.create({
        data: {
          name: "Jakarta",
          countryId: indonesia.id,
          state: "DKI Jakarta",
          population: 10374235,
          timezone: "Asia/Jakarta",
          lat: -6.2088,
          lon: 106.8456,
        },
      });
      console.log("✅ Created Jakarta city");
    } else {
      console.log("✅ Jakarta city already exists");
    }

    let bali = await prisma.city.findFirst({
      where: { name: "Denpasar", countryId: indonesia.id },
    });

    if (!bali) {
      bali = await prisma.city.create({
        data: {
          name: "Denpasar",
          countryId: indonesia.id,
          state: "Bali",
          population: 897300,
          timezone: "Asia/Makassar",
          lat: -8.6705,
          lon: 115.2126,
        },
      });
      console.log("✅ Created Denpasar city");
    } else {
      console.log("✅ Denpasar city already exists");
    }

    // Step 3: Create airports
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
          countryId: indonesia.id,
          municipality: "Tangerang",
          lat: -6.1275,
          lon: 106.6537,
          elevation: 34,
          timezone: "Asia/Jakarta",
        },
      });
      console.log("✅ Created CGK airport");
    } else {
      console.log("✅ CGK airport already exists");
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
          countryId: indonesia.id,
          municipality: "Denpasar",
          lat: -8.7467,
          lon: 115.1667,
          elevation: 4,
          timezone: "Asia/Makassar",
        },
      });
      console.log("✅ Created DPS airport");
    } else {
      console.log("✅ DPS airport already exists");
    }

    // Step 4: Create airline
    let garuda = await prisma.airline.findFirst({
      where: { code: "GA" },
    });

    if (!garuda) {
      garuda = await prisma.airline.create({
        data: {
          name: "Garuda Indonesia",
          code: "GA",
          icaoCode: "GIA",
          countryId: indonesia.id,
          description: "National flag carrier of Indonesia",
          website: "https://www.garuda-indonesia.com",
        },
      });
      console.log("✅ Created Garuda Indonesia airline");
    } else {
      console.log("✅ Garuda Indonesia airline already exists");
    }

    // Step 5: Create aircraft type
    let aircraftType = await prisma.aircraftType.findFirst({
      where: {
        manufacturer: "Boeing",
        model: "Boeing 737-800",
      },
    });

    if (!aircraftType) {
      aircraftType = await prisma.aircraftType.create({
        data: {
          manufacturer: "Boeing",
          model: "Boeing 737-800",
          capacity: 180,
          range: 5765,
          cruiseSpeed: 842,
          fuelCapacity: 26020,
        },
      });
      console.log("✅ Created Boeing 737-800 aircraft type");
    } else {
      console.log("✅ Boeing 737-800 aircraft type already exists");
    }

    // Step 6: Create aircraft
    let aircraft = await prisma.aircraft.findFirst({
      where: {
        registration: "PK-GMA",
        airlineId: garuda.id,
      },
    });

    if (!aircraft) {
      aircraft = await prisma.aircraft.create({
        data: {
          registration: "PK-GMA",
          airlineId: garuda.id,
          aircraftTypeId: aircraftType.id,
          name: "Garuda Boeing 737-800",
        },
      });
      console.log("✅ Created aircraft PK-GMA");
    } else {
      console.log("✅ Aircraft PK-GMA already exists");
    }

    // Step 7: Create test flight schedule
    const existingFlight = await prisma.flight.findFirst({
      where: { flightNumber: "GA123" },
    });

    if (!existingFlight) {
      const flight = await prisma.flight.create({
        data: {
          flightNumber: "GA123",
          airlineId: garuda.id,
          aircraftId: aircraft.id,
          departureAirportId: cgk.id,
          arrivalAirportId: dps.id,
          departureTime: new Date("2025-10-20T08:00:00Z"),
          arrivalTime: new Date("2025-10-20T10:30:00Z"),
          duration: 150, // 2.5 hours
          status: "SCHEDULED",
        },
      });

      const schedule = await prisma.flightSchedule.create({
        data: {
          flightId: flight.id,
          classType: "ECONOMY",
          availableSeats: 180,
          totalSeats: 180,
          basePrice: 750000,
          currentPrice: 750000,
          isActive: true,
        },
      });

      console.log("✅ Created test flight schedule GA123 (CGK-DPS)");
    } else {
      console.log("✅ Test flight schedule already exists");
    }

    console.log("\n🎉 Test data setup completed successfully!");

    // Display summary
    const counts = await Promise.all([
      prisma.country.count(),
      prisma.city.count(),
      prisma.airport.count(),
      prisma.airline.count(),
      prisma.aircraftType.count(),
      prisma.aircraft.count(),
      prisma.flight.count(),
      prisma.flightSchedule.count(),
    ]);

    console.log("\n📊 Database Summary:");
    console.log(`Countries: ${counts[0]}`);
    console.log(`Cities: ${counts[1]}`);
    console.log(`Airports: ${counts[2]}`);
    console.log(`Airlines: ${counts[3]}`);
    console.log(`Aircraft Types: ${counts[4]}`);
    console.log(`Aircraft: ${counts[5]}`);
    console.log(`Flights: ${counts[6]}`);
    console.log(`Flight Schedules: ${counts[7]}`);
  } catch (error) {
    console.error("❌ Error setting up test data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestData();
