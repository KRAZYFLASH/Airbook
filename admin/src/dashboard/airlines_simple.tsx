// =============================================================
// Airlines Dashboard - FlightSchedule Style
// =============================================================

import { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useData } from "../contexts/DataContext";

export function AirlinesSimple() {
    const { airlines, airlinesLoading, airlinesError } = useData();
    const [q, setQ] = useState("");

    const filtered = airlines.filter((a) =>
        [a.code, a.name, a.country?.name].some((x) => x?.toLowerCase().includes(q.toLowerCase()))
    );

    const containerStyle = "min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50";

    if (airlinesLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (airlinesError) {
        return (
            <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-red-600">Error Loading Airlines</h2>
                <p className="text-red-500">{airlinesError}</p>
            </div>
        );
    }

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
                    <span className="font-medium text-slate-800">Airlines</span>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-2">Jadwal Penerbangan</h1>
                        <p className="text-slate-600">Kelola jadwal, harga, dan status</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Cari flight no / route / maskapai..."
                                className="pl-4 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80 placeholder-slate-500"
                            />
                        </div>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
                            <Plus className="w-4 h-4" />
                            Tambah Jadwal
                        </button>
                    </div>
                </div>

                {/* Airlines Table - FlightSchedule Style */}
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
                                {filtered.map((airline, index) => (
                                    <tr key={airline.id} className={`hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white/50' : 'bg-slate-50/30'}`}>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <div className="text-sm text-slate-600">{airline.name}</div>
                                                <div className="text-xs text-slate-500">{airline.code}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="inline-flex items-center px-2.5 py-1.5 bg-indigo-100 text-indigo-800 rounded-md text-sm font-mono font-bold">
                                                {airline.code}106
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1">
                                                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">
                                                        MLG
                                                    </span>
                                                    <span className="text-xs text-slate-600">Malang</span>
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
                                                BUSINESS
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
                                                <div className="font-bold text-slate-900">Rp 3.646.319</div>
                                                <div className="text-xs text-slate-500">Current: Rp 4.363.960</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm">
                                                <div className="font-medium text-slate-900">13/24</div>
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
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={10} className="py-12 text-center">
                                            <div className="text-slate-500">
                                                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
                                                </svg>
                                                <p className="text-lg font-medium mb-2">Belum ada jadwal penerbangan</p>
                                                <p className="text-sm">Tambahkan jadwal pertama untuk memulai</p>
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
}

export default AirlinesSimple;