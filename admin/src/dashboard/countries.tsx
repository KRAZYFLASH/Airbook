// =============================================================
// AirBook Admin — Countries Management
// =============================================================

import { useState, useEffect } from 'react';
import { Pagination, Modal } from '../components/Components';
import { CountryIcon } from '../components/Icons';
import { clsx } from '../utils';

// Types
interface Country {
    id: string;
    name: string;
    code: string;
    continent: string;
    currency: string;
    timezone: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Country Form Component
function CountryForm({
    country,
    onSubmit,
    onCancel,
    loading
}: {
    country?: Country;
    onSubmit: (data: Partial<Country>) => void;
    onCancel: () => void;
    loading: boolean;
}) {
    const [formData, setFormData] = useState({
        name: country?.name || '',
        code: country?.code || '',
        continent: country?.continent || '',
        isActive: country?.isActive ?? true
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Country name is required';
        }

        if (!formData.code.trim()) {
            newErrors.code = 'Country code is required';
        } else if (formData.code.length !== 2) {
            newErrors.code = 'Country code must be 2 characters';
        }

        if (!formData.continent.trim()) {
            newErrors.continent = 'Continent is required';
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country Name *
                    </label>
                    <input
                        type="text"
                        className={clsx(
                            "w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
                            errors.name ? "border-red-300" : "border-slate-300"
                        )}
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter country name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Country Code *
                    </label>
                    <input
                        type="text"
                        className={clsx(
                            "w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
                            errors.code ? "border-red-300" : "border-slate-300"
                        )}
                        value={formData.code}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="e.g., ID, US, SG"
                        maxLength={2}
                    />
                    {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Continent *
                    </label>
                    <select
                        className={clsx(
                            "w-full px-3 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200",
                            errors.continent ? "border-red-300" : "border-slate-300"
                        )}
                        value={formData.continent}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, continent: e.target.value })}
                    >
                        <option value="">Select continent</option>
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                        <option value="North America">North America</option>
                        <option value="South America">South America</option>
                        <option value="Africa">Africa</option>
                        <option value="Oceania">Oceania</option>
                        <option value="Antarctica">Antarctica</option>
                    </select>
                    {errors.continent && <p className="mt-1 text-sm text-red-600">{errors.continent}</p>}
                </div>

                <div>
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

            <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : (country ? 'Update Country' : 'Create Country')}
                </button>
            </div>
        </form>
    );
}

// Main Countries Manager Component
export function CountriesManager() {
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);

    // Fetch countries
    const fetchCountries = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/api/country');
            if (response.ok) {
                const data = await response.json();
                setCountries(data);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    // Filter and search logic
    const filteredCountries = countries.filter(country => {
        const matchesSearch =
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.timezone.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'active' && country.isActive) ||
            (filterStatus === 'inactive' && !country.isActive);

        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCountries = filteredCountries.slice(startIndex, startIndex + itemsPerPage);

    // Handle form submission
    const handleFormSubmit = async (formData: Partial<Country>) => {
        try {
            setFormLoading(true);
            const url = editingCountry
                ? `http://localhost:3001/api/country/${editingCountry.id}`
                : 'http://localhost:3001/api/country';

            const method = editingCountry ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                await fetchCountries();
                setIsFormOpen(false);
                setEditingCountry(null);
            }
        } catch (error) {
            console.error('Error saving country:', error);
        } finally {
            setFormLoading(false);
        }
    };

    // Toggle country status
    const toggleCountryStatus = async (country: Country) => {
        try {
            const response = await fetch(`http://localhost:3001/api/country/${country.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...country, isActive: !country.isActive })
            });

            if (response.ok) {
                await fetchCountries();
            }
        } catch (error) {
            console.error('Error toggling country status:', error);
        }
    };

    // Delete country
    const deleteCountry = async (id: string) => {
        if (!confirm('Are you sure you want to delete this country?')) return;

        try {
            const response = await fetch(`http://localhost:3001/api/country/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchCountries();
                alert('Country deleted successfully!');
            } else {
                const errorData = await response.json();
                alert(`Failed to delete country: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deleting country:', error);
            alert('Error deleting country. Please try again.');
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <CountryIcon />
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Countries</h1>
                        <p className="text-slate-600">Manage countries and their information</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add Country
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Search countries..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        value={filterStatus}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>
                    <select
                        className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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

            {/* Countries Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {paginatedCountries.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No countries found</h3>
                                <p className="text-slate-500">No countries match your current filters.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Code</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Continent</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Currency</th>
                                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedCountries.map((country) => (
                                    <tr key={country.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-4 font-medium text-slate-900">{country.name}</td>
                                        <td className="py-3 px-4 text-slate-600">{country.code}</td>
                                        <td className="py-3 px-4 text-slate-600">{country.continent}</td>
                                        <td className="py-3 px-4 text-slate-600">{country.currency}</td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => toggleCountryStatus(country)}
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${country.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {country.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingCountry(country);
                                                        setIsFormOpen(true);
                                                    }}
                                                    className="px-3 py-1 text-sm border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteCountry(country.id)}
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
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    page={currentPage}
                    pages={totalPages}
                    size={itemsPerPage}
                    total={filteredCountries.length}
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
                        setEditingCountry(null);
                    }}
                    title={editingCountry ? 'Edit Country' : 'Add New Country'}
                >
                    <CountryForm
                        country={editingCountry || undefined}
                        onSubmit={handleFormSubmit}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setEditingCountry(null);
                        }}
                        loading={formLoading}
                    />
                </Modal>
            )}
        </div>
    );
}

export default CountriesManager;