// =============================================================
// AirBook Admin — Flight Schedules Manager
// =============================================================

import { useState, useMemo, useEffect } from "react";
import type { Airline, FlightSchedule, UUID } from "../types";
import { clsx, rupiah } from "../utils";
import { Header, EmptyRow, Pagination, Modal, AddButton } from "../components/Components";
import { useData } from "../contexts/DataContext";
// import { AirportService } from "../services/airportService";

// Interface for database airports
interface DatabaseAirport {
  id: string;
  name: string;
  iataCode: string | null;
  icaoCode: string | null;
  city: {
    id: string;
    name: string;
    country: {
      id: string;
      name: string;
      code: string;
    };
  };
  timezone: string;
}

export function SchedulesManager() {
  const {
    schedules,
    schedulesLoading,
    schedulesError,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    airlines
  } = useData();

  // State for database airports
  const [databaseAirports, setDatabaseAirports] = useState<DatabaseAirport[]>([]);
  const [airportsLoading, setAirportsLoading] = useState(true);

  // Load database airports
  useEffect(() => {
    const loadDatabaseAirports = async () => {
      try {
        console.log('Loading database airports...');
        const response = await fetch('http://localhost:3001/api/db-airports');
        const result = await response.json();
        if (result.success) {
          setDatabaseAirports(result.data);
          console.log('Database airports loaded:', result.data.length);
          console.log('Sample airports:', result.data.slice(0, 3).map((a: DatabaseAirport) => ({
            name: a.name,
            iata: a.iataCode,
            city: a.city.name
          })));
        }
      } catch (err) {
        console.error('Error loading database airports:', err);
      } finally {
        setAirportsLoading(false);
      }
    };

    loadDatabaseAirports();
  }, []);

  // Helper function to get all available airports (database + static)
  const getAllAirports = () => {
    const dbAirports = databaseAirports
      .filter(airport => airport.iataCode) // Only airports with IATA codes
      .map(airport => ({
        iata: airport.iataCode!,
        icao: airport.icaoCode || '',
        name: airport.name,
        city: airport.city.name,
        country: airport.city.country.name,
        region: 'Database',
        timezone: airport.timezone,
        source: 'database' as const
      }));

    // Option 1: Only database airports (uncomment to use only database data)
    console.log("🚀 getAllAirports - Using only database airports:", dbAirports.length);
    return dbAirports;

    // Option 2: Database + Static airports (current behavior)
    // const staticAirports = [
    //   ...AirportService.getIndonesianAirports(),
    //   ...AirportService.getRegionalAirports(),
    //   ...AirportService.getInternationalAirports()
    // ].map(airport => ({
    //   ...airport,
    //   source: 'static' as const
    // }));

    // // Combine and deduplicate (database takes priority)
    // const combined = [...dbAirports, ...staticAirports];
    // const unique = combined.filter((airport, index, array) =>
    //   array.findIndex(a => a.iata === airport.iata) === index
    // );

    // console.log("🚀 getAllAirports - DB Airports:", dbAirports.length);
    // console.log("🚀 getAllAirports - Static Airports:", staticAirports.length);
    // console.log("🚀 getAllAirports - Final unique:", unique.length);

    // return unique;
  };

  // Helper function for display text
  const getAirportDisplayText = (iataCode: string) => {
    if (!iataCode) return "Pilih Bandara";

    const allAirports = getAllAirports();
    const airport = allAirports.find(a => a.iata === iataCode);

    if (airport) {
      return `${airport.iata} - ${airport.city} (${airport.name})`;
    }

    return iataCode;
  };

  // Get airport info from combined data (database + static)
  const getAirportInfo = (iataCode: string) => {
    const airport = getAllAirports().find(a => a.iata === iataCode);
    return airport ? { city: airport.city, name: airport.name, country: airport.country } : null;
  };

  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<FlightSchedule | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);

  const rows = useMemo(() => {
    const lower = q.toLowerCase();
    return schedules.filter(s =>
      [s.flightNo, s.origin, s.destination, airlines.find(a => a.id === s.airlineId)?.name, s.classType]
        .some(x => x?.toLowerCase().includes(lower))
    );
  }, [q, schedules, airlines]);

  const paged = useMemo(() => {
    const start = (page - 1) * size;
    return rows.slice(start, start + size);
  }, [rows, page, size]);

  const pages = Math.max(1, Math.ceil(rows.length / size));
  useEffect(() => { if (page > pages) setPage(1); }, [page, pages, setPage]);

  const handleSave = async (input: Partial<FlightSchedule>) => {
    console.log("🚀 handleSave called with input:", input);

    if (!input.airlineId || !input.flightNo || !input.origin || !input.destination || !input.departure || !input.arrival || !input.classType) {
      console.log("❌ Validation failed - missing required fields");
      return alert("Semua field wajib diisi");
    }
    if (input.origin === input.destination) {
      console.log("❌ Validation failed - same origin/destination");
      return alert("Bandara asal dan tujuan tidak boleh sama!");
    }
    const basePrice = Number(input.basePrice ?? 0);
    const currentPrice = Number(input.currentPrice ?? input.basePrice ?? 0);
    const totalSeats = Number(input.totalSeats ?? 0);
    const availableSeats = Number(input.availableSeats ?? input.totalSeats ?? 0);

    if (Number.isNaN(basePrice) || Number.isNaN(currentPrice) || Number.isNaN(totalSeats) || Number.isNaN(availableSeats)) {
      console.log("❌ Validation failed - invalid numbers");
      return alert("Harga dan seats harus berupa angka");
    }

    if (basePrice <= 0 || currentPrice <= 0) {
      console.log("❌ Validation failed - prices must be positive");
      return alert("Harga harus lebih dari 0");
    }

    // Fix datetime format - ensure ISO 8601 with Z timezone
    const fixDatetime = (datetime: string) => {
      if (!datetime) return datetime;
      // If datetime doesn't end with Z, add it
      if (!datetime.endsWith('Z') && !datetime.includes('+') && !datetime.includes('-')) {
        return datetime.includes('T') ? `${datetime}.000Z` : `${datetime}T00:00:00.000Z`;
      }
      return datetime;
    };

    const departure = fixDatetime(input.departure!);
    const arrival = fixDatetime(input.arrival!);

    console.log("🔧 Fixed datetime formats:", { departure, arrival });

    // Validate that arrival is after departure
    const departureDate = new Date(departure);
    const arrivalDate = new Date(arrival);

    if (arrivalDate <= departureDate) {
      console.log("❌ Validation failed - arrival must be after departure");
      return alert("Waktu kedatangan harus lebih dari waktu keberangkatan!");
    }

    // Check minimum flight duration (at least 30 minutes)
    const flightDurationMinutes = (arrivalDate.getTime() - departureDate.getTime()) / (1000 * 60);
    if (flightDurationMinutes < 30) {
      console.log("❌ Validation failed - minimum flight duration 30 minutes");
      return alert("Durasi penerbangan minimal 30 menit!");
    }

    try {
      if (editing && editing.id) {
        console.log("✏️ Updating existing schedule:", editing.id);
        await updateSchedule(editing.id, {
          ...input,
          departure,
          arrival,
          basePrice,
          currentPrice,
          totalSeats,
          availableSeats
        });
        setEditing(null);
      } else {
        const newScheduleData = {
          airlineId: input.airlineId!,
          flightNo: input.flightNo!,
          origin: input.origin!,
          destination: input.destination!,
          departure,
          arrival,
          classType: input.classType!,
          basePrice,
          currentPrice,
          totalSeats,
          availableSeats,
          status: (input.status as FlightSchedule["status"]) ?? "SCHEDULED",
          isActive: input.isActive ?? true,
        };
        console.log("➕ Creating new schedule with data:", newScheduleData);
        await createSchedule(newScheduleData);
        console.log("✅ Schedule created successfully");
        setEditing(null); // Close modal after successful creation
      }
    } catch (error) {
      console.error("❌ Error in handleSave:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }; const handleDelete = async (id: UUID) => {
    try {
      await deleteSchedule(id);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Show loading state
  if (schedulesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show error state
  if (schedulesError) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Flight Schedules</h2>
        <p className="text-red-500">{schedulesError}</p>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <Header title="Jadwal Penerbangan" subtitle="Kelola jadwal, harga, dan status">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Cari flight no / rute / maskapai..."
            className="input max-w-sm"
          />
          <AddButton onClick={() => setEditing({
            id: "",
            airlineId: airlines[0]?.id || "",
            flightNo: "",
            origin: "",
            destination: "",
            departure: new Date().toISOString(),
            arrival: new Date(Date.now() + 2 * 3600000).toISOString(),
            classType: "ECONOMY",
            availableSeats: 180,
            totalSeats: 180,
            basePrice: 750000,
            currentPrice: 750000,
            status: "SCHEDULED",
            isActive: true,
            createdAt: "",
            updatedAt: ""
          })}>
            Tambah Jadwal
          </AddButton>
        </div>
      </Header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur dark:bg-slate-900/90">
              <tr className="border-b border-slate-200/30 dark:border-slate-700/30">
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Maskapai</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Flight</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Rute</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Kelas</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Berangkat</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Tiba</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Harga</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Seat</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((s, index) => {
                const a = airlines.find(x => x.id === s.airlineId);
                return (
                  <tr
                    key={s.id}
                    className={clsx(
                      "group border-b border-slate-200/20 dark:border-slate-700/20 transition-all duration-200 hover:bg-white/40 dark:hover:bg-slate-800/40",
                      index % 2 === 0 ? "bg-white/20 dark:bg-slate-800/20" : "bg-transparent"
                    )}
                  >
                    <td className="py-4 px-3">
                      <div className="font-medium text-slate-900 dark:text-slate-100">{a?.name ?? "-"}</div>
                      {a?.code && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">{a.code}</div>
                      )}
                    </td>
                    <td className="py-4 px-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 text-sm font-mono font-medium border border-purple-200/30 dark:border-purple-800/30">
                        {s.flightNo}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <div className="text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium">{s.origin}</span>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {getAirportInfo(s.origin)?.city || s.origin}
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <div className="text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium">{s.destination}</span>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {getAirportInfo(s.destination)?.city || s.destination}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200/30 dark:border-indigo-800/30">
                        {s.classType}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="text-slate-900 dark:text-slate-100 font-medium">{new Date(s.departure).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{new Date(s.departure).toLocaleTimeString()}</div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="text-slate-900 dark:text-slate-100 font-medium">{new Date(s.arrival).toLocaleDateString()}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{new Date(s.arrival).toLocaleTimeString()}</div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{rupiah(s.basePrice)}</div>
                        {s.currentPrice !== s.basePrice && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">Current: {rupiah(s.currentPrice)}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-500/10 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200/30 dark:border-slate-700/30">
                          {s.availableSeats}/{s.totalSeats}
                        </span>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Available</div>
                      </div>
                    </td>
                    <td className="py-4 px-3">
                      <span className={clsx(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        s.status === "SCHEDULED" && "badge-ok",
                        s.status === "DELAYED" && "badge-warn",
                        s.status === "CANCELLED" && "badge-danger",
                        s.status === "COMPLETED" && "badge-dim"
                      )}>
                        <span className={clsx(
                          "w-1.5 h-1.5 rounded-full",
                          s.status === "SCHEDULED" && "bg-emerald-500",
                          s.status === "DELAYED" && "bg-amber-500",
                          s.status === "CANCELLED" && "bg-red-500",
                          s.status === "COMPLETED" && "bg-slate-400"
                        )} />
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditing(s)}
                          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                          title="Edit schedule"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                          title="Delete schedule"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <EmptyRow colSpan={10} message="No flight schedules found. Add your first schedule to get started." />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} pages={pages} size={size} onPage={setPage} onSize={setSize} />

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Jadwal" : "Tambah Jadwal"}>
          <div className="max-h-[85vh] overflow-y-auto">
            <ScheduleForm
              airlines={airlines}
              value={editing}
              onCancel={() => setEditing(null)}
              onSubmit={(v) => handleSave(v)}
              getAllAirports={getAllAirports}
              getAirportDisplayText={getAirportDisplayText}
              getAirportInfo={getAirportInfo}
              airportsLoading={airportsLoading}
            />
          </div>
        </Modal>
      )}
    </section>
  );
}

function ScheduleForm({ value, onSubmit, onCancel, airlines, getAllAirports, getAirportDisplayText, getAirportInfo, airportsLoading }: {
  value: Partial<FlightSchedule>;
  onSubmit: (v: Partial<FlightSchedule>) => void;
  onCancel: () => void;
  airlines: Airline[];
  getAllAirports: () => Array<{
    iata: string;
    icao: string;
    name: string;
    city: string;
    country: string;
    region: string;
    timezone: string;
    source: 'database' | 'static';
  }>;
  getAirportDisplayText: (iata: string) => string;
  getAirportInfo: (iataCode: string) => { city: string; name: string; country: string } | null;
  airportsLoading: boolean;
}) {
  const [form, setForm] = useState<Partial<FlightSchedule>>({ ...value });
  const [originCountry, setOriginCountry] = useState<string>("");
  const [destinationCountry, setDestinationCountry] = useState<string>("");

  // Helper function to validate datetime order
  const isValidDatetimeOrder = () => {
    if (!form.departure || !form.arrival) return true;

    const departureDate = new Date(form.departure);
    const arrivalDate = new Date(form.arrival);

    return arrivalDate > departureDate;
  };

  // Helper function to get flight duration in minutes
  const getFlightDuration = () => {
    if (!form.departure || !form.arrival) return 0;

    const departureDate = new Date(form.departure);
    const arrivalDate = new Date(form.arrival);

    return Math.max(0, (arrivalDate.getTime() - departureDate.getTime()) / (1000 * 60));
  };

  // Check if datetime is valid
  const datetimeValid = isValidDatetimeOrder();
  const flightDuration = getFlightDuration();
  const hasMinimumDuration = flightDuration >= 30;

  // Get unique countries from all airports
  const getUniqueCountries = () => {
    const allAirports = getAllAirports();
    const countries = [...new Set(allAirports.map(airport => airport.country))];
    return countries.sort();
  };

  // Filter airports by country
  const getAirportsByCountry = (country: string) => {
    if (!country) return getAllAirports();
    return getAllAirports().filter(airport => airport.country === country);
  };

  // Auto-set country when airport is already selected (for editing existing schedules)
  useEffect(() => {
    if (form.origin && !originCountry) {
      const airport = getAllAirports().find(a => a.iata === form.origin);
      if (airport) {
        setOriginCountry(airport.country);
      }
    }
    if (form.destination && !destinationCountry) {
      const airport = getAllAirports().find(a => a.iata === form.destination);
      if (airport) {
        setDestinationCountry(airport.country);
      }
    }
  }, [form.origin, form.destination, getAllAirports, originCountry, destinationCountry]);

  const statusOptions = [
    { value: "SCHEDULED", label: "Scheduled", color: "emerald" },
    { value: "DELAYED", label: "Delayed", color: "amber" },
    { value: "CANCELLED", label: "Cancelled", color: "red" },
    { value: "COMPLETED", label: "Completed", color: "slate" }
  ];

  const classTypeOptions = [
    { value: "ECONOMY", label: "Economy", color: "blue" },
    { value: "BUSINESS", label: "Business", color: "purple" },
    { value: "FIRST", label: "First Class", color: "amber" }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-1">
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-6">
        {/* Header */}
        <div className="text-center pb-3 border-b border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {form.id ? "Edit Jadwal Penerbangan" : "Tambah Jadwal Penerbangan"}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Lengkapi informasi jadwal penerbangan dengan detail yang akurat
          </p>
        </div>

        {/* Airline & Flight Info */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Maskapai <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm"
                value={form.airlineId ?? ""}
                onChange={(e) => setForm({ ...form, airlineId: e.target.value })}
              >
                <option value="">Pilih Maskapai</option>
                {airlines.map(airline => (
                  <option key={airline.id} value={airline.id}>{airline.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nomor Penerbangan <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-center text-sm"
                value={form.flightNo ?? ""}
                onChange={(e) => setForm({ ...form, flightNo: e.target.value.toUpperCase() })}
                placeholder="GA123"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Kelas <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm"
                value={form.classType ?? ""}
                onChange={(e) => setForm({ ...form, classType: e.target.value })}
              >
                <option value="">Pilih Kelas</option>
                {classTypeOptions.map(classType => (
                  <option key={classType.value} value={classType.value}>{classType.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Bandara Asal <span className="text-red-500">*</span>
              </label>

              {/* Origin Country Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  🌍 Pilih Negara Asal
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  value={originCountry}
                  onChange={(e) => {
                    setOriginCountry(e.target.value);
                    setForm({ ...form, origin: "" }); // Reset airport selection when country changes
                  }}
                >
                  <option value="">Semua Negara ({getAllAirports().length} bandara)</option>
                  {getUniqueCountries().map((country) => {
                    const airportCount = getAllAirports().filter(a => a.country === country).length;
                    return (
                      <option key={country} value={country}>
                        {country} ({airportCount} bandara)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Origin Airport Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  ✈️ Pilih Bandara Asal {originCountry && `(${getAirportsByCountry(originCountry).length} tersedia)`}
                </label>
                {form.origin && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                    ✈️ {getAirportDisplayText(form.origin)}
                  </div>
                )}
                <select
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  value={form.origin ?? ""}
                  onChange={(e) => {
                    const newOrigin = e.target.value;
                    // If new origin is same as destination, reset destination
                    if (newOrigin && newOrigin === form.destination) {
                      setForm({ ...form, origin: newOrigin, destination: "" });
                    } else {
                      setForm({ ...form, origin: newOrigin });
                    }
                  }}
                >
                  <option value="">
                    {originCountry
                      ? `Pilih Bandara di ${originCountry}`
                      : "Pilih Bandara Asal (atau pilih negara dulu)"
                    }
                  </option>
                  {airportsLoading ? (
                    <option disabled>Loading bandara...</option>
                  ) : (
                    getAirportsByCountry(originCountry)
                      .filter(airport => airport.iata !== form.destination) // Exclude destination airport
                      .map((airport, index) => (
                        <option key={`${airport.iata}-${index}`} value={airport.iata}>
                          {airport.iata} - {airport.city} ({airport.name}) {airport.source === 'database' ? '🗃️' : '📂'}
                        </option>
                      ))
                  )}
                </select>
                {form.origin && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    💡 Bandara tujuan akan otomatis dikecualikan dari pilihan bandara {form.origin}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Bandara Tujuan <span className="text-red-500">*</span>
              </label>

              {/* Destination Country Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  🌍 Pilih Negara Tujuan
                </label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  value={destinationCountry}
                  onChange={(e) => {
                    setDestinationCountry(e.target.value);
                    setForm({ ...form, destination: "" }); // Reset airport selection when country changes
                  }}
                >
                  <option value="">Semua Negara ({getAllAirports().length} bandara)</option>
                  {getUniqueCountries().map((country) => {
                    const airportCount = getAllAirports().filter(a => a.country === country).length;
                    return (
                      <option key={country} value={country}>
                        {country} ({airportCount} bandara)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Destination Airport Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400">
                  🛬 Pilih Bandara Tujuan {destinationCountry && `(${getAirportsByCountry(destinationCountry).length} tersedia)`}
                </label>
                {form.destination && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                    🛬 {getAirportDisplayText(form.destination)}
                  </div>
                )}
                <select
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  value={form.destination ?? ""}
                  onChange={(e) => {
                    const newDestination = e.target.value;
                    // If new destination is same as origin, reset origin
                    if (newDestination && newDestination === form.origin) {
                      setForm({ ...form, destination: newDestination, origin: "" });
                    } else {
                      setForm({ ...form, destination: newDestination });
                    }
                  }}
                >
                  <option value="">
                    {destinationCountry
                      ? `Pilih Bandara di ${destinationCountry}`
                      : "Pilih Bandara Tujuan (atau pilih negara dulu)"
                    }
                  </option>
                  {airportsLoading ? (
                    <option disabled>Loading bandara...</option>
                  ) : (
                    getAirportsByCountry(destinationCountry)
                      .filter(airport => airport.iata !== form.origin) // Exclude origin airport
                      .map((airport, index) => (
                        <option key={`${airport.iata}-${index}`} value={airport.iata}>
                          {airport.iata} - {airport.city} ({airport.name}) {airport.source === 'database' ? '🗃️' : '📂'}
                        </option>
                      ))
                  )}
                </select>
                {form.destination && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    💡 Bandara asal akan otomatis dikecualikan dari pilihan bandara {form.destination}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Route Preview */}
          <div className="flex flex-col items-center gap-2">
            <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${form.origin && form.destination && form.origin === form.destination
              ? "bg-gradient-to-r from-red-50 to-red-50 dark:from-red-950/30 dark:to-red-950/30 border-red-200 dark:border-red-800"
              : "bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 border-emerald-200/50 dark:border-emerald-800/50"
              }`}>
              <div className="text-center">
                <div className={`px-3 py-1 rounded-lg font-medium text-sm ${form.origin && form.destination && form.origin === form.destination
                  ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                  : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                  }`}>
                  {form.origin || "---"}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {form.origin ? getAirportInfo(form.origin)?.city || "Unknown" : "Pilih Asal"}
                </div>
              </div>
              <div className="flex flex-col items-center">
                {form.origin && form.destination && form.origin === form.destination ? (
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.168 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                )}
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">✈️</div>
              </div>
              <div className="text-center">
                <div className={`px-3 py-1 rounded-lg font-medium text-sm ${form.origin && form.destination && form.origin === form.destination
                  ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                  : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                  }`}>
                  {form.destination || "---"}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  {form.destination ? getAirportInfo(form.destination)?.city || "Unknown" : "Pilih Tujuan"}
                </div>
              </div>
            </div>

            {/* Warning Message */}
            {form.origin && form.destination && form.origin === form.destination && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L5.168 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                  ⚠️ Bandara asal dan tujuan tidak boleh sama!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Status */}
        <div className="space-y-4">
          {/* Date & Time Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Departure */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                ✈️ Keberangkatan
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 transition-all duration-200 text-sm ${form.departure && form.arrival && !datetimeValid
                      ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 dark:border-slate-600 focus:ring-purple-500 focus:border-purple-500"
                      }`}
                    value={form.departure?.split('T')[0] ?? ""}
                    onChange={(e) => {
                      const time = form.departure?.split('T')[1]?.slice(0, 8) ?? "00:00:00";
                      setForm({ ...form, departure: `${e.target.value}T${time}.000Z` });
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Waktu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 transition-all duration-200 text-sm ${form.departure && form.arrival && !datetimeValid
                      ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                      : "border-slate-300 dark:border-slate-600 focus:ring-purple-500 focus:border-purple-500"
                      }`}
                    value={form.departure?.split('T')[1]?.slice(0, 5) ?? ""}
                    onChange={(e) => {
                      const date = form.departure?.split('T')[0] ?? new Date().toISOString().split('T')[0];
                      setForm({ ...form, departure: `${date}T${e.target.value}:00.000Z` });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Arrival */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                🛬 Kedatangan
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 transition-all duration-200 text-sm ${form.departure && form.arrival && !datetimeValid
                      ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                      : form.departure && form.arrival && datetimeValid && !hasMinimumDuration
                        ? "border-orange-300 dark:border-orange-600 focus:ring-orange-500 focus:border-orange-500"
                        : "border-slate-300 dark:border-slate-600 focus:ring-emerald-500 focus:border-emerald-500"
                      }`}
                    value={form.arrival?.split('T')[0] ?? ""}
                    onChange={(e) => {
                      const time = form.arrival?.split('T')[1]?.slice(0, 8) ?? "00:00:00";
                      setForm({ ...form, arrival: `${e.target.value}T${time}.000Z` });
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Waktu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 transition-all duration-200 text-sm ${form.departure && form.arrival && !datetimeValid
                      ? "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500"
                      : form.departure && form.arrival && datetimeValid && !hasMinimumDuration
                        ? "border-orange-300 dark:border-orange-600 focus:ring-orange-500 focus:border-orange-500"
                        : "border-slate-300 dark:border-slate-600 focus:ring-emerald-500 focus:border-emerald-500"
                      }`}
                    value={form.arrival?.split('T')[1]?.slice(0, 5) ?? ""}
                    onChange={(e) => {
                      const date = form.arrival?.split('T')[0] ?? form.departure?.split('T')[0] ?? new Date().toISOString().split('T')[0];
                      setForm({ ...form, arrival: `${date}T${e.target.value}:00.000Z` });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* DateTime Validation Warnings */}
          {form.departure && form.arrival && (
            <div className="space-y-2">
              {!datetimeValid && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30">
                  <div className="flex-shrink-0">
                    <span className="text-red-500 text-lg">⚠️</span>
                  </div>
                  <div className="text-red-700 dark:text-red-300 text-sm">
                    <strong>Waktu tidak valid!</strong> Waktu kedatangan harus lebih dari waktu keberangkatan.
                  </div>
                </div>
              )}

              {datetimeValid && !hasMinimumDuration && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30">
                  <div className="flex-shrink-0">
                    <span className="text-orange-500 text-lg">⚠️</span>
                  </div>
                  <div className="text-orange-700 dark:text-orange-300 text-sm">
                    <strong>Durasi terlalu singkat!</strong> Durasi penerbangan minimal 30 menit. Saat ini: {Math.round(flightDuration)} menit.
                  </div>
                </div>
              )}

              {datetimeValid && hasMinimumDuration && (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30">
                  <div className="flex-shrink-0">
                    <span className="text-green-500 text-lg">✅</span>
                  </div>
                  <div className="text-green-700 dark:text-green-300 text-sm">
                    <strong>Waktu valid!</strong> Durasi penerbangan: {Math.round(flightDuration)} menit ({Math.floor(flightDuration / 60)}j {Math.round(flightDuration % 60)}m).
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm"
                value={form.status ?? "SCHEDULED"}
                onChange={(e) => setForm({ ...form, status: e.target.value as FlightSchedule["status"] })}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Capacity */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm"
                  value={form.basePrice ? form.basePrice.toLocaleString('id-ID') : ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                    const price = value ? Number(value) : 0;
                    setForm({ ...form, basePrice: price, currentPrice: price }); // Auto set currentPrice
                  }}
                  placeholder="750.000"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Rp</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Kapasitas <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center font-bold text-sm"
                value={form.totalSeats ? form.totalSeats.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  const seats = value ? Number(value) : 0;
                  setForm({ ...form, totalSeats: seats, availableSeats: seats });
                }}
                placeholder="180"
              />
            </div>
          </div>

          {/* Price Preview */}
          <div className="flex justify-center">
            <div className="p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/50">
              <div className="text-center">
                <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                  Rp {(form.basePrice || 0).toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">Harga per penumpang</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 transition-all duration-200 font-medium text-sm"
            onClick={onCancel}
          >
            Batal
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2 text-sm ${
              // Check multiple validation conditions
              (form.origin && form.destination && form.origin === form.destination) ||
                (form.departure && form.arrival && !datetimeValid) ||
                (form.departure && form.arrival && datetimeValid && !hasMinimumDuration)
                ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed shadow-gray-400/25"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40"
              }`}
            type="submit"
            disabled={
              (form.origin && form.destination && form.origin === form.destination) ||
              (form.departure && form.arrival && !datetimeValid) ||
              (form.departure && form.arrival && datetimeValid && !hasMinimumDuration)
            }
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {form.id ? "Update Jadwal" : "Simpan Jadwal"}
          </button>
        </div>
      </form>
    </div>
  );
}
