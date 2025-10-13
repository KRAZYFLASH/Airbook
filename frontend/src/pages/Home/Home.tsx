import React from "react";
import {
  Plane,
  TicketPercent,
  Star,
  HelpCircle,
} from "lucide-react";
import Hero from "./sub/Hero";

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
