import { useState, useEffect, useMemo } from 'react';
import { DatabaseAirportService, type DatabaseAirport } from '../services/databaseAirportService';
import { AddButton, Header, Pagination, Modal, EmptyRow } from '../components/Components';
import { clsx } from "../utils";

interface AirportFormData {
    name: string;
    iataCode: string;
    icaoCode: string;
    cityId: string;
    countryId: string;
    timezone: string;
    isActive: boolean;
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

function AirportForm({ value, onCancel, onSubmit }: {
    value: Partial<DatabaseAirport>;
    onCancel: () => void;
    onSubmit: (data: AirportFormData) => void;
}) {
    const [countries, setCountries] = useState<Country[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [formData, setFormData] = useState<AirportFormData>({
        name: value.name || '',
        iataCode: value.iataCode || '',
        icaoCode: value.icaoCode || '',
        cityId: value.city?.id || '',
        countryId: value.city?.country?.id || '',
        timezone: value.timezone || 'UTC+0',
        isActive: true
    });
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/db-airports/dropdown/countries');
                const result = await response.json();
                if (result.success) {
                    setCountries(result.data);
                }
            } catch (err) {
                console.error('Error loading countries:', err);
            }
        };
        loadDropdownData();
    }, []);

    useEffect(() => {
        const loadCitiesByCountry = async (countryId: string) => {
            if (!countryId) {
                setCities([]);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3001/api/db-airports/dropdown/cities/${countryId}`);
                const result = await response.json();
                if (result.success) {
                    setCities(result.data);
                }
            } catch (err) {
                console.error('Error loading cities:', err);
            }
        };

        if (formData.countryId) {
            loadCitiesByCountry(formData.countryId);
        }
    }, [formData.countryId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Airport Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Soekarno-Hatta International Airport"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        IATA Code
                    </label>
                    <input
                        type="text"
                        value={formData.iataCode}
                        onChange={(e) => setFormData({ ...formData, iataCode: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={3}
                        placeholder="CGK"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        ICAO Code
                    </label>
                    <input
                        type="text"
                        value={formData.icaoCode}
                        onChange={(e) => setFormData({ ...formData, icaoCode: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={4}
                        placeholder="WIII"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Country *
                    </label>
                    <select
                        value={formData.countryId}
                        onChange={(e) => setFormData({ ...formData, countryId: e.target.value, cityId: '' })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    >
                        <option value="">Select country</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name} ({country.code})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        City *
                    </label>
                    <select
                        value={formData.cityId}
                        onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        disabled={!formData.countryId}
                    >
                        <option value="">Select city</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    disabled={formLoading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={formLoading}
                >
                    {formLoading ? 'Saving...' : 'Save Airport'}
                </button>
            </div>
        </form>
    );
}

export function AirportsManager() {
    const [airports, setAirports] = useState<DatabaseAirport[]>([]);
    const [filteredAirports, setFilteredAirports] = useState<DatabaseAirport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'indonesian' | 'regional' | 'international'>('all');
    const [showModal, setShowModal] = useState(false);
    const [editingAirport, setEditingAirport] = useState<DatabaseAirport | null>(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    useEffect(() => {
        loadAirports();
    }, []);

    const loadAirports = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await DatabaseAirportService.getAllAirports();
            setAirports(response);
            setFilteredAirports(response);
        } catch (err) {
            console.error('Error loading airports:', err);
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = airports;

        if (searchTerm) {
            filtered = filtered.filter(airport =>
                airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                airport.iataCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                airport.icaoCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                airport.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                airport.city.country.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedFilter !== 'all') {
            filtered = filtered.filter(airport => {
                switch (selectedFilter) {
                    case 'indonesian':
                        return airport.city.country.code === 'ID';
                    case 'regional':
                        return ['MY', 'SG', 'TH', 'VN', 'PH'].includes(airport.city.country.code);
                    case 'international':
                        return !['ID', 'MY', 'SG', 'TH', 'VN', 'PH'].includes(airport.city.country.code);
                    default:
                        return true;
                }
            });
        }

        setFilteredAirports(filtered);
        setPage(1);
    }, [airports, searchTerm, selectedFilter]);

    const paginatedAirports = useMemo(() => {
        const startIndex = (page - 1) * size;
        return filteredAirports.slice(startIndex, startIndex + size);
    }, [filteredAirports, page, size]);

    const totalPages = Math.ceil(filteredAirports.length / size);

    const handleAddAirport = () => {
        setEditingAirport(null);
        setShowModal(true);
    };

    const handleEditAirport = (airport: DatabaseAirport) => {
        setEditingAirport(airport);
        setShowModal(true);
    };

    const handleDeleteAirport = async (airport: DatabaseAirport) => {
        if (confirm(`Are you sure you want to delete ${airport.name}?`)) {
            try {
                await DatabaseAirportService.deleteAirport(airport.id);
                await loadAirports();
            } catch (err) {
                console.error('Error deleting airport:', err);
                alert('Failed to delete airport');
            }
        }
    };

    const handleSubmitForm = async (formData: AirportFormData) => {
        try {
            if (editingAirport) {
                await fetch(`http://localhost:3001/api/db-airports/${editingAirport.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                await fetch('http://localhost:3001/api/db-airports', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }
            setShowModal(false);
            await loadAirports();
        } catch (err) {
            console.error('Error saving airport:', err);
            alert('Failed to save airport');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-red-600">Error Loading Airports</h2>
                <p className="text-red-500">{error}</p>
                <button
                    onClick={loadAirports}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <section className="space-y-3">
            <Header title="Airports" subtitle="Kelola bandara dan lokasi">
                <div className="flex items-center gap-2">
                    <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Cari bandara, kode, atau kota..."
                        className="input max-w-sm"
                    />
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'indonesian' | 'regional' | 'international')}
                        className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="all">All Airports</option>
                        <option value="indonesian">Indonesian</option>
                        <option value="regional">Regional</option>
                        <option value="international">International</option>
                    </select>
                    <AddButton onClick={handleAddAirport}>
                        Tambah Bandara
                    </AddButton>
                </div>
            </Header>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur dark:bg-slate-900/90">
                            <tr className="border-b border-slate-200/30 dark:border-slate-700/30">
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Bandara</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Kode</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Lokasi</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Timezone</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedAirports.map((airport, index) => (
                                <tr
                                    key={airport.id}
                                    className={clsx(
                                        "group border-b border-slate-200/20 dark:border-slate-700/20 transition-all duration-200 hover:bg-white/40 dark:hover:bg-slate-800/40",
                                        index % 2 === 0 ? "bg-white/20 dark:bg-slate-800/20" : "bg-transparent"
                                    )}
                                >
                                    <td className="py-4 px-3">
                                        <div className="font-medium text-slate-900 dark:text-slate-100">
                                            {airport.name}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center gap-2">
                                            {airport.iataCode && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-mono font-medium border border-blue-200/30 dark:border-blue-800/30">
                                                    {airport.iataCode}
                                                </span>
                                            )}
                                            {airport.icaoCode && (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 text-sm font-mono font-medium border border-purple-200/30 dark:border-purple-800/30">
                                                    {airport.icaoCode}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
                                                {airport.city.country.code}
                                            </span>
                                            <span className="text-slate-600 dark:text-slate-300">
                                                {airport.city.name}, {airport.city.country.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <span className="text-slate-600 dark:text-slate-300 text-sm">
                                            {airport.timezone || '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEditAirport(airport)}
                                                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                                                title="Edit airport"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAirport(airport)}
                                                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                                                title="Delete airport"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginatedAirports.length === 0 && (
                                <EmptyRow colSpan={5} message="No airports found. Add your first airport to get started." />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination page={page} pages={totalPages} size={size} onPage={setPage} onSize={setSize} />

            {showModal && (
                <Modal
                    onClose={() => setShowModal(false)}
                    title={editingAirport ? "Edit Airport" : "Add New Airport"}
                >
                    <AirportForm
                        value={editingAirport || {}}
                        onCancel={() => setShowModal(false)}
                        onSubmit={handleSubmitForm}
                    />
                </Modal>
            )}
        </section>
    );
}

export default AirportsManager;