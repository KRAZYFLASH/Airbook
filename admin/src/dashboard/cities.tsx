// =============================================================
// AirBook Admin — Cities Management (Simplified Version)
// =============================================================

import { useState, useEffect } from 'react';
import { Pagination, Modal } from '../components/Components';
import { CityIcon } from '../components/Icons';
import { clsx } from '../utils';

// Types
interface Country {
    id: string;
    name: string;
    code: string;
}

interface City {
    id: string;
    name: string;
    countryId: string;
    country?: Country;
    timezone: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// City Form Component
function CityForm({
    city,
    countries,
    onSubmit,
    onCancel,
    loading
}: {
    city?: City;
    countries: Country[];
    onSubmit: (data: Partial<City>) => void;
    onCancel: () => void;
    loading: boolean;
}) {
    const [formData, setFormData] = useState({
        name: city?.name || '',
        countryId: city?.countryId || '',
        isActive: city?.isActive ?? true
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'City name is required';
        }

        if (!formData.countryId) {
            newErrors.countryId = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        City Name *
                    </label>
                    <input
                        type="text"
                        className={clsx(
                            "w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
                            errors.name ? "border-red-300" : "border-slate-300"
                        )}
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter city name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country *
                    </label>
                    <select
                        className={clsx(
                            "w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
                            errors.countryId ? "border-red-300" : "border-slate-300"
                        )}
                        value={formData.countryId}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, countryId: e.target.value })}
                    >
                        <option value="">Select a country</option>
                        {countries.map(country => (
                            <option key={country.id} value={country.id}>
                                {country.name} ({country.code})
                            </option>
                        ))}
                    </select>
                    {errors.countryId && <p className="mt-1 text-sm text-red-600">{errors.countryId}</p>}
                </div>

                <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status
                    </label>
                    <select
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        value={formData.isActive ? 'active' : 'inactive'}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, isActive: e.target.value === 'active' })}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 lg:pt-6 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                    {loading ? 'Saving...' : (city ? 'Update City' : 'Create City')}
                </button>
            </div>
        </form>
    );
}

