// =============================================================
// AirBook Admin — Airlines Manager (Database Connected)
// =============================================================

import { useState, useMemo, useEffect, useRef } from "react";
import type { Airline, UUID, SortDir } from "../types";
import { clsx } from "../utils";
import { Pagination, Modal } from "../components/UI";
import { useData } from "../contexts/DataContext";

// ---------------------------------------------------------------------
// AirlinesManager
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

  const handleSave = async (input: Partial<Airline>) => {
    if (!input.code || !input.name || !input.countryId) {
      alert("Code, Name, Country wajib diisi");
      return;
    }

    try {
      if (editing && editing.id) {
        // Clean up empty strings for update
        const cleanedInput = {
          ...input,
          logo: input.logo?.trim() || undefined,
          website: input.website?.trim() || undefined,
          icaoCode: input.icaoCode?.trim() || undefined,
          description: input.description?.trim() || undefined,
        };
        await updateAirline(editing.id, cleanedInput);
        setEditing(null);
      } else {
        // Clean up empty strings for create
        const newAirlineData = {
          code: input.code!,
          name: input.name!,
          countryId: input.countryId!,
          icaoCode: input.icaoCode?.trim() || undefined,
          logo: input.logo?.trim() || undefined,
          description: input.description?.trim() || undefined,
          website: input.website?.trim() || undefined,
          isActive: input.isActive ?? true,
        };
        await createAirline(newAirlineData);
        setEditing(null);
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: UUID) => {
    if (!confirm("Yakin ingin menghapus maskapai ini?")) return;

    try {
      await deleteAirline(id);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };



  // Show loading state
  if (airlinesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error state
  if (airlinesError) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Airlines</h2>
        <p className="text-red-500">{airlinesError}</p>
      </div>
    );
  }

  const containerStyle = "min-h-screen" + " " + "bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50";

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
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Daftar Maskapai</h1>
            <p className="text-slate-600">Kelola maskapai, harga, dan status</p>
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
            <button
              onClick={() =>
                setEditing({
                  id: "",
                  code: "",
                  name: "",
                  countryId: "",
                  icaoCode: "",
                  logo: "",
                  description: "",
                  website: "",
                  isActive: true,
                  createdAt: "",
                  updatedAt: "",
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah Maskapai
            </button>
          </div>
        </div>

        {/* Airlines Table */}
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
                {paged.map((airline, index) => (
                  <tr key={airline.id} className={`hover:bg-blue-50/30 transition-colors ${index % 2 === 0 ? 'bg-white/50' : 'bg-slate-50/30'}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3">
                        <div className="text-sm text-slate-600">{airline.name}</div>
                        <div className="text-xs text-slate-500">ID: {airline.code}</div>
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
                        <button
                          onClick={() => setEditing(airline)}
                          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit airline"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(airline.id)}
                          className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                  <tr>
                    <td colSpan={10} className="py-12 text-center">
                      <div className="text-slate-500">
                        <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
                        </svg>
                        <p className="text-lg font-medium mb-2">Belum ada maskapai</p>
                        <p className="text-sm">Tambahkan maskapai pertama untuk memulai</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination page={page} pages={pages} size={size} onPage={setPage} onSize={setSize} />

        <Pagination page={page} pages={pages} size={size} total={filtered.length} onPage={setPage} onSize={setSize} />
      </div>

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Maskapai" : "Tambah Maskapai"}>
          <AirlineForm value={editing || {}} onCancel={() => setEditing(null)} onSubmit={(v) => handleSave(v)} />
        </Modal>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Airline Form
// ---------------------------------------------------------------------
function AirlineForm({
  value,
  onSubmit,
  onCancel,
}: {
  value: Partial<Airline>;
  onSubmit: (v: Partial<Airline>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Partial<Airline>>({ ...value });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const initialFocusRef = useRef<HTMLInputElement | null>(null);

  // Get available countries from database
  const countries = [
    { id: "cmgsa7nvl0000hr4k0vgccwlu", name: "Indonesia" },
    { id: "cmgsa7nvv0001hr4krvo76fqw", name: "Malaysia" },
    { id: "cmgsa7nvz0002hr4kh9yv72br", name: "Singapore" },
    { id: "cmgsa7nw30003hr4k4tptfkpe", name: "Thailand" },
    { id: "cmgsa7nw70004hr4kgomvjgi5", name: "United Arab Emirates" },
    { id: "cmgsa7nwa0005hr4klxuncne3", name: "Turkey" },
    { id: "cmgsa7nwd0006hr4kw1xfjou6", name: "Qatar" },
    { id: "cmgsa7nwh0007hr4kcjkmbdme", name: "Japan" },
    { id: "cmgsa7nwl0008hr4krti9rkt7", name: "South Korea" },
    { id: "cmgsa7nwo0009hr4kptydu7bt", name: "Australia" },
  ];

  // Validation
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    const code = (form.code ?? "").trim().toUpperCase();
    const name = (form.name ?? "").trim();
    const countryId = (form.countryId ?? "").trim();

    if (!code) e.code = "Kode wajib diisi";
    else if (!/^[A-Z0-9]{2,3}$/.test(code)) e.code = "Gunakan 2–3 huruf/angka (IATA/ICAO)";

    if (!name) e.name = "Nama wajib diisi";
    if (!countryId) e.countryId = "Negara wajib diisi";

    if (form.logo) {
      try {
        new URL(form.logo);
      } catch {
        e.logo = "URL logo tidak valid";
      }
    }

    if (form.website) {
      try {
        new URL(form.website);
      } catch {
        e.website = "URL website tidak valid";
      }
    }
    return e;
  }, [form.code, form.name, form.countryId, form.logo, form.website]);

  const isInvalid = Object.keys(errors).length > 0;

  // Auto-focus
  useEffect(() => {
    initialFocusRef.current?.focus();
  }, []);

  const set = (patch: Partial<Airline>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = () => {
    const payload = { ...form, code: (form.code ?? "").toUpperCase() };
    onSubmit(payload);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isInvalid) handleSubmit();
        else setTouched({ code: true, name: true, countryId: true, logo: true, website: true });
      }}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="field">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Kode Maskapai <span className="text-rose-500">*</span>
          </label>
          <input
            ref={initialFocusRef}
            value={form.code ?? ""}
            onChange={(e) => set({ code: e.target.value.toUpperCase().slice(0, 3) })}
            placeholder="GA, QZ, JT..."
            className={clsx(
              "input",
              touched.code && errors.code && "ring-2 ring-rose-400 border-rose-300"
            )}
          />
          {touched.code && errors.code && (
            <p className="mt-2 text-xs text-rose-600">{errors.code}</p>
          )}
        </div>

        <div className="field">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Kode ICAO
          </label>
          <input
            value={form.icaoCode ?? ""}
            onChange={(e) => set({ icaoCode: e.target.value.toUpperCase().slice(0, 4) })}
            placeholder="GIA, CTV, LNI..."
            className="input"
          />
        </div>

        <div className="field md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Nama Maskapai <span className="text-rose-500">*</span>
          </label>
          <input
            value={form.name ?? ""}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Garuda Indonesia"
            className={clsx(
              "input",
              touched.name && errors.name && "ring-2 ring-rose-400 border-rose-300"
            )}
          />
          {touched.name && errors.name && (
            <p className="mt-2 text-xs text-rose-600">{errors.name}</p>
          )}
        </div>

        <div className="field">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Negara <span className="text-rose-500">*</span>
          </label>
          <select
            value={form.countryId ?? ""}
            onChange={(e) => set({ countryId: e.target.value })}
            className={clsx(
              "input",
              touched.countryId && errors.countryId && "ring-2 ring-rose-400 border-rose-300"
            )}
          >
            <option value="">Pilih negara...</option>
            {countries.map(country => (
              <option key={country.id} value={country.id}>{country.name}</option>
            ))}
          </select>
          {touched.countryId && errors.countryId && (
            <p className="mt-2 text-xs text-rose-600">{errors.countryId}</p>
          )}
        </div>

        <div className="field">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Status
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set({ isActive: !form.isActive })}
              className={clsx(
                "inline-flex items-center gap-3 rounded-xl border px-4 h-12 transition-all duration-200",
                "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <span className={clsx("relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200", form.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600")}>
                <span className={clsx("inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200", form.isActive ? "translate-x-5" : "translate-x-1")} />
              </span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {form.isActive ? "Aktif" : "Nonaktif"}
              </span>
            </button>
          </div>
        </div>

        <div className="field">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Logo URL
          </label>
          <input
            value={form.logo ?? ""}
            onChange={(e) => set({ logo: e.target.value })}
            placeholder="https://example.com/logo.png"
            className={clsx(
              "input",
              touched.logo && errors.logo && "ring-2 ring-rose-400 border-rose-300"
            )}
          />
          {touched.logo && errors.logo && (
            <p className="mt-2 text-xs text-rose-600">{errors.logo}</p>
          )}
        </div>

        <div className="field">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Website URL
          </label>
          <input
            value={form.website ?? ""}
            onChange={(e) => set({ website: e.target.value })}
            placeholder="https://www.garuda-indonesia.com"
            className={clsx(
              "input",
              touched.website && errors.website && "ring-2 ring-rose-400 border-rose-300"
            )}
          />
          {touched.website && errors.website && (
            <p className="mt-2 text-xs text-rose-600">{errors.website}</p>
          )}
        </div>

        <div className="field md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Deskripsi
          </label>
          <textarea
            value={form.description ?? ""}
            onChange={(e) => set({ description: e.target.value })}
            placeholder="Deskripsi singkat maskapai..."
            rows={3}
            className="input min-h-[100px]"
          />
        </div>
      </div>

      {/* Error summary */}
      {isInvalid && Object.keys(touched).length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-900/50 p-4">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.168 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="font-medium">Periksa kembali kolom yang ditandai merah sebelum menyimpan.</span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          className="btn-secondary px-6 py-3"
          onClick={onCancel}
        >
          Batal
        </button>
        <button
          className="btn-primary px-6 py-3 disabled:opacity-60"
          type="submit"
          disabled={isInvalid}
          title={isInvalid ? "Lengkapi form terlebih dahulu" : "Simpan maskapai"}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Simpan
        </button>
      </div>
    </form>
  );
}

export default AirlinesManager;