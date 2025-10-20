// =============================================================
// AirBook Admin — Authenticated Header
// =============================================================

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface AuthHeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    dark: boolean;
    setDark: (dark: boolean) => void;
}

export function AuthHeader({ sidebarOpen, setSidebarOpen, dark, setDark }: AuthHeaderProps) {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        if (confirm("Are you sure you want to logout?")) {
            logout();
        }
    };

    return (
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-white/50 dark:border-slate-700/50 shadow-lg shadow-slate-900/5">
            <div className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="group relative rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-2.5 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 hover:scale-105"
                        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                    >
                        <div className={`transition-transform duration-300`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                AirBook Admin
                            </h1>
                            <div className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">Control Panel</div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => setDark(!dark)}
                        className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 hover:scale-105"
                        title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {dark ? (
                            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 p-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 hover:scale-105"
                        >
                            <div className="flex items-center gap-2">
                                {user?.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-medium text-sm">
                                        {user?.name?.charAt(0) || "A"}
                                    </div>
                                )}
                                <div className="text-left hidden md:block">
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</div>
                                </div>
                            </div>
                            <svg className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl z-50">
                                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-12 h-12 rounded-xl object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-lg">
                                                {user?.name?.charAt(0) || "A"}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-semibold text-slate-900 dark:text-slate-100">{user?.name}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</div>
                                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium mt-1">
                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                {user?.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2">
                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            // Could add profile editing functionality here
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Profile Settings</span>
                                    </button>

                                    <div className="my-1 border-t border-slate-200 dark:border-slate-700"></div>

                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Click outside to close user menu */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </header>
    );
}