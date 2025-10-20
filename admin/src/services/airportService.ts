// =============================================================
// Airport Service - Data Bandara Indonesia dan Internasional
// =============================================================

export interface Airport {
  iata: string;
  icao: string;
  name: string;
  city: string;
  country: string;
  region: string;
  timezone: string;
}

// Data bandara populer di Indonesia dan beberapa internasional
export const AIRPORTS: Airport[] = [
  // Test Airport - Added from Database
  {
    iata: "ABC",
    icao: "ABCD",
    name: "ABCD Airport",
    city: "Doha",
    country: "Qatar",
    region: "Middle East",
    timezone: "Asia/Qatar",
  },

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

export class AirportService {
  static getAllAirports(): Airport[] {
    return AIRPORTS.sort((a, b) => a.city.localeCompare(b.city));
  }

  static getIndonesianAirports(): Airport[] {
    return AIRPORTS.filter((airport) => airport.country === "Indonesia").sort(
      (a, b) => a.city.localeCompare(b.city)
    );
  }

  static getRegionalAirports(): Airport[] {
    const regionalCountries = [
      "Singapore",
      "Malaysia",
      "Thailand",
      "Philippines",
      "Vietnam",
    ];
    return AIRPORTS.filter((airport) =>
      regionalCountries.includes(airport.country)
    ).sort((a, b) => a.city.localeCompare(b.city));
  }

  static getInternationalAirports(): Airport[] {
    const excludeCountries = [
      "Indonesia",
      "Singapore",
      "Malaysia",
      "Thailand",
      "Philippines",
      "Vietnam",
    ];
    return AIRPORTS.filter(
      (airport) => !excludeCountries.includes(airport.country)
    ).sort((a, b) => a.city.localeCompare(b.city));
  }

  static getAirportByIATA(iataCode: string): Airport | undefined {
    return AIRPORTS.find((airport) => airport.iata === iataCode.toUpperCase());
  }

  static searchAirports(query: string): Airport[] {
    const searchTerm = query.toLowerCase();
    return AIRPORTS.filter(
      (airport) =>
        airport.iata.toLowerCase().includes(searchTerm) ||
        airport.name.toLowerCase().includes(searchTerm) ||
        airport.city.toLowerCase().includes(searchTerm) ||
        airport.country.toLowerCase().includes(searchTerm)
    ).sort((a, b) => a.city.localeCompare(b.city));
  }

  static getAirportsByRegion(region: string): Airport[] {
    return AIRPORTS.filter((airport) => airport.region === region).sort(
      (a, b) => a.city.localeCompare(b.city)
    );
  }
}
