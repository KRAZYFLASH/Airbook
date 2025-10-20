// =============================================================
// AirBook Admin — Airlines Manager (FlightSchedule Style)
// =============================================================

import { useState, useMemo, useEffect } from "react";
import type { Airline, UUID, SortDir } from "../types";
import { Pagination, Modal, AddButton, Header } from "../components/UI";
import { useData } from "../contexts/DataContext";
import { Edit, Trash2 } from 'lucide-react';
import { clsx } from "../utils";
import { DatabaseAirportService, type Country } from "../services/databaseAirportService";

// ---------------------------------------------------------------------
// AirlineForm Component
// ---------------------------------------------------------------------
function AirlineForm({
    value,
    onCancel,
    onSubmit,
}: {
    value: Partial<Airline>;
    onCancel: () => void;
    onSubmit: (data: Partial<Airline>) => void;
}) {
    const [form, setForm] = useState<Partial<Airline>>(value);
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(false);

    // Load countries on component mount
    useEffect(() => {
        const loadCountries = async () => {
            try {
                setLoading(true);
                const countriesData = await DatabaseAirportService.getAllCountries();
                setCountries(countriesData);
            } catch (error) {
                console.error("Error loading countries:", error);
            } finally {
                setLoading(false);
            }
        };
        loadCountries();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kode IATA
                </label>
                <input
                    type="text"
                    value={form.code || ""}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={3}
                    placeholder="GA, QZ, ID"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Kode ICAO (Opsional)
                </label>
                <input
                    type="text"
                    value={form.icaoCode || ""}
                    onChange={(e) => setForm({ ...form, icaoCode: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={3}
                    placeholder="GIA, AWQ, ION"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nama Maskapai
                </label>
                <input
                    type="text"
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder="Garuda Indonesia"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Negara
                </label>
                <select
                    value={form.countryId || ""}
                    onChange={(e) => setForm({ ...form, countryId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                >
                    <option value="">
                        {loading ? "Memuat negara..." : "Pilih negara"}
                    </option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.code} - {country.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={loading}
                >
                    Simpan
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
                >
                    Batal
                </button>
            </div>
        </form>
    );
}

// ---------------------------------------------------------------------
// AirlinesManager with FlightSchedule Style
// ---------------------------------------------------------------------
export function AirlinesManager() {
    const {
        airlines,
        airlinesLoading,
        airlinesError,
        createAirline,
        updateAirline,
        deleteAirline
    } = useData();

    const [q, setQ] = useState("");
    const [editing, setEditing] = useState<Airline | null>(null);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(8);
    const [sortKey] = useState<keyof Airline>("name");
    const [dir] = useState<SortDir>("asc");

    const filtered = useMemo(() => {
        const f = airlines.filter((a) =>
            [a.code, a.name, a.country?.name].some((x) => x?.toLowerCase().includes(q.toLowerCase()))
        );
        const s = [...f].sort((a, b) => {
            const va = String(a[sortKey] ?? "").toLowerCase();
            const vb = String(b[sortKey] ?? "").toLowerCase();
            return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
        });
        return s;
    }, [airlines, q, sortKey, dir]);

    const paged = useMemo(() => {
        const start = (page - 1) * size;
        return filtered.slice(start, start + size);
    }, [filtered, page, size]);

    const pages = Math.max(1, Math.ceil(filtered.length / size));
    useEffect(() => {
        if (page > pages) setPage(1);
    }, [page, pages]);

    const handleSave = async (data: Partial<Airline>) => {
        try {
            if (editing?.id) {
                await updateAirline(editing.id, data);
            } else {
                await createAirline(data);
            }
            setEditing(null);
        } catch (err) {
            console.error("Save failed:", err);
        }
    };

    const handleDelete = async (id: UUID) => {
        if (confirm("Hapus maskapai ini?")) {
            try {
                await deleteAirline(id);
            } catch (err) {
                console.error("Delete failed:", err);
            }
        }
    };

    if (airlinesLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
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
        <section className="space-y-3">
            <Header title="Airlines" subtitle="Kelola data maskapai penerbangan">
                <div className="flex items-center gap-2">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Cari kode / nama maskapai..."
                        className="input max-w-sm"
                    />
                    <AddButton onClick={() => setEditing({} as Airline)}>
                        Tambah Maskapai
                    </AddButton>
                </div>
            </Header>

            {/* Airlines Table - FlightSchedule Style */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur dark:bg-slate-900/90">
                            <tr className="border-b border-slate-200/30 dark:border-slate-700/30">
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Kode IATA</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Nama Maskapai</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Negara</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Kode ICAO</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.map((airline, index) => (
                                <tr key={airline.id} className={clsx(
                                    "group border-b border-slate-200/20 dark:border-slate-700/20 transition-all duration-200 hover:bg-white/40 dark:hover:bg-slate-800/40",
                                    index % 2 === 0 ? "bg-white/20 dark:bg-slate-800/20" : "bg-transparent"
                                )}>
                                    <td className="py-4 px-3">
                                        <div className="inline-flex items-center px-2.5 py-1.5 bg-indigo-100 text-indigo-800 rounded-md text-sm font-mono font-bold">
                                            {airline.code}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="font-medium text-slate-900 dark:text-slate-100">
                                            {airline.name}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            {airline.country?.name || "-"}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                                            {airline.icaoCode || "-"}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setEditing(airline)}
                                                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(airline.id)}
                                                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paged.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center bg-white/20 dark:bg-slate-800/20">
                                        <div className="text-slate-500">
                                            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
                                            </svg>
                                            <p className="text-lg font-medium mb-2">
                                                {q ? `Tidak ada maskapai dengan "${q}"` : "Belum ada maskapai"}
                                            </p>
                                            <p className="text-sm">
                                                {q ? "Coba kata kunci lain" : "Tambahkan maskapai pertama untuk memulai"}
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

            {/* Modal untuk Edit/Tambah */}
            {editing && (
                <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Maskapai" : "Tambah Maskapai"}>
                    <AirlineForm
                        value={editing}
                        onCancel={() => setEditing(null)}
                        onSubmit={(v) => handleSave(v)}
                    />
                </Modal>
            )}
        </section>
    );
}

export default AirlinesManager;