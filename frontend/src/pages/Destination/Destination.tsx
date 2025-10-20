import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Plane, Filter, Loader2, AlertCircle } from 'lucide-react';

// Interfaces for TypeScript
interface Airport {
  id: string;
  name: string;
  iataCode: string;
}

interface City {
  id: string;
  name: string;
}

interface Country {
  id: string;
  name: string;
}

interface DestinationWithRelations {
  id: string;
  name: string;
  cityId: string;
  countryId: string;
  airportId: string;
  description?: string;
  imageUrl?: string;
  category: string;
  rating?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  city: City;
  country: Country;
  airport: Airport;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: DestinationWithRelations[];
}

const Destination = (): React.ReactElement => {
  // State management
  const [destinations, setDestinations] = useState<DestinationWithRelations[]>([]);
  const [filteredDestinations, setFilteredDestinations] = useState<DestinationWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Extract unique categories and countries for filters
  const categories = [...new Set(destinations.map(dest => dest.category))];
  const countries = [...new Set(destinations.map(dest => dest.country.name))];

  // Fetch destinations from API
  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/destinations');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success && Array.isArray(result.data)) {
        setDestinations(result.data);
        setFilteredDestinations(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch destinations');
      }
    } catch (err) {
      console.error('Error fetching destinations:', err);

      // Fallback to mock data if API fails
      console.log('Using fallback mock data...');
      const mockDestinations: DestinationWithRelations[] = [
        {
          id: "bali-dest",
          name: "Bali Paradise",
          description: "Experience the beautiful beaches, temples, and culture of Bali",
          category: "Beach",
          rating: 4.8,
          imageUrl: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
          isActive: true,
          isFeatured: true,
          cityId: "denpasar-city",
          countryId: "indonesia-id",
          airportId: "dps-airport",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          city: { id: "denpasar-city", name: "Denpasar" },
          country: { id: "indonesia-id", name: "Indonesia" },
          airport: { id: "dps-airport", name: "Ngurah Rai International Airport", iataCode: "DPS" }
        },
        {
          id: "jakarta-dest",
          name: "Jakarta City Break",
          description: "Explore Indonesia's vibrant capital city with modern attractions",
          category: "City",
          rating: 4.3,
          imageUrl: "https://images.unsplash.com/photo-1555333145-4acf190da336?w=800",
          isActive: true,
          isFeatured: true,
          cityId: "jakarta-city",
          countryId: "indonesia-id",
          airportId: "cgk-airport",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          city: { id: "jakarta-city", name: "Jakarta" },
          country: { id: "indonesia-id", name: "Indonesia" },
          airport: { id: "cgk-airport", name: "Soekarno-Hatta International Airport", iataCode: "CGK" }
        },
        {
          id: "yogya-dest",
          name: "Yogyakarta Cultural Tour",
          description: "Discover the cultural heart of Java with ancient temples and traditional arts",
          category: "Cultural",
          rating: 4.6,
          imageUrl: "https://images.unsplash.com/photo-1586103371544-ec2b9e5a2e1b?w=800",
          isActive: true,
          isFeatured: false,
          cityId: "yogya-city",
          countryId: "indonesia-id",
          airportId: "jog-airport",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          city: { id: "yogya-city", name: "Yogyakarta" },
          country: { id: "indonesia-id", name: "Indonesia" },
          airport: { id: "jog-airport", name: "Yogyakarta International Airport", iataCode: "YIA" }
        },
        {
          id: "surabaya-dest",
          name: "Surabaya Adventure",
          description: "East Java's modern city with great food and business opportunities",
          category: "Adventure",
          rating: 4.1,
          imageUrl: "https://images.unsplash.com/photo-1548960033-c4a2be59a9fa?w=800",
          isActive: true,
          isFeatured: false,
          cityId: "surabaya-city",
          countryId: "indonesia-id",
          airportId: "mlg-airport",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          city: { id: "surabaya-city", name: "Surabaya" },
          country: { id: "indonesia-id", name: "Indonesia" },
          airport: { id: "mlg-airport", name: "Abdul Rachman Saleh Airport", iataCode: "MLG" }
        }
      ];

      setDestinations(mockDestinations);
      setFilteredDestinations(mockDestinations);
      setError('Using offline data - API connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Filter destinations based on search and filters
  useEffect(() => {
    let filtered = destinations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dest => dest.category === selectedCategory);
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(dest => dest.country.name === selectedCountry);
    }

    setFilteredDestinations(filtered);
  }, [destinations, searchTerm, selectedCategory, selectedCountry]);

  // Fetch data on component mount
  useEffect(() => {
    fetchDestinations();
  }, []);

  // Render star rating
  const renderStars = (rating: number | undefined) => {
    if (!rating) return null;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading destinations...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Destinations</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDestinations}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Explore Destinations</h1>
        <p className="text-gray-600">Discover amazing places around Indonesia</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search destinations, cities, or countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Country Filter */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-600">
          Showing {filteredDestinations.length} of {destinations.length} destinations
        </div>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No destinations found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                {destination.imageUrl ? (
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                {destination.isFeatured && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {destination.name}
                </h3>

                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">
                    {destination.city.name}, {destination.country.name}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <Plane size={16} className="mr-1" />
                  <span className="text-sm">
                    {destination.airport.name} ({destination.airport.iataCode})
                  </span>
                </div>

                {destination.rating && (
                  <div className="mb-3">
                    {renderStars(destination.rating)}
                  </div>
                )}

                {destination.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {destination.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {destination.category}
                  </span>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Destination;
