// =============================================================
// Database Airports Dashboard - FlightSchedule Style
// =============================================================

import { useState, useEffect, useMemo } from 'react';
import { DatabaseAirportService, type DatabaseAirport } from '../services/databaseAirportService';
import { Edit, Trash2 } from 'lucide-react';
import { AddButton, Header, Pagination } from '../components/UI';
import { clsx } from "../utils";

export function DatabaseAirportsStyled() {
    // States
    const [airports, setAirports] = useState<DatabaseAirport[]>([]);
    const [filteredAirports, setFilteredAirports] = useState<DatabaseAirport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'indonesian' | 'regional' | 'international'>('all');

    // Pagination states
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(8);

    // Load data
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

    // Filter and search logic
    useEffect(() => {
        let filtered = airports;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(airport =>
                airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (airport.iataCode && airport.iataCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (airport.icaoCode && airport.icaoCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
                airport.city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                airport.city.country.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (selectedFilter !== 'all') {
            switch (selectedFilter) {
                case 'indonesian':
                    filtered = filtered.filter(airport => airport.city.country.code === 'ID');
                    break;
                case 'regional':
                    filtered = filtered.filter(airport =>
                        ['SG', 'MY', 'TH', 'PH', 'VN', 'KH', 'LA', 'MM', 'BN'].includes(airport.city.country.code)
                    );
                    break;
                case 'international':
                    filtered = filtered.filter(airport =>
                        !['ID', 'SG', 'MY', 'TH', 'PH', 'VN', 'KH', 'LA', 'MM', 'BN'].includes(airport.city.country.code)
                    );
                    break;
            }
        }

        setFilteredAirports(filtered);
        setPage(1); // Reset to first page when filters change
    }, [airports, searchTerm, selectedFilter]);

    // Pagination logic
    const paged = useMemo(() => {
        const start = (page - 1) * size;
        return filteredAirports.slice(start, start + size);
    }, [filteredAirports, page, size]);

    const pages = Math.max(1, Math.ceil(filteredAirports.length / size));
    useEffect(() => {
        if (page > pages) setPage(1);
    }, [page, pages]);

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
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <section className="space-y-3">
            <Header title="Airports" subtitle="Kelola data bandara">
                <div className="flex items-center gap-2">
                    <select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value as 'all' | 'indonesian' | 'regional' | 'international')}
                        className="input max-w-xs"
                    >
                        <option value="all">Semua Bandara</option>
                        <option value="indonesian">Indonesia</option>
                        <option value="regional">Asia Tenggara</option>
                        <option value="international">Internasional</option>
                    </select>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Cari nama / kode bandara / kota..."
                        className="input max-w-sm"
                    />
                    <AddButton>
                        Tambah Bandara
                    </AddButton>
                </div>
            </Header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card p-4">
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{filteredAirports.length}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Total Bandara</div>
                </div>
                <div className="card p-4">
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {new Set(filteredAirports.map(a => a.city.id)).size}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Kota</div>
                </div>
                <div className="card p-4">
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {new Set(filteredAirports.map(a => a.city.country.id)).size}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Negara</div>
                </div>
                <div className="card p-4">
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {filteredAirports.filter(a => a.city.country.code === 'ID').length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Indonesia</div>
                </div>
            </div>

            {/* Airports Table - FlightSchedule Style */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur dark:bg-slate-900/90">
                            <tr className="border-b border-slate-200/30 dark:border-slate-700/30">
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Bandara</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Kode</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Lokasi</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Negara</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Timezone</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.map((airport, index) => (
                                <tr key={airport.id} className={clsx(
                                    "group border-b border-slate-200/20 dark:border-slate-700/20 transition-all duration-200 hover:bg-white/40 dark:hover:bg-slate-800/40",
                                    index % 2 === 0 ? "bg-white/20 dark:bg-slate-800/20" : "bg-transparent"
                                )}>
                                    <td className="py-4 px-3">
                                        <div className="flex flex-col">
                                            <div className="font-medium text-slate-900 dark:text-slate-100">{airport.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{airport.city.name}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex flex-col gap-1">
                                            <div className="inline-flex items-center px-2.5 py-1 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-mono font-bold w-fit rounded-lg border border-purple-200/30 dark:border-purple-800/30">
                                                {airport.iataCode || 'N/A'}
                                            </div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{airport.icaoCode || 'N/A'}</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            <div>{airport.city.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">City</div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-flex items-center px-2 py-1 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-md">
                                                {airport.city.country.code}
                                            </span>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">{airport.city.country.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                                            {airport.timezone || 'UTC+0'}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paged.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center bg-white/20 dark:bg-slate-800/20">
                                        <div className="text-slate-500">
                                            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <p className="text-lg font-medium mb-2">
                                                {searchTerm || selectedFilter !== 'all' ? 'Tidak ada bandara yang sesuai' : 'Belum ada bandara'}
                                            </p>
                                            <p className="text-sm">
                                                {searchTerm || selectedFilter !== 'all' ? 'Coba ubah filter atau kata kunci pencarian' : 'Tambahkan bandara pertama untuk memulai'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div className="border-t border-slate-200/30 dark:border-slate-700/30 bg-white/90 backdrop-blur dark:bg-slate-900/90 px-6 py-4">
                        <Pagination
                            page={page}
                            pages={pages}
                            size={size}
                            onPage={setPage}
                            onSize={setSize}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

export default DatabaseAirportsStyled;