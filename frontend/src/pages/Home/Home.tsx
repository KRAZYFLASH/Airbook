import React, { useState } from "react";
import {
  Search,
  Calendar,
  Users,
  Plane,
  TicketPercent,
  Star,
  MapPin,
  HelpCircle,
} from "lucide-react";

// Single-file demo homepage for an airline-only booking app.
// TailwindCSS required. Paste this component into your React app and render <AirBookHome />.

export default function AirBookHome(): React.ReactElement {
  return (
    <div className="min-h-screen bg-sky-50 text-slate-800">

      <Hero />
      <PromoStrip />
      <Destinations />
      <Airlines />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}

/* ================= HERO + SEARCH ================= */
function Hero() {
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
        <div className="z-10 text-slate-900 max-w-lg pl-6 sm:pl-10 lg:pl-16"></div>

        {/* RIGHT: Search Card */}
        <div className="relative z-10">
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-200 via-sky-200 to-cyan-200 rounded-3xl blur-2xl opacity-50" />
          <div className="relative bg-white rounded-3xl shadow-xl border border-slate-200 p-5 sm:p-6">
            <SearchForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchForm() {
  const today = new Date().toISOString().split("T")[0];
  const [trip, setTrip] = useState("oneway");
  const [from, setFrom] = useState("CGK - Soekarno-Hatta");
  const [to, setTo] = useState("DPS - Bali Ngurah Rai");
  const [depart, setDepart] = useState(today);
  const [returnDate, setReturnDate] = useState<string>("");
  const [pax, setPax] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    alert(
      `Cari: ${trip}\nFrom: ${from}\nTo: ${to}\nDepart: ${depart}\nReturn: ${returnDate || "-"
      }\nPenumpang: ${pax}`
    );
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* Trip type */}
      <div className="flex items-center gap-2 text-sm">
        <label
          className={`px-3 py-1.5 rounded-full border ${trip === "oneway"
              ? "bg-blue-600 text-white border-blue-600"
              : "border-slate-300 text-slate-700"
            }`}
          onClick={() => setTrip("oneway")}
        >
          Sekali Jalan
        </label>
        <label
          className={`px-3 py-1.5 rounded-full border ${trip === "round"
              ? "bg-blue-600 text-white border-blue-600"
              : "border-slate-300 text-slate-700"
            }`}
          onClick={() => setTrip("round")}
        >
          Pulang-Pergi
        </label>
      </div>

      {/* Fields */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Dari" icon={<MapPin size={16} />}>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-transparent outline-none"
          />
        </Field>
        <Field label="Ke" icon={<MapPin size={16} />}>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-transparent outline-none"
          />
        </Field>
      </div>
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
          className="h-[52px] rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <Search size={18} /> Cari Penerbangan
        </button>
      </div>

      <p className="text-xs text-slate-500">
        Dengan melanjutkan, Anda menyetujui{" "}
        <span className="underline">S&K</span> dan{" "}
        <span className="underline">Kebijakan Privasi</span>.
      </p>
    </form>
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

/* ================= PROMO ================= */
function PromoStrip() {
  const promos = [
    { id: 1, title: "Diskon 15% PP ke Bali", code: "AIRBALI15" },
    { id: 2, title: "Cashback s.d. Rp150rb", code: "CASH150" },
    { id: 3, title: "Midnight Sale Garuda", code: "MIDNITE" },
  ];
  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {promos.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3 shadow-sm"
            >
              <div className="h-10 w-10 grid place-items-center rounded-xl bg-yellow-100 text-yellow-700">
                <TicketPercent size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{p.title}</p>
                <p className="text-xs text-slate-500">
                  Kode:{" "}
                  <span className="font-mono text-slate-700">{p.code}</span>
                </p>
              </div>
              <button className="text-sm font-semibold text-blue-700 hover:underline">
                Pakai
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= DESTINATIONS ================= */
function Destinations() {
  const items = [
    {
      city: "Bali",
      code: "DPS",
      price: 650000,
      img: "https://images.unsplash.com/photo-1543248939-ff40856f65d4?q=80&w=1600&auto=format&fit=crop",
    },
    {
      city: "Jakarta",
      code: "CGK",
      price: 450000,
      img: "https://images.unsplash.com/photo-1591025207163-8baf0ce26ac5?q=80&w=1600&auto=format&fit=crop",
    },
    {
      city: "Singapura",
      code: "SIN",
      price: 1200000,
      img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop",
    },
    {
      city: "Kuala Lumpur",
      code: "KUL",
      price: 1100000,
      img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=1600&auto=format&fit=crop",
    },
    {
      city: "Yogyakarta",
      code: "YIA",
      price: 520000,
      img: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1600&auto=format&fit=crop",
    },
    {
      city: "Surabaya",
      code: "SUB",
      price: 560000,
      img: "https://images.unsplash.com/photo-1536095128863-8a0d8f3a8c6b?q=80&w=1600&auto=format&fit=crop",
    },
  ];
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Destinasi Populer</h2>
            <p className="text-slate-600">
              Pilih cepat untuk langsung mencari tiket
            </p>
          </div>
          <button className="hidden sm:inline-flex text-sm font-semibold text-blue-700 hover:underline">
            Lihat Semua
          </button>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((d, i) => (
            <button
              key={i}
              className="group relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm text-left"
            >
              <img
                src={d.img}
                alt={d.city}
                className="h-40 w-full object-cover group-hover:scale-105 transition"
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{d.code}</p>
                    <p className="font-semibold text-lg">{d.city}</p>
                  </div>
                  <p className="text-sm">
                    <span className="font-semibold text-slate-900">
                      Rp{d.price.toLocaleString("id-ID")}
                    </span>
                    +
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= AIRLINES ================= */
function Airlines() {
  const logos = [
    {
      name: "Garuda Indonesia",
      url: "https://upload.wikimedia.org/wikipedia/commons/7/73/Garuda_Indonesia_logo.svg",
    },
    {
      name: "AirAsia",
      url: "https://upload.wikimedia.org/wikipedia/commons/7/75/AirAsia_New_Logo.svg",
    },
    {
      name: "Singapore Airlines",
      url: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Singapore_Airlines_Logo.svg",
    },
    {
      name: "Emirates",
      url: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Emirates_logo.svg",
    },
  ];
  return (
    <section className="py-8 bg-white border-y border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-500 mb-4">
          Mitra Maskapai
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center">
          {logos.map((l, i) => (
            <div
              key={i}
              className="h-10 flex items-center justify-center opacity-80 hover:opacity-100 transition"
            >
              <img
                src={l.url}
                alt={l.name}
                className="max-h-10 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */
function Testimonials() {
  const data = [
    {
      name: "Rizky",
      text: "Harga transparan, proses cepat. E-ticket langsung masuk!",
      rating: 5,
    },
    {
      name: "Sinta",
      text: "Banyak pilihan maskapai dan jam terbang. Suka promonya.",
      rating: 5,
    },
    {
      name: "Dimas",
      text: "UI simpel, cari rute PP gampang banget.",
      rating: 4,
    },
  ];
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Apa kata mereka</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {data.map((t, i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-slate-700">“{t.text}”</p>
              <p className="mt-3 text-sm font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= FAQ ================= */
function FAQ() {
  const items = [
    {
      q: "Bagaimana cara refund atau reschedule?",
      a: "Masuk ke Profil → Pesanan Saya → pilih tiket → ajukan refund/reschedule sesuai kebijakan maskapai.",
    },
    {
      q: "Apakah ada biaya tambahan?",
      a: "Kami transparan tanpa biaya tersembunyi. Biaya layanan akan ditampilkan sebelum pembayaran.",
    },
    {
      q: "Metode pembayaran apa saja?",
      a: "Kartu kredit/debit, VA, e-wallet (OVO, GoPay, DANA), dan transfer bank.",
    },
  ];
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div>
            <h2 className="text-2xl font-bold">Butuh Bantuan?</h2>
            <p className="text-slate-600 mt-2">
              Pertanyaan yang sering diajukan pengguna AirBook.
            </p>
            <div className="mt-6 grid gap-3">
              {items.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <summary className="list-none flex items-center justify-between cursor-pointer">
                    <span className="font-semibold">{f.q}</span>
                    <HelpCircle
                      size={18}
                      className="text-slate-500 group-open:rotate-45 transition"
                    />
                  </summary>
                  <div className="mt-3 text-slate-600">{f.a}</div>
                </details>
              ))}
            </div>
          </div>

          {/* Contact Card */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-sky-200 via-cyan-200 to-blue-200 rounded-3xl blur-2xl opacity-60" />
            <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold">Masih bingung?</h3>
              <p className="text-slate-600 mt-1">
                Hubungi tim layanan kami 24/7 untuk bantuan cepat.
              </p>
              <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
                <a
                  href="#"
                  className="rounded-2xl border border-slate-300 px-4 py-3 hover:bg-slate-50"
                >
                  Live Chat
                </a>
                <a
                  href="#"
                  className="rounded-2xl border border-slate-300 px-4 py-3 hover:bg-slate-50"
                >
                  WhatsApp
                </a>
                <a
                  href="#"
                  className="rounded-2xl border border-slate-300 px-4 py-3 hover:bg-slate-50"
                >
                  Email
                </a>
                <a
                  href="#"
                  className="rounded-2xl border border-slate-300 px-4 py-3 hover:bg-slate-50"
                >
                  Pusat Bantuan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= FOOTER ================= */
function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 grid place-items-center rounded-xl bg-blue-600 text-white">
              <Plane size={18} />
            </div>
            <span className="font-bold text-lg">AirBook</span>
          </div>
          <p className="text-slate-600 mt-3 text-sm max-w-xs">
            Platform pemesanan khusus pesawat. Cepat, aman, dan transparan.
          </p>
        </div>
        <div>
          <p className="font-semibold mb-3">Menu</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>Home</li>
            <li>Cari Penerbangan</li>
            <li>Promo</li>
            <li>Destinasi</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Bantuan</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>FAQ</li>
            <li>Kebijakan Privasi</li>
            <li>Syarat & Ketentuan</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Kontak</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>support@airbook.app</li>
            <li>+62-812-0000-0000</li>
            <li>Jakarta, Indonesia</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} AirBook. All rights reserved.
      </div>
    </footer>
  );
}
