import React, { useState } from "react";
import { Plane, Globe, LogIn, ChevronDown } from "lucide-react";

const Navbar = (): React.ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 grid place-items-center rounded-xl bg-blue-600 text-white">
              <Plane size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">AirBook</span>
          </div>

          {/* Desktop menu */}
          <nav className='hidden md:flex items-center gap-7 font-medium text-slate-700'>
            <a className="hover:text-blue-700 transition" href="/">Home</a>
            <a className="hover:text-blue-700 transition" href="/promo">Promo</a>
            <a className="hover:text-blue-700 transition" href="/combo">Destination</a>
            <a className="hover:text-blue-700 transition" href="/help">Help</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-sm">
              <Globe size={16} /> ID / Rp
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm">
              <LogIn size={16} /> Login / Daftar
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg border border-slate-300"
            onClick={() => setOpen(!open)}
          >
            <ChevronDown className={`transition ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4">
            <ul className="grid gap-2 font-medium">
              <li className="px-3 py-2 rounded-lg hover:bg-slate-100">Home</li>
              <li className="px-3 py-2 rounded-lg hover:bg-slate-100">
                Cari Penerbangan
              </li>
              <li className="px-3 py-2 rounded-lg hover:bg-slate-100">Promo</li>
              <li className="px-3 py-2 rounded-lg hover:bg-slate-100">
                Destinasi
              </li>
            </ul>
            <div className="mt-3 flex items-center gap-2">
              <button className="flex-1 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-sm">
                ID / Rp
              </button>
              <button className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm">
                Login / Daftar
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
