import React, { useState } from 'react';
import { Search, Calendar, Users, MapPin, Lock } from 'lucide-react';
import { StaticAirportSelector } from '../../../components/StaticAirportSelector';
import { Airport } from '../../../hooks/useAirports';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Hero(): React.ReactElement {
    const today = new Date().toISOString().split("T")[0];
    const [trip, setTrip] = useState("oneway");
    const [fromAirport, setFromAirport] = useState<Airport | null>(null);
    const [toAirport, setToAirport] = useState<Airport | null>(null);
    const [depart, setDepart] = useState(today);
    const [returnDate, setReturnDate] = useState<string>("");
    const [pax, setPax] = useState<number>(1);

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        if (!isAuthenticated) {
            // Redirect to login if not authenticated
            navigate('/login', {
                state: {
                    from: '/',
                    message: 'Please login to book flights'
                }
            });
            return;
        }

        // If authenticated, proceed with booking
        alert(
            `Cari: ${trip}\nFrom: ${fromAirport?.airport || 'Not selected'}\nTo: ${toAirport?.airport || 'Not selected'}\nDepart: ${depart}\nReturn: ${returnDate || "-"}\nPenumpang: ${pax}`
        );
    };

    return (
        <section className="relative overflow-hidden h-[520px]">
            {/* Background image */}
            <img
                src="https://i.pinimg.com/1200x/f3/bc/58/f3bc587ce8f0a9732d34fad40241d3b4.jpg"
                alt="Pesawat di udara"
                className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Overlay lebih ringan */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full grid lg:grid-cols-2 gap-10 items-center">
                {/* LEFT: Text */}
                <div className="z-10 text-slate-900 max-w-lg pl-6 sm:pl-10 lg:pl-16">
                    <h1 className="text-4xl font-bold leading-tight mb-4">
                        Jelajahi Dunia dengan
                        <span className="block text-blue-600">AirBook</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-6">
                        Temukan penerbangan terbaik dengan harga terjangkau ke seluruh dunia.
                        Booking mudah, pembayaran aman, dan perjalanan yang tak terlupakan.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span>Harga Terbaik</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span>24/7 Support</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span>Booking Mudah</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Search Card */}
                <div className="relative z-10">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-blue-200 via-sky-200 to-cyan-200 rounded-3xl blur-2xl opacity-50" />
                    <div className="relative bg-white rounded-3xl shadow-xl border border-slate-200 p-5 sm:p-6">
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            {/* Trip type */}
                            <div className="flex items-center gap-2 text-sm">
                                <label
                                    className={`px-3 py-1.5 rounded-full border cursor-pointer ${trip === "oneway"
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-slate-300 text-slate-700"
                                        }`}
                                    onClick={() => setTrip("oneway")}
                                >
                                    Sekali Jalan
                                </label>
                                <label
                                    className={`px-3 py-1.5 rounded-full border cursor-pointer ${trip === "round"
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-slate-300 text-slate-700"
                                        }`}
                                    onClick={() => setTrip("round")}
                                >
                                    Pulang-Pergi
                                </label>
                            </div>

                            {/* Airport Fields */}
                            <div className="grid sm:grid-cols-2 gap-3">
                                <Field label="Dari" icon={<MapPin size={16} />}>
                                    <StaticAirportSelector
                                        placeholder="Pilih bandara keberangkatan"
                                        selectedAirport={fromAirport}
                                        onSelect={setFromAirport}
                                        className="border-0 bg-transparent"
                                    />
                                </Field>
                                <Field label="Ke" icon={<MapPin size={16} />}>
                                    <StaticAirportSelector
                                        placeholder="Pilih bandara tujuan"
                                        selectedAirport={toAirport}
                                        onSelect={setToAirport}
                                        className="border-0 bg-transparent"
                                    />
                                </Field>
                            </div>

                            {/* Date Fields */}
                            <div className="grid sm:grid-cols-2 gap-3">
                                <Field label="Berangkat" icon={<Calendar size={16} />}>
                                    <input
                                        type="date"
                                        min={today}
                                        value={depart}
                                        onChange={(e) => setDepart(e.target.value)}
                                        className="w-full bg-transparent outline-none"
                                    />
                                </Field>
                                <Field
                                    label="Pulang"
                                    icon={<Calendar size={16} />}
                                    disabled={trip !== "round"}
                                >
                                    <input
                                        type="date"
                                        min={depart}
                                        value={returnDate}
                                        onChange={(e) => setReturnDate(e.target.value)}
                                        disabled={trip !== "round"}
                                        className="w-full bg-transparent outline-none disabled:text-slate-400"
                                    />
                                </Field>
                            </div>

                            {/* Passenger and Search */}
                            <div className="grid sm:grid-cols-2 gap-3">
                                <Field label="Penumpang" icon={<Users size={16} />}>
                                    <input
                                        type="number"
                                        min={1}
                                        value={pax}
                                        onChange={(e) => setPax(Number(e.target.value))}
                                        className="w-full bg-transparent outline-none"
                                    />
                                </Field>
                                <button
                                    type="submit"
                                    className={`h-[52px] rounded-2xl font-semibold flex items-center justify-center gap-2 transition-colors ${isAuthenticated
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-gray-400 text-white cursor-pointer hover:bg-gray-500"
                                        }`}
                                    title={isAuthenticated ? "Search flights" : "Login required to book flights"}
                                >
                                    {isAuthenticated ? (
                                        <>
                                            <Search size={18} /> Cari Penerbangan
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={18} /> Login untuk Memesan
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-xs text-slate-500">
                                Dengan melanjutkan, Anda menyetujui{" "}
                                <span className="underline cursor-pointer">S&K</span> dan{" "}
                                <span className="underline cursor-pointer">Kebijakan Privasi</span>.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

interface FieldProps {
    label: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    disabled?: boolean;
}

function Field({ label, icon, children, disabled = false }: FieldProps): React.ReactElement {
    return (
        <label className={`group grid gap-1 ${disabled ? "opacity-60" : ""}`}>
            <span className="text-xs font-medium text-slate-500">{label}</span>
            <div className="flex items-center gap-2 px-4 h-[52px] rounded-2xl border border-slate-300 focus-within:border-blue-600 bg-white">
                <span className="text-slate-500">{icon}</span>
                {children}
            </div>
        </label>
    );
}
