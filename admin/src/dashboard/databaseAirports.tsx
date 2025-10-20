// =============================================================
// Database Airports Dashboard - Modern CRUD Interface
// =============================================================

import { useState, useEffect } from 'react';
import { DatabaseAirportService, type DatabaseAirport } from '../services/databaseAirportService';
import { AirportModal } from '../components/AirportModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import {
    AlertTriangle,
    Search,
    Plane,
    Globe,
    MapPin,
    Users,
    Plus,
    Edit,
    Trash2,
    Filter,
    RefreshCw,
    Download,
} from 'lucide-react';

const DatabaseAirportsPage = () => {
    // States
    const [airports, setAirports] = useState<DatabaseAirport[]>([]);
    const [filteredAirports, setFilteredAirports] = useState<DatabaseAirport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'indonesian' | 'regional' | 'international'>('all');
    const [stats, setStats] = useState<{
        totalAirports: number;
        totalCities: number;
        totalCountries: number;
        topCountries: Array<{
            country: { id: string; name: string; code: string };
            airportCount: number;
        }>;
    } | null>(null);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedAirport, setSelectedAirport] = useState<DatabaseAirport | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [airportToDelete, setAirportToDelete] = useState<DatabaseAirport | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Load data
    useEffect(() => {
        loadData();
        loadStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filter airports when search or filter changes
    useEffect(() => {
        if (!loading) {
            filterAirports();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [airports, searchTerm, selectedFilter, loading]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            let data: DatabaseAirport[] = [];

            switch (selectedFilter) {
                case 'indonesian':
                    data = await DatabaseAirportService.getIndonesianAirports();
                    break;
                case 'regional':
                    data = await DatabaseAirportService.getRegionalAirports();
                    break;
                case 'international':
                    data = await DatabaseAirportService.getInternationalAirports();
                    break;
                default:
                    data = await DatabaseAirportService.getAllAirports();
            }

            setAirports(data);
        } catch (err) {
            console.error('Error loading airports:', err);
            setError(err instanceof Error ? err.message : 'Failed to load airports');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await DatabaseAirportService.getAirportStats();
            setStats(statsData);
        } catch (err) {
            console.error('Error loading stats:', err);
        }
    };

    const filterAirports = () => {
        let filtered = airports;

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase();
            filtered = airports.filter(airport =>
                airport.name.toLowerCase().includes(search) ||
                airport.iataCode?.toLowerCase().includes(search) ||
                airport.icaoCode?.toLowerCase().includes(search) ||
                airport.city.name.toLowerCase().includes(search) ||
                airport.city.country.name.toLowerCase().includes(search)
            );
        }

        setFilteredAirports(filtered);
    };

    const handleFilterChange = (filter: typeof selectedFilter) => {
        setSelectedFilter(filter);
    };

    // Re-load data when filter changes
    useEffect(() => {
        if (!loading) {
            loadData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilter]);

    const handleSearch = async () => {
        if (searchTerm.trim()) {
            try {
                setLoading(true);
                const results = await DatabaseAirportService.searchAirports(searchTerm);
                setAirports(results);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Search failed');
            } finally {
                setLoading(false);
            }
        } else {
            loadData();
        }
    };

    // CRUD Functions
    const handleCreateAirport = () => {
        setModalMode('create');
        setSelectedAirport(null);
        setIsModalOpen(true);
    };

    const handleEditAirport = (airport: DatabaseAirport) => {
        setModalMode('edit');
        setSelectedAirport(airport);
        setIsModalOpen(true);
    };

    const handleDeleteAirport = (airport: DatabaseAirport) => {
        setAirportToDelete(airport);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!airportToDelete) return;

        try {
            setIsDeleting(true);
            await DatabaseAirportService.deleteAirport(airportToDelete.id);

            // Refresh data
            await loadData();
            await loadStats();

            setIsDeleteModalOpen(false);
            setAirportToDelete(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete airport');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleModalSave = async () => {
        // Refresh data after save
        await loadData();
        await loadStats();
    };

    const handleRefresh = () => {
        setSearchTerm('');
        setSelectedFilter('all');
        loadData();
        loadStats();
    };

    const handleExportData = () => {
        // Create CSV content
        const headers = ['Name', 'IATA Code', 'ICAO Code', 'City', 'Country', 'Country Code', 'Timezone'];
        const csvContent = [
            headers.join(','),
            ...filteredAirports.map(airport => [
                `"${airport.name}"`,
                airport.iataCode || '',
                airport.icaoCode || '',
                `"${airport.city.name}"`,
                `"${airport.city.country.name}"`,
                airport.city.country.code,
                airport.timezone || ''
            ].join(','))
        ].join('\n');

        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `airports-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading airports data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z" />
                </svg>
                <span>AirBook Admin</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-medium text-slate-800 dark:text-slate-200">Airports</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Daftar Bandara</h1>
                    <p className="text-slate-600 dark:text-slate-400">Kelola bandara, kode, dan kota</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari airport no / nama / kota..."
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                        />
                    </div>
                    <button
                        onClick={handleCreateAirport}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Bandara
                    </button>
                </div>
            </div>



            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                        <span className="text-red-800">{error}</span>
                    </div>
                </div>
            )}

            {/* Airports Table */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-600 dark:text-slate-400">Bandara</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-600 dark:text-slate-400">Kode</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-600 dark:text-slate-400">Kelas</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-600 dark:text-slate-400">Lokasi</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-600 dark:text-slate-400">Negara</th>
                                <th className="text-left py-4 px-6 text-sm font-medium text-slate-600 dark:text-slate-400">Timezone</th>
                                <th className="text-right py-4 px-6 text-sm font-medium text-slate-600 dark:text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAirports.map((airport) => (
                                <tr key={airport.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                <Plane className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-slate-100">{airport.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">ID: {airport.id.slice(-8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex gap-2">
                                            <div className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-sm font-mono font-bold">
                                                {airport.iataCode || 'N/A'}
                                            </div>
                                            {airport.icaoCode && (
                                                <div className="inline-flex items-center px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 rounded-md text-sm font-mono">
                                                    {airport.icaoCode}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="inline-flex items-center px-2.5 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm font-medium">
                                            DOMESTIC
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-slate-400" />
                                            <span className="text-slate-700 dark:text-slate-300">{airport.city.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-slate-700 dark:text-slate-300">{airport.city.country.name}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">
                                            {airport.timezone || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEditAirport(airport)}
                                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="Edit airport"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAirport(airport)}
                                                className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                title="Delete airport"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredAirports.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center">
                                        <div className="text-slate-500 dark:text-slate-400">
                                            <Plane className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg font-medium mb-2">Belum ada bandara</p>
                                            <p className="text-sm">Tambahkan bandara pertama untuk memulai</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Airport
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Codes
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Country
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Timezone
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {filteredAirports.map((airport) => (
                            <tr key={airport.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                            <Plane className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {airport.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                            {airport.iataCode || 'N/A'}
                                        </span>
                                        {airport.icaoCode && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                                                {airport.icaoCode}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm font-medium text-gray-900">{airport.city.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <Globe className="h-4 w-4 text-gray-400 mr-2" />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{airport.city.country.name}</div>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800 mt-1">
                                                {airport.city.country.code}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {airport.timezone || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditAirport(airport)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                            title="Edit Airport"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAirport(airport)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                            title="Delete Airport"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div >
    </div >
  );
};

export default DatabaseAirportsPage;