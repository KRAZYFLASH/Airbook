// =============================================================
// Script Import Data Bandara ke Database
// =============================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Data bandara dari frontend airportService.ts
const AIRPORTS_DATA = [
  // Indonesia - Jakarta
  {
    iata: "CGK",
    icao: "WIII",
    name: "Soekarno-Hatta International Airport",
    city: "Jakarta",
    country: "Indonesia",
    region: "Java",
    timezone: "Asia/Jakarta",
  },
  {
    iata: "HLP",
    icao: "WIHH",
    name: "Halim Perdanakusuma Airport",
    city: "Jakarta",
    country: "Indonesia",
    region: "Java",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Bali
  {
    iata: "DPS",
    icao: "WADD",
    name: "Ngurah Rai International Airport",
    city: "Denpasar",
    country: "Indonesia",
    region: "Bali",
    timezone: "Asia/Makassar",
  },

  // Indonesia - Yogyakarta
  {
    iata: "YIA",
    icao: "WAHI",
    name: "Yogyakarta International Airport",
    city: "Yogyakarta",
    country: "Indonesia",
    region: "Java",
    timezone: "Asia/Jakarta",
  },
  {
    iata: "JOG",
    icao: "WARJ",
    name: "Adisutcipto International Airport",
    city: "Yogyakarta",
    country: "Indonesia",
    region: "Java",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Surabaya
  {
    iata: "MLG",
    icao: "WARA",
    name: "Abdul Rachman Saleh Airport",
    city: "Malang",
    country: "Indonesia",
    region: "Java",
    timezone: "Asia/Jakarta",
  },
  {
    iata: "JBB",
    icao: "WARS",
    name: "Juanda International Airport",
    city: "Surabaya",
    country: "Indonesia",
    region: "Java",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Medan
  {
    iata: "KNO",
    icao: "WIMM",
    name: "Kualanamu International Airport",
    city: "Medan",
    country: "Indonesia",
    region: "Sumatra",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Makassar
  {
    iata: "UPG",
    icao: "WAAA",
    name: "Sultan Hasanuddin Airport",
    city: "Makassar",
    country: "Indonesia",
    region: "Sulawesi",
    timezone: "Asia/Makassar",
  },

  // Indonesia - Balikpapan
  {
    iata: "BPN",
    icao: "WALL",
    name: "Sultan Aji Muhammad Sulaiman Airport",
    city: "Balikpapan",
    country: "Indonesia",
    region: "Kalimantan",
    timezone: "Asia/Makassar",
  },

  // Indonesia - Batam
  {
    iata: "BTH",
    icao: "WIDD",
    name: "Hang Nadim Airport",
    city: "Batam",
    country: "Indonesia",
    region: "Riau Islands",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Banda Aceh
  {
    iata: "BTJ",
    icao: "WITT",
    name: "Sultan Iskandar Muda Airport",
    city: "Banda Aceh",
    country: "Indonesia",
    region: "Sumatra",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Padang
  {
    iata: "PDG",
    icao: "WIPD",
    name: "Minangkabau International Airport",
    city: "Padang",
    country: "Indonesia",
    region: "Sumatra",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Palembang
  {
    iata: "PLM",
    icao: "WIPP",
    name: "Sultan Mahmud Badaruddin II Airport",
    city: "Palembang",
    country: "Indonesia",
    region: "Sumatra",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Pekanbaru
  {
    iata: "PKU",
    icao: "WIBB",
    name: "Sultan Syarif Kasim II Airport",
    city: "Pekanbaru",
    country: "Indonesia",
    region: "Sumatra",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Banjarmasin
  {
    iata: "BJM",
    icao: "WAOO",
    name: "Syamsudin Noor Airport",
    city: "Banjarmasin",
    country: "Indonesia",
    region: "Kalimantan",
    timezone: "Asia/Makassar",
  },

  // Indonesia - Manado
  {
    iata: "MDC",
    icao: "WAMM",
    name: "Sam Ratulangi Airport",
    city: "Manado",
    country: "Indonesia",
    region: "Sulawesi",
    timezone: "Asia/Makassar",
  },

  // Indonesia - Jayapura
  {
    iata: "DJJ",
    icao: "WAJJ",
    name: "Sentani Airport",
    city: "Jayapura",
    country: "Indonesia",
    region: "Papua",
    timezone: "Asia/Jayapura",
  },

  // Indonesia - Kupang
  {
    iata: "KOE",
    icao: "WATT",
    name: "El Tari Airport",
    city: "Kupang",
    country: "Indonesia",
    region: "Nusa Tenggara",
    timezone: "Asia/Makassar",
  },

  // Indonesia - Pontianak
  {
    iata: "PNK",
    icao: "WIOO",
    name: "Supadio Airport",
    city: "Pontianak",
    country: "Indonesia",
    region: "Kalimantan",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Solo
  {
    iata: "SOC",
    icao: "WAHH",
    name: "Adisumarmo Airport",
    city: "Solo",
    country: "Indonesia",
    region: "Java",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Semarang
  {
    iata: "SRG",
    icao: "WARS",
    name: "Ahmad Yani Airport",
    city: "Semarang",
    country: "Indonesia",
    region: "Java",
    timezone: "Asia/Jakarta",
  },

  // Indonesia - Lombok
  {
    iata: "LOP",
    icao: "WADL",
    name: "Lombok International Airport",
    city: "Lombok",
    country: "Indonesia",
    region: "Nusa Tenggara",
    timezone: "Asia/Makassar",
  },

  // Regional - Singapura
  {
    iata: "SIN",
    icao: "WSSS",
    name: "Singapore Changi Airport",
    city: "Singapore",
    country: "Singapore",
    region: "Southeast Asia",
    timezone: "Asia/Singapore",
  },

  // Regional - Kuala Lumpur
  {
    iata: "KUL",
    icao: "WMKK",
    name: "Kuala Lumpur International Airport",
    city: "Kuala Lumpur",
    country: "Malaysia",
    region: "Southeast Asia",
    timezone: "Asia/Kuala_Lumpur",
  },

  // Regional - Bangkok
  {
    iata: "BKK",
    icao: "VTBS",
    name: "Suvarnabhumi Airport",
    city: "Bangkok",
    country: "Thailand",
    region: "Southeast Asia",
    timezone: "Asia/Bangkok",
  },

  // Regional - Manila
  {
    iata: "MNL",
    icao: "RPLL",
    name: "Ninoy Aquino International Airport",
    city: "Manila",
    country: "Philippines",
    region: "Southeast Asia",
    timezone: "Asia/Manila",
  },

  // Regional - Ho Chi Minh
  {
    iata: "SGN",
    icao: "VVTS",
    name: "Tan Son Nhat Airport",
    city: "Ho Chi Minh City",
    country: "Vietnam",
    region: "Southeast Asia",
    timezone: "Asia/Ho_Chi_Minh",
  },

  // International - Tokyo
  {
    iata: "NRT",
    icao: "RJAA",
    name: "Narita International Airport",
    city: "Tokyo",
    country: "Japan",
    region: "East Asia",
    timezone: "Asia/Tokyo",
  },

  // International - Seoul
  {
    iata: "ICN",
    icao: "RKSI",
    name: "Incheon International Airport",
    city: "Seoul",
    country: "South Korea",
    region: "East Asia",
    timezone: "Asia/Seoul",
  },

  // International - Hong Kong
  {
    iata: "HKG",
    icao: "VHHH",
    name: "Hong Kong International Airport",
    city: "Hong Kong",
    country: "Hong Kong",
    region: "East Asia",
    timezone: "Asia/Hong_Kong",
  },

  // International - Dubai
  {
    iata: "DXB",
    icao: "OMDB",
    name: "Dubai International Airport",
    city: "Dubai",
    country: "UAE",
    region: "Middle East",
    timezone: "Asia/Dubai",
  },

  // International - Doha
  {
    iata: "DOH",
    icao: "OTHH",
    name: "Hamad International Airport",
    city: "Doha",
    country: "Qatar",
    region: "Middle East",
    timezone: "Asia/Qatar",
  },

  // International - London
  {
    iata: "LHR",
    icao: "EGLL",
    name: "London Heathrow Airport",
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    timezone: "Europe/London",
  },

  // International - Amsterdam
  {
    iata: "AMS",
    icao: "EHAM",
    name: "Amsterdam Airport Schiphol",
    city: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    timezone: "Europe/Amsterdam",
  },

  // International - Frankfurt
  {
    iata: "FRA",
    icao: "EDDF",
    name: "Frankfurt Airport",
    city: "Frankfurt",
    country: "Germany",
    region: "Europe",
    timezone: "Europe/Berlin",
  },

  // International - Paris
  {
    iata: "CDG",
    icao: "LFPG",
    name: "Charles de Gaulle Airport",
    city: "Paris",
    country: "France",
    region: "Europe",
    timezone: "Europe/Paris",
  },

  // International - Istanbul
  {
    iata: "IST",
    icao: "LTFM",
    name: "Istanbul Airport",
    city: "Istanbul",
    country: "Turkey",
    region: "Europe",
    timezone: "Europe/Istanbul",
  },

  // International - New York
  {
    iata: "JFK",
    icao: "KJFK",
    name: "John F. Kennedy International Airport",
    city: "New York",
    country: "United States",
    region: "North America",
    timezone: "America/New_York",
  },

  // International - Los Angeles
  {
    iata: "LAX",
    icao: "KLAX",
    name: "Los Angeles International Airport",
    city: "Los Angeles",
    country: "United States",
    region: "North America",
    timezone: "America/Los_Angeles",
  },
];

async function importAirports() {
  console.log("🚀 Starting airport data import...");

  try {
    // First, create countries if they don't exist
    const countries = [
      ...new Set(AIRPORTS_DATA.map((airport) => airport.country)),
    ];
    console.log(`📍 Creating ${countries.length} countries...`);

    for (const countryName of countries) {
      const existingCountry = await prisma.country.findUnique({
        where: { name: countryName },
      });

      if (!existingCountry) {
        const countryCode = getCountryCode(countryName);
        const existingByCode = await prisma.country.findUnique({
          where: { code: countryCode },
        });

        if (!existingByCode) {
          await prisma.country.create({
            data: {
              name: countryName,
              code: countryCode,
              continent: getContinent(countryName),
              currency: getCurrency(countryName),
              timezone: getMainTimezone(countryName),
            },
          });
          console.log(`✨ Created country: ${countryName} (${countryCode})`);
        } else {
          console.log(
            `⚠️ Country code ${countryCode} already exists for ${existingByCode.name}, skipping ${countryName}`
          );
        }
      } else {
        console.log(`✅ Country already exists: ${countryName}`);
      }
    }

    // Then, create cities if they don't exist
    const cities = [
      ...new Set(
        AIRPORTS_DATA.map((airport) => `${airport.city}|${airport.country}`)
      ),
    ];
    console.log(`🏙️ Creating ${cities.length} cities...`);

    for (const cityKey of cities) {
      const [cityName, countryName] = cityKey.split("|");
      const country = await prisma.country.findUnique({
        where: { name: countryName },
      });

      if (country) {
        // Check if city already exists
        const existingCity = await prisma.city.findFirst({
          where: {
            name: cityName,
            countryId: country.id,
          },
        });

        if (!existingCity) {
          await prisma.city.create({
            data: {
              name: cityName,
              countryId: country.id,
              timezone: AIRPORTS_DATA.find(
                (a) => a.city === cityName && a.country === countryName
              )?.timezone,
            },
          });
        }
      }
    }

    // Finally, create airports
    console.log(`✈️ Creating ${AIRPORTS_DATA.length} airports...`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const airportData of AIRPORTS_DATA) {
      const country = await prisma.country.findUnique({
        where: { name: airportData.country },
      });

      const city = await prisma.city.findFirst({
        where: {
          name: airportData.city,
          countryId: country?.id,
        },
      });

      if (country && city) {
        const existingAirport = await prisma.airport.findFirst({
          where: {
            OR: [
              { iataCode: airportData.iata },
              { icaoCode: airportData.icao },
            ],
          },
        });

        if (existingAirport) {
          // Only update if the data is different
          const needsUpdate =
            existingAirport.name !== airportData.name ||
            existingAirport.cityId !== city.id ||
            existingAirport.countryId !== country.id ||
            existingAirport.timezone !== airportData.timezone;

          if (needsUpdate) {
            await prisma.airport.update({
              where: { id: existingAirport.id },
              data: {
                name: airportData.name,
                cityId: city.id,
                countryId: country.id,
                timezone: airportData.timezone,
                // Keep existing IATA/ICAO codes, don't update them
              },
            });
            updatedCount++;
            console.log(
              `✅ Updated: ${airportData.iata} - ${airportData.name}`
            );
          } else {
            console.log(
              `⭐ Already up-to-date: ${airportData.iata} - ${airportData.name}`
            );
          }
        } else {
          await prisma.airport.create({
            data: {
              name: airportData.name,
              iataCode: airportData.iata,
              icaoCode: airportData.icao,
              cityId: city.id,
              countryId: country.id,
              timezone: airportData.timezone,
            },
          });
          createdCount++;
          console.log(`✨ Created: ${airportData.iata} - ${airportData.name}`);
        }
      } else {
        console.log(
          `⚠️ Skipped: ${airportData.iata} - Missing country or city`
        );
      }
    }

    console.log("\n🎉 Import completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Created: ${createdCount} airports`);
    console.log(`   - Updated: ${updatedCount} airports`);
    console.log(
      `   - Total: ${createdCount + updatedCount} airports processed`
    );
  } catch (error) {
    console.error("❌ Error during import:", error);
    throw error;
  }
}

// Helper functions for country data
function getCountryCode(countryName: string): string {
  const codes: Record<string, string> = {
    Indonesia: "ID",
    Singapore: "SG",
    Malaysia: "MY",
    Thailand: "TH",
    Philippines: "PH",
    Vietnam: "VN",
    Japan: "JP",
    "South Korea": "KR",
    "Hong Kong": "HK",
    UAE: "AE",
    Qatar: "QA",
    "United Kingdom": "GB",
    Netherlands: "NL",
    Germany: "DE",
    France: "FR",
    Turkey: "TR",
    "United States": "US",
  };
  return (
    codes[countryName] ||
    countryName.replace(/\s+/g, "").substring(0, 3).toUpperCase()
  );
}

function getContinent(countryName: string): string {
  const continents: Record<string, string> = {
    Indonesia: "Asia",
    Singapore: "Asia",
    Malaysia: "Asia",
    Thailand: "Asia",
    Philippines: "Asia",
    Vietnam: "Asia",
    Japan: "Asia",
    "South Korea": "Asia",
    "Hong Kong": "Asia",
    UAE: "Asia",
    Qatar: "Asia",
    "United Kingdom": "Europe",
    Netherlands: "Europe",
    Germany: "Europe",
    France: "Europe",
    Turkey: "Europe",
    "United States": "North America",
  };
  return continents[countryName] || "Unknown";
}

function getCurrency(countryName: string): string {
  const currencies: Record<string, string> = {
    Indonesia: "IDR",
    Singapore: "SGD",
    Malaysia: "MYR",
    Thailand: "THB",
    Philippines: "PHP",
    Vietnam: "VND",
    Japan: "JPY",
    "South Korea": "KRW",
    "Hong Kong": "HKD",
    UAE: "AED",
    Qatar: "QAR",
    "United Kingdom": "GBP",
    Netherlands: "EUR",
    Germany: "EUR",
    France: "EUR",
    Turkey: "TRY",
    "United States": "USD",
  };
  return currencies[countryName] || "USD";
}

function getMainTimezone(countryName: string): string {
  const timezones: Record<string, string> = {
    Indonesia: "Asia/Jakarta",
    Singapore: "Asia/Singapore",
    Malaysia: "Asia/Kuala_Lumpur",
    Thailand: "Asia/Bangkok",
    Philippines: "Asia/Manila",
    Vietnam: "Asia/Ho_Chi_Minh",
    Japan: "Asia/Tokyo",
    "South Korea": "Asia/Seoul",
    "Hong Kong": "Asia/Hong_Kong",
    UAE: "Asia/Dubai",
    Qatar: "Asia/Qatar",
    "United Kingdom": "Europe/London",
    Netherlands: "Europe/Amsterdam",
    Germany: "Europe/Berlin",
    France: "Europe/Paris",
    Turkey: "Europe/Istanbul",
    "United States": "America/New_York",
  };
  return timezones[countryName] || "UTC";
}

// Run the import
if (require.main === module) {
  importAirports()
    .then(() => {
      console.log("✅ Import script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Import script failed:", error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

export { importAirports };
