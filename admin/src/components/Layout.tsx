// =============================================================
// AirBook Admin — Layout Component
// =============================================================

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clsx } from "../utils";
import { DashboardIcon, AirlineIcon, ScheduleIcon, PromoIcon, AirportIcon, CountryIcon, CityIcon, OtherIcon } from './Icons';
import { useAuth } from "../contexts/AuthContext";
import { useData } from "../contexts/DataContext";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    // Start with sidebar closed, will be set correctly in useEffect
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dark, setDark] = useState(false);
    const [otherMenuOpen, setOtherMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { airlines, schedules, promos } = useData();

    // Handle mobile navigation
    const handleNavigate = (path: string) => {
        navigate(path);
        // Auto-close sidebar on mobile after navigation
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
            setOtherMenuOpen(false); // Also close submenu
        }
    };

    // Close sidebar when clicking outside on mobile
    const handleOverlayClick = () => {
        setSidebarOpen(false);
        setOtherMenuOpen(false);
    };

    const navigationItems = [
        {
            path: "/dashboard",
            icon: <DashboardIcon />,
            label: "Dashboard",
            sublabel: "Overview & metrics",
            count: undefined
        },
        {
            path: "/airlines",
            icon: <AirlineIcon />,
            label: "Airlines",
            sublabel: "Manage carriers",
            count: airlines.filter(a => a.isActive).length
        },
        {
            path: "/flightSchedule",
            icon: <ScheduleIcon />,
            label: "Flight Schedules",
            sublabel: "Routes & timing",
            count: schedules.filter(s => s.status === "SCHEDULED").length
        },
        {
            path: "/promotions",
            icon: <PromoIcon />,
            label: "Promotions",
            sublabel: "Deals & discounts",
            count: promos.filter(p => p.isActive).length
        },
        {
            path: "/airports",
            icon: <AirportIcon />,
            label: "Airports",
            sublabel: "Manage airports",
            count: undefined
        }
    ];

    const otherMenuItems = [
        {
            path: "/countries",
            icon: <CountryIcon />,
            label: "Countries",
            sublabel: "Manage countries"
        },
        {
            path: "/cities",
            icon: <CityIcon />,
            label: "Cities",
            sublabel: "Manage cities"
        }
    ];

    // Auto-open "Other" menu if user is on countries or cities page
    useEffect(() => {
        if (location.pathname === "/countries" || location.pathname === "/cities") {
            setOtherMenuOpen(true);
        }
    }, [location.pathname]);

    // Handle responsive sidebar behavior
    useEffect(() => {
        const handleResize = () => {
            // Only auto-adjust on mobile, let desktop users control manually
            if (window.innerWidth < 1024) {
                setSidebarOpen(false); // Close on mobile
            }
        };

        // Set initial state based on screen size
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true); // Open on desktop by default
            } else {
                setSidebarOpen(false); // Close on mobile by default
            }
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Remove dependency to prevent infinite loop

    return (
        <div className={clsx("min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-800", dark && "dark bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100")}>
            {/* Enhanced Background */}
            <div className="pointer-events-none fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400/10 via-blue-500/5 to-purple-600/10 dark:from-sky-900/20 dark:via-indigo-900/15 dark:to-purple-900/20" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Layout */}
            <div className="relative z-10 flex min-h-screen">
                {/* Mobile Overlay - Only show on mobile when sidebar is open */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden transition-opacity duration-300"
                        onClick={handleOverlayClick}
                    />
                )}

                {/* Sidebar */}
                <aside className={clsx(
                    "fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out w-80",
                    // Show/hide based on sidebarOpen state for all screen sizes
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <nav className="h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-white/50 dark:border-slate-700/50 shadow-2xl flex flex-col">
                        {/* Mobile Header - Close Button */}
                        <div className="lg:hidden p-4 border-b border-white/30 dark:border-slate-700/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">AirBook Admin</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Control Panel</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Navigation Items */}
                        <div className="flex-1 p-6 space-y-3 overflow-y-auto">
                            {navigationItems.map((item) => (
                                <SideItem
                                    key={item.path}
                                    icon={item.icon}
                                    label={item.label}
                                    sublabel={item.sublabel}
                                    active={location.pathname === item.path}
                                    onClick={() => handleNavigate(item.path)}
                                    count={item.count}
                                />
                            ))}

                            {/* Other Menu with Submenu */}
                            <div className="space-y-1">
                                <button
                                    onClick={() => setOtherMenuOpen(!otherMenuOpen)}
                                    className={clsx(
                                        "group w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]",
                                        (location.pathname === "/countries" || location.pathname === "/cities")
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                                            : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                                    )}
                                >
                                    <div className={clsx(
                                        "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                                        (location.pathname === "/countries" || location.pathname === "/cities")
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-white dark:group-hover:bg-slate-700"
                                    )}>
                                        <OtherIcon />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className={clsx("font-semibold text-sm truncate", (location.pathname === "/countries" || location.pathname === "/cities") ? "text-white" : "")}>
                                            Other
                                        </div>
                                        <div className={clsx("text-xs mt-0.5 truncate", (location.pathname === "/countries" || location.pathname === "/cities") ? "text-white/80" : "text-slate-500 dark:text-slate-400")}>
                                            Locations & more
                                        </div>
                                    </div>
                                    <div className={clsx(
                                        "flex-shrink-0 w-5 h-5 transition-transform duration-200",
                                        otherMenuOpen ? "rotate-90" : "rotate-0"
                                    )}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>

                                {/* Submenu */}
                                {otherMenuOpen && (
                                    <div className="ml-4 space-y-1 animate-in slide-in-from-left-2 duration-200">
                                        {otherMenuItems.map((item) => (
                                            <button
                                                key={item.path}
                                                onClick={() => handleNavigate(item.path)}
                                                className={clsx(
                                                    "group w-full flex items-center gap-3 p-3 pl-6 rounded-lg transition-all duration-200 hover:scale-[1.02]",
                                                    location.pathname === item.path
                                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                                                        : "text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100"
                                                )}
                                            >
                                                <div className={clsx(
                                                    "flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200",
                                                    location.pathname === item.path
                                                        ? "bg-white/20 text-white"
                                                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-white dark:group-hover:bg-slate-700"
                                                )}>
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1 text-left min-w-0">
                                                    <div className={clsx("font-medium text-sm truncate", location.pathname === item.path ? "text-white" : "")}>
                                                        {item.label}
                                                    </div>
                                                    <div className={clsx("text-xs mt-0.5 truncate", location.pathname === item.path ? "text-white/80" : "text-slate-500 dark:text-slate-400")}>
                                                        {item.sublabel}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-auto p-6 border-t border-white/30 dark:border-slate-700/30">
                            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                <div>AirBook Admin V3</div>
                                <div className="mt-1">React + TypeScript + Tailwind</div>
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className={clsx(
                    "flex-1 flex flex-col min-w-0 transition-all duration-300",
                    // Add left margin on desktop when sidebar is open
                    sidebarOpen ? "lg:ml-80" : "lg:ml-0"
                )}>
                    {/* Header */}
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
                                                        if (confirm("Are you sure you want to logout?")) {
                                                            logout();
                                                        }
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

                    {/* Content */}
                    <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-x-auto min-h-0">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v10l4-4 4 4V5" />
                            </svg>
                            <span>AirBook Admin</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                                {location.pathname.replace('/', '') || 'dashboard'}
                            </span>
                        </div>

                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

function SideItem({ icon, label, sublabel, active, onClick, count }: {
    icon: React.ReactNode;
    label: string;
    sublabel?: string;
    active?: boolean;
    onClick?: () => void;
    count?: number;
}) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "group w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]",
                active
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
            )}
        >
            <div className={clsx(
                "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                active
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-white dark:group-hover:bg-slate-700"
            )}>
                {icon}
            </div>
            <div className="flex-1 text-left min-w-0">
                <div className={clsx("font-semibold text-sm truncate", active ? "text-white" : "")}>
                    {label}
                </div>
                {sublabel && (
                    <div className={clsx("text-xs mt-0.5 truncate", active ? "text-white/80" : "text-slate-500 dark:text-slate-400")}>
                        {sublabel}
                    </div>
                )}
            </div>
            {count !== undefined && (
                <div className={clsx(
                    "flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium",
                    active
                        ? "bg-white/20 text-white"
                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                )}>
                    {count}
                </div>
            )}
        </button>
    );
}