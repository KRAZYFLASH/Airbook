// =============================================================
// AirBook Admin — Layout Component
// =============================================================

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clsx } from "../utils";
import { DashboardIcon, AirlineIcon, ScheduleIcon, PromoIcon, AirportIcon } from "../components/Icons";
import { AuthHeader } from "../components/AuthHeader";
import { useData } from "../contexts/DataContext";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dark, setDark] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { airlines, schedules, promos } = useData();

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
                {/* Sidebar */}
                <aside className={clsx(
                    "fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out",
                    sidebarOpen ? "w-80 translate-x-0" : "w-20 -translate-x-60 lg:translate-x-0"
                )}>
                    <nav className="h-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-white/50 dark:border-slate-700/50 shadow-2xl flex flex-col">
                        {/* Navigation Items */}
                        <div className="flex-1 p-6 space-y-3">
                            {navigationItems.map((item) => (
                                <SideItem
                                    key={item.path}
                                    icon={item.icon}
                                    label={item.label}
                                    sublabel={item.sublabel}
                                    active={location.pathname === item.path}
                                    onClick={() => navigate(item.path)}
                                    count={item.count}
                                />
                            ))}
                        </div>

                        {/* Quick Stats */}
                        <div className="p-6 border-t border-white/30 dark:border-slate-700/30">
                            <div className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl p-4 space-y-3">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Stats</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Active Airlines</span>
                                        <span className="text-sm font-semibold text-blue-600">{airlines.filter(a => a.isActive).length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">On-Time Flights</span>
                                        <span className="text-sm font-semibold text-emerald-600">{schedules.filter(s => s.status === "SCHEDULED").length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-600 dark:text-slate-400">Active Promos</span>
                                        <span className="text-sm font-semibold text-blue-600">{promos.filter(p => p.isActive).length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                <div>AirBook Admin V3</div>
                                <div className="mt-1">React + TypeScript + Tailwind</div>
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className={clsx("flex-1 transition-all duration-300", sidebarOpen ? "ml-80" : "ml-20")}>
                    {/* Header */}
                    <AuthHeader
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        dark={dark}
                        setDark={setDark}
                    />

                    {/* Content */}
                    <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
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