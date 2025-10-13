import React, { useState } from "react";
import { Plane, Globe, LogIn, ChevronDown, User, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = (): React.ReactElement => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const { user, isAuthenticated, logout } = useAuth();
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
            <NavLink className="hover:text-blue-700 transition" to="/">Home</NavLink>
            <NavLink className="hover:text-blue-700 transition" to="/promo">Promo</NavLink>
            <NavLink className="hover:text-blue-700 transition" to="/destination">Destination</NavLink>
            <NavLink className="hover:text-blue-700 transition" to="/help">Help</NavLink>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-sm">
              <Globe size={16} /> ID / Rp
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-sm"
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.name}</span>
                  <ChevronDown size={14} className={`transition ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          navigate('/my-bookings');
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Plane size={14} />
                        My Bookings
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm cursor-pointer"
              >
                <LogIn size={16} /> Login / Daftar
              </button>
            )}
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

              {isAuthenticated ? (
                <div className="flex-1">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-sm">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{user?.name}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <button
                      onClick={() => {
                        navigate('/my-bookings');
                        setOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      My Bookings
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm cursor-pointer"
                >
                  Login / Daftar
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
