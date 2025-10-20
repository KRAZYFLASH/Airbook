// Test script untuk membuat sample destination data untuk frontend
const sampleDestinations = [
  {
    id: "bali-dest",
    name: "Bali Paradise",
    description:
      "Experience the beautiful beaches, temples, and culture of Bali",
    category: "BEACH",
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
    isActive: true,
    isFeatured: true,
    city: {
      id: "denpasar-city",
      name: "Denpasar",
    },
    country: {
      id: "indonesia-id",
      name: "Indonesia",
    },
    airport: {
      id: "dps-airport",
      name: "Ngurah Rai International Airport",
      iataCode: "DPS",
    },
  },
  {
    id: "jakarta-dest",
    name: "Jakarta City Break",
    description:
      "Explore Indonesia's vibrant capital city with modern attractions",
    category: "CITY",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1555333145-4acf190da336?w=800",
    isActive: true,
    isFeatured: true,
    city: {
      id: "jakarta-city",
      name: "Jakarta",
    },
    country: {
      id: "indonesia-id",
      name: "Indonesia",
    },
    airport: {
      id: "cgk-airport",
      name: "Soekarno-Hatta International Airport",
      iataCode: "CGK",
    },
  },
  {
    id: "yogya-dest",
    name: "Yogyakarta Cultural Tour",
    description:
      "Discover the cultural heart of Java with ancient temples and traditions",
    category: "CULTURAL",
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1599833842960-0143f48e65f8?w=800",
    isActive: true,
    isFeatured: true,
    city: {
      id: "yogya-city",
      name: "Yogyakarta",
    },
    country: {
      id: "indonesia-id",
      name: "Indonesia",
    },
    airport: {
      id: "jog-airport",
      name: "Adisutcipto International Airport",
      iataCode: "JOG",
    },
  },
];

console.log("Sample Destinations for Frontend:");
console.log(
  JSON.stringify(
    {
      success: true,
      message: "Destinations retrieved successfully",
      data: sampleDestinations,
      pagination: {
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
      },
    },
    null,
    2
  )
);

console.log("\n📝 Endpoints yang bisa digunakan frontend:");
console.log("GET /api/destinations - Get all destinations");
console.log("GET /api/destinations/popular - Get popular destinations");
console.log("GET /api/destinations/search?query=bali - Search destinations");
console.log("GET /api/destinations/:id - Get destination by ID");
console.log(
  "GET /api/destinations/csv/search?query=jakarta - Search from CSV (fallback)"
);