// Main Cities Manager Component
export function CitiesManager() {
    const [cities, setCities] = useState<City[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [filterCountry, setFilterCountry] = useState<string>('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCity, setEditingCity] = useState<City | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    // Fetch cities and countries
    const fetchCities = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/city');
            if (response.ok) {
                const data = await response.json();
                setCities(data);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCountries = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/country');
            if (response.ok) {
                const data = await response.json();
                setCountries(data.filter((country: Country) => country));
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    useEffect(() => {
        fetchCities();
        fetchCountries();
    }, []);

    // Filter and search logic
    const filteredCities = cities.filter(city => {
        const matchesSearch =
            city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            city.country?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            city.timezone.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'active' && city.isActive) ||
            (filterStatus === 'inactive' && !city.isActive);

        const matchesCountry =
            filterCountry === 'all' || city.countryId === filterCountry;

        return matchesSearch && matchesStatus && matchesCountry;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredCities.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCities = filteredCities.slice(startIndex, startIndex + itemsPerPage);

    // Handle form submission
    const handleFormSubmit = async (formData: Partial<City>) => {
        try {
            setFormLoading(true);
            const url = editingCity
                ? `http://localhost:3001/api/city/${editingCity.id}`
                : 'http://localhost:3001/api/city';

            const method = editingCity ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchCities();
                setIsFormOpen(false);
                setEditingCity(null);
            }
        } catch (error) {
            console.error('Error saving city:', error);
        } finally {
            setFormLoading(false);
        }
    };

    // Toggle city status
    const toggleCityStatus = async (city: City) => {
        try {
            const response = await fetch(`http://localhost:3001/api/city/${city.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...city, isActive: !city.isActive })
            });

            if (response.ok) {
                await fetchCities();
            }
        } catch (error) {
            console.error('Error toggling city status:', error);
        }
    };

    // Delete city
    const deleteCity = async (id: string, forceDelete: boolean = false) => {
        if (!forceDelete && !confirm('Are you sure you want to delete this city?')) return;

        try {
            const url = forceDelete
                ? `http://localhost:3001/api/city/${id}?force=true`
                : `http://localhost:3001/api/city/${id}`;

            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchCities();
                const result = await response.json();
                alert(result.message || 'City deleted successfully!');
            } else {
                const errorData = await response.json();

                // If deletion failed due to related records and can force delete
                if (errorData.canForceDelete && !forceDelete) {
                    const forceConfirm = confirm(
                        `${errorData.error}\n\n` +
                        `This will permanently delete:\n` +
                        `• ${errorData.relatedRecords.airports || 0} airports\n` +
                        `• ${errorData.relatedRecords.destinations || 0} destinations\n\n` +
                        `Do you want to proceed with force delete?`
                    );

                    if (forceConfirm) {
                        await deleteCity(id, true); // Recursive call with force delete
                        return;
                    }
                }

                alert(`Failed to delete city: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting city:', error);
            alert('Error deleting city. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                        <CityIcon className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Cities</h1>
                        <p className="text-sm sm:text-base text-slate-600">Manage cities and their information</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    Add City
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Search cities..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            value={filterStatus}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active Only</option>
                            <option value="inactive">Inactive Only</option>
                        </select>
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            value={filterCountry}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterCountry(e.target.value)}
                        >
                            <option value="all">All Countries</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            value={itemsPerPage.toString()}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value="8">Show: 8</option>
                            <option value="16">Show: 16</option>
                            <option value="24">Show: 24</option>
                            <option value="50">Show: 50</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Cities Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {paginatedCities.length === 0 ? (
                    <div className="p-8 lg:p-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-slate-100 flex items-center justify-center">
                                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-base lg:text-lg font-semibold text-slate-900 mb-2">No cities found</h3>
                                <p className="text-sm lg:text-base text-slate-500">No cities match your current filters.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Mobile Cards View */}
                        <div className="block lg:hidden">
                            <div className="divide-y divide-slate-200">
                                {paginatedCities.map((city) => (
                                    <div key={city.id} className="p-4 hover:bg-slate-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-medium text-slate-900">{city.name}</h3>
                                                <p className="text-sm text-slate-600">
                                                    {city.country ? `${city.country.name} (${city.country.code})` : 'N/A'}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1">{city.timezone}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleCityStatus(city)}
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${city.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {city.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => {
                                                    setEditingCity(city);
                                                    setIsFormOpen(true);
                                                }}
                                                className="flex-1 px-3 py-2 text-xs font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteCity(city.id)}
                                                className="flex-1 px-3 py-2 text-xs font-medium border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Country</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Timezone</th>
                                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                                            <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedCities.map((city) => (
                                            <tr key={city.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="py-3 px-4 font-medium text-slate-900">{city.name}</td>
                                                <td className="py-3 px-4 text-slate-600">
                                                    {city.country ? `${city.country.name} (${city.country.code})` : 'N/A'}
                                                </td>
                                                <td className="py-3 px-4 text-slate-600">{city.timezone}</td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => toggleCityStatus(city)}
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${city.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {city.isActive ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setEditingCity(city);
                                                                setIsFormOpen(true);
                                                            }}
                                                            className="px-3 py-1 text-sm border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => deleteCity(city.id)}
                                                            className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    page={currentPage}
                    pages={totalPages}
                    size={itemsPerPage}
                    total={filteredCities.length}
                    onPage={setCurrentPage}
                    onSize={(newSize: number) => {
                        setItemsPerPage(newSize);
                        setCurrentPage(1);
                    }}
                />
            )}

            {/* Form Modal */}
            {isFormOpen && (
                <Modal
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingCity(null);
                    }}
                    title={editingCity ? 'Edit City' : 'Add New City'}
                >
                    <CityForm
                        city={editingCity || undefined}
                        countries={countries}
                        onSubmit={handleFormSubmit}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setEditingCity(null);
                        }}
                        loading={formLoading}
                    />
                </Modal>
            )}
        </div>
    );
}

export default CitiesManager;