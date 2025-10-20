// =============================================================
// Airport Management Dashboard - CRUD interface untuk Airport
// =============================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Edit, Trash2, Power, MapPin, Plane, Globe, Building } from 'lucide-react';
import type { Airport } from '../types';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

interface AirportFormData {
    name: string;
    iataCode: string;
    icaoCode: string;
    cityId: string;
    countryId: string;
    municipality?: string;
    lat?: number;
    lon?: number;
    elevation?: number;
    timezone?: string;
    isActive: boolean;
}

interface Country {
    id: string;
    name: string;
}

interface City {
    id: string;
    name: string;
}

const AirportManagement = () => {
    // States
    const [airports, setAirports] = useState<Airport[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingAirport, setEditingAirport] = useState<Airport | null>(null);

    // Pagination & Search
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [showActiveOnly, setShowActiveOnly] = useState(true); // Changed to true to show active airports by default

    // Form
    const [formData, setFormData] = useState<AirportFormData>({
        name: '',
        iataCode: '',
        icaoCode: '',
        cityId: '',
        countryId: '',
        municipality: '',
        lat: undefined,
        lon: undefined,
        elevation: undefined,
        timezone: '',
        isActive: true
    });

    // Fetch airports
    const fetchAirports = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(searchQuery && { search: searchQuery }),
                ...(selectedCountry && { country: selectedCountry })
            });

            // Only add isActive parameter if the checkbox is checked
            if (showActiveOnly) {
                params.append('isActive', 'true');
            }

            const response = await fetch(`/api/airports?${params}`);
            const result: ApiResponse<Airport[]> = await response.json();

            if (result.success) {
                setAirports(result.data);
                if (result.pagination) {
                    setCurrentPage(result.pagination.page);
                    setTotalPages(result.pagination.pages);
                    setTotalRecords(result.pagination.total);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Gagal mengambil data airports');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCountry, showActiveOnly]);

    // Fetch dropdown data
    const fetchDropdownData = async () => {
        try {
            const response = await fetch('/api/airports/dropdown/countries');
            const result: ApiResponse<{ countries: Country[] }> = await response.json();

            if (result.success) {
                setCountries(result.data.countries);
            }
        } catch (err) {
            console.error('Error fetching dropdown data:', err);
        }
    };

    // Fetch cities by country
    const fetchCitiesByCountry = async (countryId: string) => {
        if (!countryId) {
            setCities([]);
            return;
        }

        try {
            const response = await fetch(`/api/airports/dropdown/cities/${countryId}`);
            const result: ApiResponse<City[]> = await response.json();

            if (result.success) {
                setCities(result.data);
            }
        } catch (err) {
            console.error('Error fetching cities:', err);
        }
    };

    // Create or update airport
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const url = editingAirport
                ? `/api/airports/${editingAirport.id}`
                : '/api/airports'; const method = editingAirport ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result: ApiResponse<Airport> = await response.json();

            if (result.success) {
                setShowModal(false);
                resetForm();
                fetchAirports(currentPage);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Gagal menyimpan airport');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Delete airport
    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus airport ini?')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/airports/${id}`, {
                method: 'DELETE'
            });

            const result: ApiResponse<null> = await response.json();

            if (result.success) {
                fetchAirports(currentPage);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Gagal menghapus airport');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Toggle airport status
    const handleToggleStatus = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/airports/${id}/toggle-status`, {
                method: 'PATCH'
            });

            const result: ApiResponse<Airport> = await response.json();

            if (result.success) {
                fetchAirports(currentPage);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Gagal mengubah status airport');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Form handlers
    const resetForm = () => {
        setFormData({
            name: '',
            iataCode: '',
            icaoCode: '',
            cityId: '',
            countryId: '',
            municipality: '',
            lat: undefined,
            lon: undefined,
            elevation: undefined,
            timezone: '',
            isActive: true
        });
        setEditingAirport(null);
        setCities([]);
    };

    const openEditModal = (airport: Airport) => {
        setEditingAirport(airport);
        setFormData({
            name: airport.name,
            iataCode: airport.iataCode || '',
            icaoCode: airport.icaoCode || '',
            cityId: airport.cityId,
            countryId: airport.countryId,
            municipality: airport.municipality || '',
            lat: airport.lat || undefined,
            lon: airport.lon || undefined,
            elevation: airport.elevation || undefined,
            timezone: airport.timezone || '',
            isActive: airport.isActive
        });

        if (airport.countryId) {
            fetchCitiesByCountry(airport.countryId);
        }

        setShowModal(true);
    };

    // Handle country change in form
    const handleCountryChange = (countryId: string) => {
        setFormData(prev => ({ ...prev, countryId, cityId: '' }));
        fetchCitiesByCountry(countryId);
    };

    // Effects
    useEffect(() => {
        fetchAirports();
        fetchDropdownData();
    }, [fetchAirports]);

    useEffect(() => {
        fetchAirports(1);
    }, [fetchAirports]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Airport</h1>
                    <p className="text-gray-600">Kelola data bandara untuk sistem booking</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Plus size={16} />
                    Tambah Airport
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama, kode IATA/ICAO..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Country Filter */}
                    <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Semua Negara</option>
                        {countries.map(country => (
                            <option key={country.id} value={country.name}>
                                {country.name}
                            </option>
                        ))}
                    </select>

                    {/* Active Filter */}
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showActiveOnly}
                            onChange={(e) => setShowActiveOnly(e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Hanya yang aktif</span>
                    </label>

                    {/* Stats */}
                    <div className="text-sm text-gray-600">
                        Total: <span className="font-semibold">{totalRecords}</span> airports
                    </div>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Airport Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Airport
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kode
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lokasi
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Koordinat
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span className="ml-2">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : airports.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <Plane size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p>Belum ada data airport</p>
                                        <p className="text-sm">Klik "Tambah Airport" untuk menambah airport baru</p>
                                    </td>
                                </tr>
                            ) : (
                                airports.map((airport) => (
                                    <tr key={airport.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                                        <Plane size={20} className="text-blue-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {airport.name}
                                                    </div>
                                                    {airport.municipality && (
                                                        <div className="text-sm text-gray-500">
                                                            {airport.municipality}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {airport.iataCode && (
                                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        IATA: {airport.iataCode}
                                                    </div>
                                                )}
                                                {airport.icaoCode && (
                                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        ICAO: {airport.icaoCode}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <MapPin size={14} className="mr-1 text-gray-400" />
                                                {airport.city?.name}, {airport.country?.name}
                                            </div>
                                            {airport.timezone && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Globe size={14} className="mr-1 text-gray-400" />
                                                    {airport.timezone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {airport.lat && airport.lon ? (
                                                <div>
                                                    <div>{airport.lat.toFixed(4)}°N</div>
                                                    <div>{airport.lon.toFixed(4)}°E</div>
                                                    {airport.elevation && (
                                                        <div className="flex items-center">
                                                            <Building size={12} className="mr-1" />
                                                            {airport.elevation}m
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${airport.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {airport.isActive ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(airport.id)}
                                                    className={`p-2 rounded-lg transition-colors ${airport.isActive
                                                            ? 'text-orange-600 hover:bg-orange-50'
                                                            : 'text-green-600 hover:bg-green-50'
                                                        }`}
                                                    title={airport.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                                                >
                                                    <Power size={16} />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(airport)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(airport.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white px-6 py-3 border rounded-lg">
                    <div className="text-sm text-gray-700">
                        Menampilkan {((currentPage - 1) * 10) + 1} sampai {Math.min(currentPage * 10, totalRecords)} dari {totalRecords} airport
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchAirports(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = Math.max(1, currentPage - 2) + i;
                                if (page > totalPages) return null;

                                return (
                                    <button
                                        key={page}
                                        onClick={() => fetchAirports(page)}
                                        className={`px-3 py-1 text-sm border rounded-md ${currentPage === page
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'hover:bg-gray-50'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => fetchAirports(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 bg-white rounded-t-lg">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {editingAirport ? 'Edit Airport' : 'Tambah Airport Baru'}
                            </h2>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSave} className="px-6 py-4 space-y-4">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-md font-medium text-gray-900">Informasi Dasar</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Airport *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Soekarno-Hatta International Airport"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Municipality
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.municipality || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Jakarta"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Kode IATA
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={3}
                                            value={formData.iataCode}
                                            onChange={(e) => setFormData(prev => ({ ...prev, iataCode: e.target.value.toUpperCase() }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="CGK"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Kode ICAO
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={4}
                                            value={formData.icaoCode}
                                            onChange={(e) => setFormData(prev => ({ ...prev, icaoCode: e.target.value.toUpperCase() }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="WIII"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-4">
                                <h3 className="text-md font-medium text-gray-900">Lokasi</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Negara *
                                        </label>
                                        <select
                                            required
                                            value={formData.countryId}
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Pilih Negara</option>
                                            {countries.map(country => (
                                                <option key={country.id} value={country.id}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Kota *
                                        </label>
                                        <select
                                            required
                                            value={formData.cityId}
                                            onChange={(e) => setFormData(prev => ({ ...prev, cityId: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            disabled={!formData.countryId}
                                        >
                                            <option value="">Pilih Kota</option>
                                            {cities.map(city => (
                                                <option key={city.id} value={city.id}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Coordinates */}
                            <div className="space-y-4">
                                <h3 className="text-md font-medium text-gray-900">Koordinat & Detail</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Latitude
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            min={-90}
                                            max={90}
                                            value={formData.lat || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                lat: e.target.value ? parseFloat(e.target.value) : undefined
                                            }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="-6.1256"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Longitude
                                        </label>
                                        <input
                                            type="number"
                                            step="any"
                                            min={-180}
                                            max={180}
                                            value={formData.lon || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                lon: e.target.value ? parseFloat(e.target.value) : undefined
                                            }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="106.6551"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Elevation (meter)
                                        </label>
                                        <input
                                            type="number"
                                            min={-500}
                                            value={formData.elevation || ''}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                elevation: e.target.value ? parseInt(e.target.value) : undefined
                                            }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="8"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Timezone
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.timezone || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Asia/Jakarta"
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-sm text-gray-700">Airport Aktif</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                        setError(null);
                                    }}
                                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                    {editingAirport ? 'Update' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AirportManagement;