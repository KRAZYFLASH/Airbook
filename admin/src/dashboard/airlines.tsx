import { useState, useMemo, useEffect } from "react";
import type { Airline, UUID } from "../types";
import { Pagination, Modal, AddButton, Header, EmptyRow } from "../components/Components";
import { useData } from "../contexts/DataContext";
import { clsx } from "../utils";
import { DatabaseAirportService } from "../services/databaseAirportService";

interface Country {
    id: string;
    name: string;
    code: string;
}

function AirlineForm({ value, onCancel, onSubmit }: {
    value: Partial<Airline>;
    onCancel: () => void;
    onSubmit: (data: Partial<Airline>) => void;
}) {
    const [form, setForm] = useState<Partial<Airline>>(value);
    const [countries, setCountries] = useState<Country[]>([]);
    const [loading, setLoading] = useState(false);

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

        // Clean form data: remove null values and empty strings for optional fields
        const cleanedForm = {
            ...form,
            icaoCode: form.icaoCode === "" || form.icaoCode === null ? undefined : form.icaoCode,
            logo: form.logo === "" || form.logo === null ? undefined : form.logo,
            description: form.description === "" || form.description === null ? undefined : form.description,
            website: form.website === "" || form.website === null ? undefined : form.website,
        };

        console.log("🔄 Form submit (original):", form);
        console.log("🧹 Form submit (cleaned):", cleanedForm);
        onSubmit(cleanedForm);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Kode IATA
                    </label>
                    <input
                        type="text"
                        value={form.code || ""}
                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                        required
                        maxLength={3}
                        placeholder="GA, QZ, ID"
                        style={{ textTransform: 'uppercase' }}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Kode ICAO (Opsional)
                    </label>
                    <input
                        type="text"
                        value={form.icaoCode || ""}
                        onChange={(e) => setForm({ ...form, icaoCode: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                        maxLength={3}
                        placeholder="GIA, AWQ, ION"
                        style={{ textTransform: 'uppercase' }}
                    />
                </div>
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
                        {loading ? "Loading countries..." : "Pilih negara"}
                    </option>
                    {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                            {country.name} ({country.code})
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Simpan
                </button>
            </div>
        </form>
    );
}

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
    const [size, setSize] = useState(10);

    // Enhanced filter states
    const [filterCountry, setFilterCountry] = useState<string>("all");
    const [filterCodeType, setFilterCodeType] = useState<string>("all"); // all, iata-only, both-codes
    const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);

    const filtered = useMemo(() => {
        return airlines.filter((a) => {
            // Basic search filter
            const matchesSearch = [a.code, a.name, a.country?.name, a.icaoCode].some((x) =>
                x?.toLowerCase().includes(q.toLowerCase())
            );

            // Country filter
            const matchesCountry = filterCountry === "all" || a.country?.name === filterCountry;

            // Code type filter
            let matchesCodeType = true;
            if (filterCodeType === "iata-only") {
                matchesCodeType = !!a.code && !a.icaoCode;
            } else if (filterCodeType === "both-codes") {
                matchesCodeType = !!a.code && !!a.icaoCode;
            } else if (filterCodeType === "icao-only") {
                matchesCodeType = !!a.icaoCode && !a.code;
            }

            // Active filter (assuming there's an isActive field, if not we'll skip this)
            // const matchesActive = !showActiveOnly || a.isActive;

            return matchesSearch && matchesCountry && matchesCodeType;
        });
    }, [airlines, q, filterCountry, filterCodeType]);

    const paged = useMemo(() => {
        const start = (page - 1) * size;
        return filtered.slice(start, start + size);
    }, [filtered, page, size]);

    const pages = Math.max(1, Math.ceil(filtered.length / size));

    const handleCreate = (data: Partial<Airline>) => {
        createAirline(data);
        setEditing(null);
    };

    const handleUpdate = async (data: Partial<Airline>) => {
        if (!editing?.id) {
            console.error("❌ No editing ID found:", editing);
            return;
        }
        console.log("🔄 Updating airline:", editing.id, data);
        try {
            await updateAirline(editing.id, data);
            console.log("✅ Airline updated successfully");
            setEditing(null);
        } catch (error) {
            console.error("❌ Error updating airline:", error);
        }
    };

    const handleDelete = (id: UUID) => {
        if (confirm("Hapus maskapai ini?")) {
            deleteAirline(id);
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
            <Header title="Airlines" subtitle="Kelola maskapai penerbangan">
                <div className="flex items-center gap-2">
                    <input
                        value={q}
                        onChange={e => setQ(e.target.value)}
                        placeholder="Cari maskapai atau negara..."
                        className="input max-w-sm"
                    />
                    <AddButton onClick={() => setEditing({} as Airline)}>
                        Tambah Maskapai
                    </AddButton>
                </div>
            </Header>

            {/* Advanced Filters */}
            <div className="card p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">🔍 Filter Lanjutan</h3>
                    <button
                        onClick={() => {
                            setFilterCountry("all");
                            setFilterCodeType("all");
                            setShowActiveOnly(false);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Reset Filter
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Country Filter */}
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Negara</label>
                        <select
                            value={filterCountry}
                            onChange={(e) => setFilterCountry(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:border-slate-600"
                        >
                            <option value="all">Semua Negara</option>
                            {Array.from(new Map(airlines
                                .filter(a => a.country)
                                .map(airline => [airline.country!.name, airline.country!])).values())
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((country) => (
                                    <option key={country.name} value={country.name}>
                                        {country.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {/* Code Type Filter */}
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Tipe Kode</label>
                        <select
                            value={filterCodeType}
                            onChange={(e) => setFilterCodeType(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-800 dark:border-slate-600"
                        >
                            <option value="all">Semua Kode</option>
                            <option value="iata-only">Hanya IATA</option>
                            <option value="icao-only">Hanya ICAO</option>
                            <option value="both-codes">IATA + ICAO</option>
                        </select>
                    </div>

                    {/* Active Status Toggle */}
                    <div>
                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Status</label>
                        <div className="flex items-center space-x-2 py-2">
                            <input
                                type="checkbox"
                                id="showActiveOnly"
                                checked={showActiveOnly}
                                onChange={(e) => setShowActiveOnly(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="showActiveOnly" className="text-sm text-slate-700 dark:text-slate-300">
                                Hanya yang aktif
                            </label>
                        </div>
                    </div>
                </div>

                {/* Filter Results Info */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>
                        Menampilkan {filtered.length} dari {airlines.length} maskapai
                    </span>
                    {(filterCountry !== "all" || filterCodeType !== "all" || showActiveOnly) && (
                        <span className="text-blue-600 font-medium">
                            Filter aktif
                        </span>
                    )}
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur dark:bg-slate-900/90">
                            <tr className="border-b border-slate-200/30 dark:border-slate-700/30">
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Maskapai</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Kode IATA</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Kode ICAO</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Negara</th>
                                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.map((airline, index) => (
                                <tr
                                    key={airline.id}
                                    className={clsx(
                                        "group border-b border-slate-200/20 dark:border-slate-700/20 transition-all duration-200 hover:bg-white/40 dark:hover:bg-slate-800/40",
                                        index % 2 === 0 ? "bg-white/20 dark:bg-slate-800/20" : "bg-transparent"
                                    )}
                                >
                                    <td className="py-4 px-3">
                                        <div className="font-medium text-slate-900 dark:text-slate-100">
                                            {airline.name}
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-mono font-medium border border-blue-200/30 dark:border-blue-800/30">
                                            {airline.code}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3">
                                        {airline.icaoCode ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 text-sm font-mono font-medium border border-purple-200/30 dark:border-purple-800/30">
                                                {airline.icaoCode}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-sm">-</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-600 dark:text-slate-300">
                                                {airline.country?.name || 'Unknown Country'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setEditing(airline)}
                                                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                                                title="Edit airline"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(airline.id)}
                                                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                                                title="Delete airline"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paged.length === 0 && (
                                <EmptyRow colSpan={5} message="No airlines found. Add your first airline to get started." />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination page={page} pages={pages} size={size} onPage={setPage} onSize={setSize} />

            {editing && (
                <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Maskapai" : "Tambah Maskapai"}>
                    <AirlineForm
                        value={editing}
                        onCancel={() => setEditing(null)}
                        onSubmit={editing.id ? handleUpdate : handleCreate}
                    />
                </Modal>
            )}
        </section>
    );
}

export default AirlinesManager;