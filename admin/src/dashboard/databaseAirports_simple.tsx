// =============================================================
// Database Airports Dashboard - Simple Version
// =============================================================

import { useState, useEffect } from 'react';
import { DatabaseAirportService, type DatabaseAirport } from '../services/databaseAirportService';
import { Plane, Edit, Trash2, Plus } from 'lucide-react';

const DatabaseAirportsSimple = () => {
    const [airports, setAirports] = useState<DatabaseAirport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAirports();
    }, []);

    const loadAirports = async () => {
        try {
            setLoading(true);
            const data = await DatabaseAirportService.getAllAirports();
            setAirports(data);
        } catch (error) {
            console.error('Failed to load airports:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const containerStyle = "min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50";

    return (
        <div className={containerStyle}>
            <div className="p-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    </svg>
                    <span>AirBook Admin</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="font-medium text-slate-800">Airports</span>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Daftar Bandara</h1>
                        <p className="text-slate-600">Kelola bandara, kode, dan kota</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                placeholder="Cari airport no / nama / kota..."
                                className="pl-4 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80 placeholder-slate-500"
                            />
                        </div>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
                            <Plus className="w-4 h-4" />
                            Tambah Bandara
                        </button>
                    </div>
                </div>

                {/* Airports Table */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Maskapai</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Flight</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Route</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Kelas</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Berangkat</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Tiba</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Harga</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Seat</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-700">Status</th>
                                    <th className="text-right py-4 px-6 text-sm font-medium text-slate-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {airports.map((airport, index) => (
                                    <tr key={airport.id} className={`hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white/50' : 'bg-slate-50/30'}`}>
                                        <td className="py-4 px-6">
                                            <div className="flex items-start gap-3">
                                                <div className="text-sm text-slate-600">{airport.name}</div>
                                                <div className="text-xs text-slate-500">ID: {airport.id.slice(-8)}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="inline-flex items-center px-2.5 py-1.5 bg-indigo-100 text-indigo-800 rounded-md text-sm font-mono font-bold">
                                                {airport.iataCode}107
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
                                                        {airport.iataCode}
                                                    </span>
                                                    <span className="text-xs text-slate-600">{airport.city.name}</span>
                                                </div>
                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                                <div className="flex items-center gap-1">
                                                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                                                        CGK
                                                    </span>
                                                    <span className="text-xs text-slate-600">Jakarta</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="inline-flex items-center px-2.5 py-1.5 bg-purple-100 text-purple-800 rounded-md text-sm font-medium">
                                                FIRST
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm">
                                                <div className="font-medium text-slate-900">10/21/2025</div>
                                                <div className="text-xs text-slate-500">10:39:00 AM</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm">
                                                <div className="font-medium text-slate-900">10/21/2025</div>
                                                <div className="text-xs text-slate-500">12:09:00 PM</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm">
                                                <div className="font-bold text-slate-900">Rp 8.869.475</div>
                                                <div className="text-xs text-slate-500">Current: Rp 9.412.427</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm">
                                                <div className="font-medium text-slate-900">3/5</div>
                                                <div className="text-xs text-slate-500">Available</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <span className="text-sm font-medium text-green-700">SCHEDULED</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
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
                                {airports.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="py-12 text-center">
                                            <div className="text-slate-500">
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
            </div>
        </div>
    );
};

export default DatabaseAirportsSimple;