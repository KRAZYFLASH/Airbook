// =============================================================
// Airport Modal Component - Modern CRUD Interface
// =============================================================

import { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';
import { DatabaseAirportService, type DatabaseAirport } from '../services/databaseAirportService';

interface AirportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    airport?: DatabaseAirport | null;
    mode: 'create' | 'edit';
}

interface Country {
    id: string;
    name: string;
    code: string;
}

interface City {
    id: string;
    name: string;
}

export const AirportModal = ({ isOpen, onClose, onSave, airport, mode }: AirportModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        iataCode: '',
        icaoCode: '',
        cityId: '',
        timezone: '',
    });

    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCountryId, setSelectedCountryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load initial data
    useEffect(() => {
        if (isOpen) {
            loadCountries();
            if (airport && mode === 'edit') {
                setFormData({
                    name: airport.name,
                    iataCode: airport.iataCode || '',
                    icaoCode: airport.icaoCode || '',
                    cityId: airport.city.id,
                    timezone: airport.timezone || '',
                });
                setSelectedCountryId(airport.city.country.id);
                loadCities(airport.city.country.id);
            } else {
                resetForm();
            }
        }
    }, [isOpen, airport, mode]);

    const loadCountries = async () => {
        try {
            setLoading(true);
            const countriesData = await DatabaseAirportService.getAllCountries();
            setCountries(countriesData);
        } catch {
            setError('Failed to load countries');
        } finally {
            setLoading(false);
        }
    };

    const loadCities = async (countryId: string) => {
        try {
            const citiesData = await DatabaseAirportService.getCitiesByCountry(countryId);
            setCities(citiesData);
        } catch {
            setError('Failed to load cities');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            iataCode: '',
            icaoCode: '',
            cityId: '',
            timezone: '',
        });
        setSelectedCountryId('');
        setCities([]);
        setError(null);
    };

    const handleCountryChange = (countryId: string) => {
        setSelectedCountryId(countryId);
        setFormData(prev => ({ ...prev, cityId: '' }));
        if (countryId) {
            loadCities(countryId);
        } else {
            setCities([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.cityId) {
            setError('Name and city are required');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            if (mode === 'create') {
                await DatabaseAirportService.createAirport(formData);
            } else if (airport) {
                await DatabaseAirportService.updateAirport(airport.id, formData);
            }

            onSave();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save airport');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === 'create' ? 'Add New Airport' : 'Edit Airport'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                            <span className="text-red-800">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Airport Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Airport Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter airport name"
                                required
                            />
                        </div>

                        {/* Airport Codes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    IATA Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.iataCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, iataCode: e.target.value.toUpperCase() }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., CGK"
                                    maxLength={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    ICAO Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.icaoCode}
                                    onChange={(e) => setFormData(prev => ({ ...prev, icaoCode: e.target.value.toUpperCase() }))}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., WIII"
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        {/* Country Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Country *
                            </label>
                            <select
                                value={selectedCountryId}
                                onChange={(e) => handleCountryChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                                disabled={loading}
                            >
                                <option value="">Select a country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>
                                        {country.name} ({country.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* City Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                City *
                            </label>
                            <select
                                value={formData.cityId}
                                onChange={(e) => setFormData(prev => ({ ...prev, cityId: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                required
                                disabled={!selectedCountryId || cities.length === 0}
                            >
                                <option value="">Select a city</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            {selectedCountryId && cities.length === 0 && (
                                <p className="mt-2 text-sm text-gray-500">No cities available for selected country</p>
                            )}
                        </div>

                        {/* Timezone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Timezone
                            </label>
                            <input
                                type="text"
                                value={formData.timezone}
                                onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="e.g., Asia/Jakarta"
                            />
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors font-medium"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || loading}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                {mode === 'create' ? 'Create Airport' : 'Update Airport'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};