import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting comprehensive database seeding...");

  // 1. Countries
  console.log("📍 Seeding countries...");
  const countries = await Promise.all([
    prisma.country.upsert({
      where: { code: "ID" },
      update: {},
      create: {
        name: "Indonesia",
        code: "ID",
        continent: "Asia",
        currency: "IDR",
        timezone: "Asia/Jakarta",
        isActive: true,
      },
    }),
    prisma.country.upsert({
      where: { code: "SG" },
      update: {},
      create: {
        name: "Singapore",
        code: "SG",
        continent: "Asia",
        currency: "SGD",
        timezone: "Asia/Singapore",
        isActive: true,
      },
    }),
    prisma.country.upsert({
      where: { code: "MY" },
      update: {},
      create: {
        name: "Malaysia",
        code: "MY",
        continent: "Asia",
        currency: "MYR",
        timezone: "Asia/Kuala_Lumpur",
        isActive: true,
      },
    }),
    prisma.country.upsert({
      where: { code: "TH" },
      update: {},
      create: {
        name: "Thailand",
        code: "TH",
        continent: "Asia",
        currency: "THB",
        timezone: "Asia/Bangkok",
        isActive: true,
      },
    }),
    prisma.country.upsert({
      where: { code: "VN" },
      update: {},
      create: {
        name: "Vietnam",
        code: "VN",
        continent: "Asia",
        currency: "VND",
        timezone: "Asia/Ho_Chi_Minh",
        isActive: true,
      },
    }),
    prisma.country.upsert({
      where: { code: "PH" },
      update: {},
      create: {
        name: "Philippines",
        code: "PH",
        continent: "Asia",
        currency: "PHP",
        timezone: "Asia/Manila",
        isActive: true,
      },
    }),
    prisma.country.upsert({
      where: { code: "JP" },
      update: {},
      create: {
        name: "Japan",
        code: "JP",
        continent: "Asia",
        currency: "JPY",
        timezone: "Asia/Tokyo",
        isActive: true,
      },
    }),
    prisma.country.upsert({
      where: { code: "AU" },
      update: {},
      create: {
        name: "Australia",
        code: "AU",
        continent: "Oceania",
        currency: "AUD",
        timezone: "Australia/Sydney",
        isActive: true,
      },
    }),
  ]);

  // 2. Cities
  console.log("🏙️ Seeding cities...");
  const cities = await Promise.all([
    // Indonesia
    prisma.city.upsert({
      where: { id: "city-jakarta" },
      update: {},
      create: {
        id: "city-jakarta",
        name: "Jakarta",
        countryId: countries.find((c) => c.code === "ID")!.id,
        state: "DKI Jakarta",
        population: 10770000,
        timezone: "Asia/Jakarta",
        lat: -6.2088,
        lon: 106.8456,
        isActive: true,
      },
    }),
    prisma.city.upsert({
      where: { id: "city-surabaya" },
      update: {},
      create: {
        id: "city-surabaya",
        name: "Surabaya",
        countryId: countries.find((c) => c.code === "ID")!.id,
        state: "East Java",
        population: 2874000,
        timezone: "Asia/Jakarta",
        lat: -7.2575,
        lon: 112.7521,
        isActive: true,
      },
    }),
    prisma.city.upsert({
      where: { id: "city-denpasar" },
      update: {},
      create: {
        id: "city-denpasar",
        name: "Denpasar",
        countryId: countries.find((c) => c.code === "ID")!.id,
        state: "Bali",
        population: 897300,
        timezone: "Asia/Makassar",
        lat: -8.6705,
        lon: 115.2126,
        isActive: true,
      },
    }),
    prisma.city.upsert({
      where: { id: "city-medan" },
      update: {},
      create: {
        id: "city-medan",
        name: "Medan",
        countryId: countries.find((c) => c.code === "ID")!.id,
        state: "North Sumatra",
        population: 2435000,
        timezone: "Asia/Jakarta",
        lat: 3.5952,
        lon: 98.6722,
        isActive: true,
      },
    }),
    // Singapore
    prisma.city.upsert({
      where: { id: "city-singapore" },
      update: {},
      create: {
        id: "city-singapore",
        name: "Singapore",
        countryId: countries.find((c) => c.code === "SG")!.id,
        population: 5685000,
        timezone: "Asia/Singapore",
        lat: 1.3521,
        lon: 103.8198,
        isActive: true,
      },
    }),
    // Malaysia
    prisma.city.upsert({
      where: { id: "city-kuala-lumpur" },
      update: {},
      create: {
        id: "city-kuala-lumpur",
        name: "Kuala Lumpur",
        countryId: countries.find((c) => c.code === "MY")!.id,
        state: "Federal Territory",
        population: 1768000,
        timezone: "Asia/Kuala_Lumpur",
        lat: 3.139,
        lon: 101.6869,
        isActive: true,
      },
    }),
    // Thailand
    prisma.city.upsert({
      where: { id: "city-bangkok" },
      update: {},
      create: {
        id: "city-bangkok",
        name: "Bangkok",
        countryId: countries.find((c) => c.code === "TH")!.id,
        population: 10539000,
        timezone: "Asia/Bangkok",
        lat: 13.7563,
        lon: 100.5018,
        isActive: true,
      },
    }),
    // Vietnam
    prisma.city.upsert({
      where: { id: "city-ho-chi-minh" },
      update: {},
      create: {
        id: "city-ho-chi-minh",
        name: "Ho Chi Minh City",
        countryId: countries.find((c) => c.code === "VN")!.id,
        population: 9321000,
        timezone: "Asia/Ho_Chi_Minh",
        lat: 10.8231,
        lon: 106.6297,
        isActive: true,
      },
    }),
    // Philippines
    prisma.city.upsert({
      where: { id: "city-manila" },
      update: {},
      create: {
        id: "city-manila",
        name: "Manila",
        countryId: countries.find((c) => c.code === "PH")!.id,
        population: 13482000,
        timezone: "Asia/Manila",
        lat: 14.5995,
        lon: 120.9842,
        isActive: true,
      },
    }),
    // Japan
    prisma.city.upsert({
      where: { id: "city-tokyo" },
      update: {},
      create: {
        id: "city-tokyo",
        name: "Tokyo",
        countryId: countries.find((c) => c.code === "JP")!.id,
        population: 37435000,
        timezone: "Asia/Tokyo",
        lat: 35.6762,
        lon: 139.6503,
        isActive: true,
      },
    }),
    // Australia
    prisma.city.upsert({
      where: { id: "city-sydney" },
      update: {},
      create: {
        id: "city-sydney",
        name: "Sydney",
        countryId: countries.find((c) => c.code === "AU")!.id,
        state: "New South Wales",
        population: 5312000,
        timezone: "Australia/Sydney",
        lat: -33.8688,
        lon: 151.2093,
        isActive: true,
      },
    }),
  ]);

  // 3. Airports
  console.log("✈️ Seeding airports...");
  const airports = await Promise.all([
    // Indonesia
    prisma.airport.upsert({
      where: { iataCode: "CGK" },
      update: {},
      create: {
        name: "Soekarno-Hatta International Airport",
        iataCode: "CGK",
        icaoCode: "WIII",
        cityId: cities.find((c) => c.name === "Jakarta")!.id,
        countryId: countries.find((c) => c.code === "ID")!.id,
        municipality: "Tangerang",
        lat: -6.1256,
        lon: 106.6558,
        elevation: 34,
        timezone: "Asia/Jakarta",
        isActive: true,
      },
    }),
    prisma.airport.upsert({
      where: { iataCode: "MLG" },
      update: {},
      create: {
        name: "Abdul Rachman Saleh Airport",
        iataCode: "MLG",
        icaoCode: "WARA",
        cityId: cities.find((c) => c.name === "Surabaya")!.id,
        countryId: countries.find((c) => c.code === "ID")!.id,
        municipality: "Malang",
        lat: -7.9266,
        lon: 112.7147,
        elevation: 526,
        timezone: "Asia/Jakarta",
        isActive: true,
      },
    }),
    prisma.airport.upsert({
      where: { iataCode: "DPS" },
      update: {},
      create: {
        name: "Ngurah Rai International Airport",
        iataCode: "DPS",
        icaoCode: "WADD",
        cityId: cities.find((c) => c.name === "Denpasar")!.id,
        countryId: countries.find((c) => c.code === "ID")!.id,
        municipality: "Denpasar",
        lat: -8.7482,
        lon: 115.1671,
        elevation: 14,
        timezone: "Asia/Makassar",
        isActive: true,
      },
    }),
    prisma.airport.upsert({
      where: { iataCode: "KNO" },
      update: {},
      create: {
        name: "Kualanamu International Airport",
        iataCode: "KNO",
        icaoCode: "WIMM",
        cityId: cities.find((c) => c.name === "Medan")!.id,
        countryId: countries.find((c) => c.code === "ID")!.id,
        municipality: "Medan",
        lat: 3.6422,
        lon: 98.8853,
        elevation: 23,
        timezone: "Asia/Jakarta",
        isActive: true,
      },
    }),
    // Singapore
    prisma.airport.upsert({
      where: { iataCode: "SIN" },
      update: {},
      create: {
        name: "Singapore Changi Airport",
        iataCode: "SIN",
        icaoCode: "WSSS",
        cityId: cities.find((c) => c.name === "Singapore")!.id,
        countryId: countries.find((c) => c.code === "SG")!.id,
        municipality: "Singapore",
        lat: 1.3644,
        lon: 103.9915,
        elevation: 22,
        timezone: "Asia/Singapore",
        isActive: true,
      },
    }),
    // Malaysia
    prisma.airport.upsert({
      where: { iataCode: "KUL" },
      update: {},
      create: {
        name: "Kuala Lumpur International Airport",
        iataCode: "KUL",
        icaoCode: "WMKK",
        cityId: cities.find((c) => c.name === "Kuala Lumpur")!.id,
        countryId: countries.find((c) => c.code === "MY")!.id,
        municipality: "Sepang",
        lat: 2.7456,
        lon: 101.7072,
        elevation: 69,
        timezone: "Asia/Kuala_Lumpur",
        isActive: true,
      },
    }),
    // Thailand
    prisma.airport.upsert({
      where: { iataCode: "BKK" },
      update: {},
      create: {
        name: "Suvarnabhumi Airport",
        iataCode: "BKK",
        icaoCode: "VTBS",
        cityId: cities.find((c) => c.name === "Bangkok")!.id,
        countryId: countries.find((c) => c.code === "TH")!.id,
        municipality: "Bang Phli",
        lat: 13.681,
        lon: 100.7472,
        elevation: 5,
        timezone: "Asia/Bangkok",
        isActive: true,
      },
    }),
    // Vietnam
    prisma.airport.upsert({
      where: { iataCode: "SGN" },
      update: {},
      create: {
        name: "Tan Son Nhat International Airport",
        iataCode: "SGN",
        icaoCode: "VVTS",
        cityId: cities.find((c) => c.name === "Ho Chi Minh City")!.id,
        countryId: countries.find((c) => c.code === "VN")!.id,
        municipality: "Ho Chi Minh City",
        lat: 10.8188,
        lon: 106.652,
        elevation: 33,
        timezone: "Asia/Ho_Chi_Minh",
        isActive: true,
      },
    }),
    // Philippines
    prisma.airport.upsert({
      where: { iataCode: "MNL" },
      update: {},
      create: {
        name: "Ninoy Aquino International Airport",
        iataCode: "MNL",
        icaoCode: "RPLL",
        cityId: cities.find((c) => c.name === "Manila")!.id,
        countryId: countries.find((c) => c.code === "PH")!.id,
        municipality: "Pasay",
        lat: 14.5086,
        lon: 121.0194,
        elevation: 75,
        timezone: "Asia/Manila",
        isActive: true,
      },
    }),
    // Japan
    prisma.airport.upsert({
      where: { iataCode: "NRT" },
      update: {},
      create: {
        name: "Narita International Airport",
        iataCode: "NRT",
        icaoCode: "RJAA",
        cityId: cities.find((c) => c.name === "Tokyo")!.id,
        countryId: countries.find((c) => c.code === "JP")!.id,
        municipality: "Narita",
        lat: 35.772,
        lon: 140.3929,
        elevation: 43,
        timezone: "Asia/Tokyo",
        isActive: true,
      },
    }),
    // Australia
    prisma.airport.upsert({
      where: { iataCode: "SYD" },
      update: {},
      create: {
        name: "Sydney Kingsford Smith Airport",
        iataCode: "SYD",
        icaoCode: "YSSY",
        cityId: cities.find((c) => c.name === "Sydney")!.id,
        countryId: countries.find((c) => c.code === "AU")!.id,
        municipality: "Sydney",
        lat: -33.9399,
        lon: 151.1753,
        elevation: 21,
        timezone: "Australia/Sydney",
        isActive: true,
      },
    }),
  ]);

  // 4. Airlines
  console.log("🛫 Seeding airlines...");
  const airlines = await Promise.all([
    prisma.airline.upsert({
      where: { code: "GA" },
      update: {},
      create: {
        name: "Garuda Indonesia",
        code: "GA",
        icaoCode: "GIA",
        countryId: countries.find((c) => c.code === "ID")!.id,
        logo: "https://logos-world.net/wp-content/uploads/2023/01/Garuda-Indonesia-Logo.png",
        description: "The national airline of Indonesia",
        website: "https://www.garuda-indonesia.com",
        isActive: true,
      },
    }),
    prisma.airline.upsert({
      where: { code: "JT" },
      update: {},
      create: {
        name: "Lion Air",
        code: "JT",
        icaoCode: "LNI",
        countryId: countries.find((c) => c.code === "ID")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lion_Air_logo.svg/1200px-Lion_Air_logo.svg.png",
        description: "Indonesian low-cost airline",
        website: "https://www.lionair.co.id",
        isActive: true,
      },
    }),
    prisma.airline.upsert({
      where: { code: "ID" },
      update: {},
      create: {
        name: "Batik Air",
        code: "ID",
        icaoCode: "BTK",
        countryId: countries.find((c) => c.code === "ID")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Batik_Air_logo.svg/1200px-Batik_Air_logo.svg.png",
        description: "Full-service airline subsidiary of Lion Air Group",
        website: "https://www.batikair.com",
        isActive: true,
      },
    }),
    prisma.airline.upsert({
      where: { code: "QZ" },
      update: {},
      create: {
        name: "Indonesia AirAsia",
        code: "QZ",
        icaoCode: "AWQ",
        countryId: countries.find((c) => c.code === "ID")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1200px-AirAsia_New_Logo.svg.png",
        description: "Low-cost airline based in Indonesia",
        website: "https://www.airasia.com",
        isActive: true,
      },
    }),
    prisma.airline.upsert({
      where: { code: "SQ" },
      update: {},
      create: {
        name: "Singapore Airlines",
        code: "SQ",
        icaoCode: "SIA",
        countryId: countries.find((c) => c.code === "SG")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/Singapore_Airlines_Logo_2.svg/1200px-Singapore_Airlines_Logo_2.svg.png",
        description: "Flag carrier airline of Singapore",
        website: "https://www.singaporeair.com",
        isActive: true,
      },
    }),
    prisma.airline.upsert({
      where: { code: "MH" },
      update: {},
      create: {
        name: "Malaysia Airlines",
        code: "MH",
        icaoCode: "MAS",
        countryId: countries.find((c) => c.code === "MY")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Malaysia_Airlines_logo.svg/1200px-Malaysia_Airlines_logo.svg.png",
        description: "Flag carrier airline of Malaysia",
        website: "https://www.malaysiaairlines.com",
        isActive: true,
      },
    }),
    prisma.airline.upsert({
      where: { code: "TG" },
      update: {},
      create: {
        name: "Thai Airways",
        code: "TG",
        icaoCode: "THA",
        countryId: countries.find((c) => c.code === "TH")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/Thai_Airways_Logo.svg/1200px-Thai_Airways_Logo.svg.png",
        description: "Flag carrier airline of Thailand",
        website: "https://www.thaiairways.com",
        isActive: true,
      },
    }),
    prisma.airline.upsert({
      where: { code: "VN" },
      update: {},
      create: {
        name: "Vietnam Airlines",
        code: "VN",
        icaoCode: "HVN",
        countryId: countries.find((c) => c.code === "VN")!.id,
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Vietnam_Airlines_logo.svg/1200px-Vietnam_Airlines_logo.svg.png",
        description: "Flag carrier airline of Vietnam",
        website: "https://www.vietnamairlines.com",
        isActive: true,
      },
    }),
  ]);

  // 5. Admin Flight Schedules
  console.log("🗓️ Seeding flight schedules...");
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  await Promise.all([
    // Garuda Indonesia flights
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-ga-410" },
      update: {},
      create: {
        id: "flight-ga-410",
        airlineId: airlines.find((a) => a.code === "GA")!.id,
        flightNo: "GA-410",
        origin: "CGK",
        destination: "DPS",
        departure: new Date("2025-10-22T07:00:00Z"),
        arrival: new Date("2025-10-22T10:00:00Z"),
        basePrice: 1200000,
        seats: 180,
        status: "SCHEDULED",
      },
    }),
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-ga-411" },
      update: {},
      create: {
        id: "flight-ga-411",
        airlineId: airlines.find((a) => a.code === "GA")!.id,
        flightNo: "GA-411",
        origin: "DPS",
        destination: "CGK",
        departure: new Date("2025-10-22T14:30:00Z"),
        arrival: new Date("2025-10-22T17:30:00Z"),
        basePrice: 1200000,
        seats: 180,
        status: "SCHEDULED",
      },
    }),
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-ga-830" },
      update: {},
      create: {
        id: "flight-ga-830",
        airlineId: airlines.find((a) => a.code === "GA")!.id,
        flightNo: "GA-830",
        origin: "CGK",
        destination: "SIN",
        departure: new Date("2025-10-22T09:15:00Z"),
        arrival: new Date("2025-10-22T11:45:00Z"),
        basePrice: 2500000,
        seats: 180,
        status: "SCHEDULED",
      },
    }),
    // Lion Air flights
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-jt-610" },
      update: {},
      create: {
        id: "flight-jt-610",
        airlineId: airlines.find((a) => a.code === "JT")!.id,
        flightNo: "JT-610",
        origin: "CGK",
        destination: "MLG",
        departure: new Date("2025-10-22T06:30:00Z"),
        arrival: new Date("2025-10-22T09:00:00Z"),
        basePrice: 800000,
        seats: 189,
        status: "DELAYED",
      },
    }),
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-jt-270" },
      update: {},
      create: {
        id: "flight-jt-270",
        airlineId: airlines.find((a) => a.code === "JT")!.id,
        flightNo: "JT-270",
        origin: "CGK",
        destination: "KNO",
        departure: new Date("2025-10-22T08:45:00Z"),
        arrival: new Date("2025-10-22T11:15:00Z"),
        basePrice: 900000,
        seats: 189,
        status: "SCHEDULED",
      },
    }),
    // Batik Air flights
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-id-7700" },
      update: {},
      create: {
        id: "flight-id-7700",
        airlineId: airlines.find((a) => a.code === "ID")!.id,
        flightNo: "ID-7700",
        origin: "CGK",
        destination: "BKK",
        departure: new Date("2025-10-22T10:20:00Z"),
        arrival: new Date("2025-10-22T13:40:00Z"),
        basePrice: 1800000,
        seats: 162,
        status: "SCHEDULED",
      },
    }),
    // AirAsia flights
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-qz-8398" },
      update: {},
      create: {
        id: "flight-qz-8398",
        airlineId: airlines.find((a) => a.code === "QZ")!.id,
        flightNo: "QZ-8398",
        origin: "CGK",
        destination: "KUL",
        departure: new Date("2025-10-22T13:50:00Z"),
        arrival: new Date("2025-10-22T16:30:00Z"),
        basePrice: 750000,
        seats: 180,
        status: "SCHEDULED",
      },
    }),
    // Singapore Airlines
    prisma.adminFlightSchedule.upsert({
      where: { id: "flight-sq-950" },
      update: {},
      create: {
        id: "flight-sq-950",
        airlineId: airlines.find((a) => a.code === "SQ")!.id,
        flightNo: "SQ-950",
        origin: "SIN",
        destination: "CGK",
        departure: new Date("2025-10-22T19:25:00Z"),
        arrival: new Date("2025-10-22T21:45:00Z"),
        basePrice: 3200000,
        seats: 253,
        status: "SCHEDULED",
      },
    }),
  ]);

  // 6. Promotions
  console.log("🎯 Seeding promotions...");
  await Promise.all([
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

  console.log("✅ Database seeding completed successfully!");
  console.log(`
📊 Seeded Data Summary:
├─ 🌍 Countries: 8
├─ 🏙️ Cities: 11  
├─ ✈️ Airports: 11
├─ 🛫 Airlines: 8
├─ 🗓️ Flight Schedules: 8
└─ 🎯 Promotions: 6

🚀 Your AirBook admin system is now ready with comprehensive sample data!
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
