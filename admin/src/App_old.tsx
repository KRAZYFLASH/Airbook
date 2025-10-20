import React, { useState, useEffect } from "react";

// localStorage keys
const LS_KEYS = {
  airlines: "airbook_admin_airlines_v2",
  schedules: "airbook_admin_schedules_v2",
  promos: "airbook_admin_promos_v2",
};

// ============== Seeds =================
const seedAirlines: Airline[] = [
  { id: uid(), code: "GA", name: "Garuda Indonesia", country: "Indonesia", logoUrl: "https://logo.clearbit.com/garuda-indonesia.com", active: true, createdAt: nowISO() },
  { id: uid(), code: "QZ", name: "Indonesia AirAsia", country: "Indonesia", logoUrl: "https://logo.clearbit.com/airasia.com", active: true, createdAt: nowISO() },
  { id: uid(), code: "JT", name: "Lion Air", country: "Indonesia", logoUrl: "https://logo.clearbit.com/lionair.co.id", active: true, createdAt: nowISO() },
];

const seedSchedules = (airlines: Airline[]): FlightSchedule[] => [
  { id: uid(), airlineId: airlines[0]?.id || "", flightNo: "GA-410", origin: "CGK", destination: "DPS", departure: new Date(Date.now() + 86400000).toISOString(), arrival: new Date(Date.now() + 86400000 + 2.5 * 3600000).toISOString(), basePrice: 1450000, seats: 180, status: "ON_TIME", createdAt: nowISO() },
  { id: uid(), airlineId: airlines[1]?.id || "", flightNo: "QZ-7521", origin: "SUB", destination: "KUL", departure: new Date(Date.now() + 2 * 86400000).toISOString(), arrival: new Date(Date.now() + 2 * 86400000 + 3 * 3600000).toISOString(), basePrice: 980000, seats: 156, status: "DELAYED", createdAt: nowISO() },
];

const seedPromos: Promo[] = [
  { id: uid(), title: "Oktober Hemat", code: "OKTHEMAT20", discountPercent: 20, startsAt: new Date().toISOString().slice(0, 10), endsAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), conditions: "Min. transaksi Rp500.000. Berlaku rute domestik.", active: true, createdAt: nowISO() },
  { id: uid(), title: "Libur Nataru", code: "NATARU10", discountPercent: 10, startsAt: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10), endsAt: new Date(Date.now() + 60 * 86400000).toISOString().slice(0, 10), conditions: "Tidak berlaku untuk rute international premium.", active: false, createdAt: nowISO() },
];
              </div>
              <div className={clsx("absolute inset-0 transition-all duration-300", dark ? "rotate-0 scale-100" : "rotate-180 scale-0")}>
                <svg className="w-5 h-5 text-blue-400 mt-2.5 ml-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                </svg>
              </div>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-medium text-sm">
                A
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">Admin</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">Super User</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-[120rem]">
        {/* Enhanced Sidebar */}
        <aside className={clsx(
          "transition-all duration-300 ease-in-out border-r border-white/30 dark:border-slate-700/30",
          "bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl",
          sidebarOpen ? "w-80" : "w-0 overflow-hidden"
        )}>
          <nav className="p-6 h-full">
            <EnhancedBrandCard />

            <div className="space-y-2 mt-8">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Navigation
              </div>

              <SideItem
                icon={<DashboardIcon />}
                label="Dashboard"
                sublabel="Overview & stats"
                active={section === "dashboard"}
                onClick={() => setSection("dashboard")}
              />

              <SideItem
                icon={<AirlineIcon />}
                label="Airlines"
                sublabel="Manage carriers"
                active={section === "airlines"}
                onClick={() => setSection("airlines")}
                count={airlines.length}
              />

              <SideItem
                icon={<ScheduleIcon />}
                label="Flight Schedules"
                sublabel="Routes & timing"
                active={section === "schedules"}
                onClick={() => setSection("schedules")}
                count={schedules.length}
              />

              <SideItem
                icon={<PromoIcon />}
                label="Promotions"
                sublabel="Discounts & offers"
                active={section === "promos"}
                onClick={() => setSection("promos")}
                count={promos.filter(p => p.active).length}
              />
            </div>

            <div className="mt-12 space-y-2">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Quick Stats
              </div>

              <div className="p-4 rounded-2xl border border-slate-200/40 dark:border-slate-700/40 bg-gradient-to-br from-white/60 to-white/30 dark:from-slate-800/60 dark:to-slate-800/30">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Active Airlines</span>
                    <span className="text-sm font-semibold">{airlines.filter(a => a.active).length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-400">On-time Flights</span>
                    <span className="text-sm font-semibold text-emerald-600">{schedules.filter(s => s.status === "ON_TIME").length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Active Promos</span>
                    <span className="text-sm font-semibold text-blue-600">{promos.filter(p => p.active).length}</span>
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

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          {section === "dashboard" && (
            <DashboardView airlines={airlines} schedules={schedules} promos={promos} />
          )}
          {section === "airlines" && (
            <AirlinesManager airlines={airlines} setAirlines={setAirlines} schedules={schedules} setSchedules={setSchedules} />
          )}
          {section === "schedules" && (
            <SchedulesManager schedules={schedules} setSchedules={setSchedules} airlines={airlines} />
          )}
          {section === "promos" && (
            <PromosManager promos={promos} setPromos={setPromos} />
          )}
        </main>
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
        "group w-full rounded-2xl border transition-all duration-200 flex items-center gap-4 p-4 text-left",
        "hover:scale-[1.02] hover:shadow-lg",
        active
          ? "border-blue-200/60 bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-lg shadow-blue-500/10"
          : "border-slate-200/40 dark:border-slate-700/40 hover:border-slate-300/60 dark:hover:border-slate-600/60 hover:bg-white/60 dark:hover:bg-slate-800/60"
      )}
    >
      <div className={clsx(
        "p-2.5 rounded-xl transition-all duration-200",
        active
          ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg"
          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
      )}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className={clsx(
          "font-medium transition-colors",
          active ? "text-slate-900 dark:text-slate-100" : "text-slate-700 dark:text-slate-300"
        )}>
          {label}
        </div>
        {sublabel && (
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {sublabel}
          </div>
        )}
      </div>

      {count !== undefined && (
        <div className={clsx(
          "px-2.5 py-1 rounded-full text-xs font-medium transition-all",
          active
            ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
            : "bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400"
        )}>
          {count}
        </div>
      )}
    </button>
  );
}

function EnhancedBrandCard() {
  return (
    <div className="p-6 rounded-3xl border border-white/50 dark:border-slate-700/50 bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-800/80 dark:to-slate-800/40 backdrop-blur">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <div>
          <div className="font-bold text-lg bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
            AirBook
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Admin Dashboard</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium border border-emerald-200/30 dark:border-emerald-800/30">
          Airlines
        </span>
        <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-200/30 dark:border-blue-800/30">
          Schedules
        </span>
        <span className="px-2 py-1 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200/30 dark:border-purple-800/30">
          Promos
        </span>
      </div>
    </div>
  );
}

// Icon Components
function DashboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function AirlineIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function ScheduleIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function PromoIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
}

function KPIBar({ airlines, schedules, promos }: { airlines: Airline[]; schedules: FlightSchedule[]; promos: Promo[] }) {
  const ontime = schedules.filter(s => s.status === "ON_TIME").length;
  const delayed = schedules.filter(s => s.status === "DELAYED").length;
  // const cancelled = schedules.filter(s => s.status === "CANCELLED").length;
  const activePromos = promos.filter(p => p.active).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <EnhancedKPI
        title="Airlines"
        value={airlines.length}
        subtitle={`${airlines.filter(a => a.active).length} active`}
        icon={<AirlineIcon />}
        trend="+2 this month"
        trendUp={true}
        tone="blue"
      />
      <EnhancedKPI
        title="Flight Schedules"
        value={schedules.length}
        subtitle="total routes"
        icon={<ScheduleIcon />}
        trend="+12 this week"
        trendUp={true}
        tone="purple"
      />
      <EnhancedKPI
        title="On-Time Performance"
        value={`${schedules.length > 0 ? Math.round((ontime / schedules.length) * 100) : 0}%`}
        subtitle={`${ontime} of ${schedules.length} flights`}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        trend={delayed > 0 ? `${delayed} delayed` : "All on-time"}
        trendUp={delayed === 0}
        tone="emerald"
      />
      <EnhancedKPI
        title="Active Promotions"
        value={activePromos}
        subtitle={`of ${promos.length} total`}
        icon={<PromoIcon />}
        trend="2 ending soon"
        trendUp={false}
        tone="amber"
      />
    </div>
  );
}

function EnhancedKPI({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendUp,
  tone = "blue"
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  tone?: "blue" | "purple" | "emerald" | "amber" | "rose";
}) {
  const toneClasses = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-200/30 dark:border-blue-800/30",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-200/30 dark:border-purple-800/30",
    emerald: "from-emerald-500/10 to-emerald-600/5 border-emerald-200/30 dark:border-emerald-800/30",
    amber: "from-amber-500/10 to-amber-600/5 border-amber-200/30 dark:border-amber-800/30",
    rose: "from-rose-500/10 to-rose-600/5 border-rose-200/30 dark:border-rose-800/30"
  };

  const iconClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
    purple: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
    emerald: "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white",
    amber: "bg-gradient-to-br from-amber-500 to-amber-600 text-white",
    rose: "bg-gradient-to-br from-rose-500 to-rose-600 text-white"
  };

  return (
    <div className={clsx(
      "group relative rounded-3xl border p-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl",
      "bg-gradient-to-br", toneClasses[tone],
      "backdrop-blur cursor-pointer"
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={clsx("p-3 rounded-2xl shadow-lg", iconClasses[tone])}>
          {icon}
        </div>

        {trend && (
          <div className={clsx(
            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            trendUp
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
          )}>
            <svg className={clsx("w-3 h-3", trendUp ? "rotate-0" : "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            {trend}
          </div>
        )}
      </div>

      <div>
        <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{title}</div>
        {subtitle && (
          <div className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</div>
        )}
      </div>

      {/* Subtle hover effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
}

// ============== Dashboard View =================
function DashboardView({ airlines, schedules, promos }: { airlines: Airline[]; schedules: FlightSchedule[]; promos: Promo[] }) {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AirBook Admin Dashboard
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Monitor and manage your airline operations with real-time insights and comprehensive controls.
        </p>
      </div>

      {/* KPI Cards */}
      <KPIBar airlines={airlines} schedules={schedules} promos={promos} />

      {/* Additional Dashboard Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Activity</h3>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-blue-500/5 border border-blue-200/30 dark:border-blue-800/30">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <AirlineIcon />
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900 dark:text-slate-100">New airline added</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Lion Air registered successfully</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">2h ago</div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-purple-500/5 border border-purple-200/30 dark:border-purple-800/30">
              <div className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center">
                <ScheduleIcon />
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900 dark:text-slate-100">Schedule updated</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">GA-410 departure time changed</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">4h ago</div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-amber-500/5 border border-amber-200/30 dark:border-amber-800/30">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <PromoIcon />
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900 dark:text-slate-100">Promotion activated</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Oktober Hemat promo is now live</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">6h ago</div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">System Status</h3>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              All Systems Operational
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="font-medium text-slate-900 dark:text-slate-100">Database</span>
              </div>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">Online</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="font-medium text-slate-900 dark:text-slate-100">API Services</span>
              </div>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">Healthy</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="font-medium text-slate-900 dark:text-slate-100">Booking System</span>
              </div>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 dark:bg-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="font-medium text-slate-900 dark:text-slate-100">Payment Gateway</span>
              </div>
              <span className="text-sm text-amber-600 dark:text-amber-400">Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Quick Actions</h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="p-4 rounded-2xl border border-blue-200/30 dark:border-blue-800/30 bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:from-blue-500/15 hover:to-blue-600/10 transition-all duration-200 text-left group hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 group-hover:shadow-lg transition-all duration-200">
              <AirlineIcon />
            </div>
            <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">Add Airline</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Register new carrier</div>
          </button>

          <button className="p-4 rounded-2xl border border-purple-200/30 dark:border-purple-800/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5 hover:from-purple-500/15 hover:to-purple-600/10 transition-all duration-200 text-left group hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 group-hover:shadow-lg transition-all duration-200">
              <ScheduleIcon />
            </div>
            <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">Create Schedule</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Add new flight route</div>
          </button>

          <button className="p-4 rounded-2xl border border-amber-200/30 dark:border-amber-800/30 bg-gradient-to-br from-amber-500/10 to-amber-600/5 hover:from-amber-500/15 hover:to-amber-600/10 transition-all duration-200 text-left group hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-3 group-hover:shadow-lg transition-all duration-200">
              <PromoIcon />
            </div>
            <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">Launch Promo</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Create promotion</div>
          </button>

          <button className="p-4 rounded-2xl border border-emerald-200/30 dark:border-emerald-800/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 hover:from-emerald-500/15 hover:to-emerald-600/10 transition-all duration-200 text-left group hover:scale-105">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3 group-hover:shadow-lg transition-all duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">View Reports</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Analytics dashboard</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============== Airlines Manager =================
function AirlinesManager({ airlines, setAirlines, schedules, setSchedules }: { airlines: Airline[]; setAirlines: React.Dispatch<React.SetStateAction<Airline[]>>; schedules: FlightSchedule[]; setSchedules: React.Dispatch<React.SetStateAction<FlightSchedule[]>>; }) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Airline | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);
  const [sortKey, setSortKey] = useState<keyof Airline>("createdAt");
  const [dir, setDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    const f = airlines.filter(a => [a.code, a.name, a.country].some(x => x?.toLowerCase().includes(q.toLowerCase())));
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
  useEffect(() => { if (page > pages) setPage(1); }, [page, pages, setPage]);

  const handleSave = (input: Partial<Airline>) => {
    if (!input.code || !input.name || !input.country) return alert("Code, Name, Country wajib diisi");
    if (editing && editing.id) {
      setAirlines(prev => prev.map(a => (a.id === editing.id ? { ...editing, ...input } as Airline : a)));
      setEditing(null);
    } else {
      const newA: Airline = { id: uid(), code: input.code!, name: input.name!, country: input.country!, logoUrl: input.logoUrl?.trim(), active: input.active ?? true, createdAt: nowISO() };
      setAirlines(prev => [newA, ...prev]);
    }
  };

  const handleDelete = (id: UUID) => {
    const used = schedules.some(s => s.airlineId === id);
    if (used) {
      if (!confirm("Maskapai dipakai di jadwal. Menghapus akan menghapus jadwal terkait. Lanjut?")) return;
      setSchedules(prev => prev.filter(s => s.airlineId !== id));
    }
    setAirlines(prev => prev.filter(a => a.id !== id));
  };

  return (
    <section className="space-y-3">
      <Header title="Maskapai" subtitle="Kelola daftar maskapai (Create, Read, Update, Delete)">
        <div className="flex items-center gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari kode/nama/negara..." className="input max-w-xs" />
          <SortChip label="Kode" active={sortKey === "code"} dir={dir} onClick={() => toggleSort("code")} />
          <SortChip label="Nama" active={sortKey === "name"} dir={dir} onClick={() => toggleSort("name")} />
          <SortChip label="Negara" active={sortKey === "country"} dir={dir} onClick={() => toggleSort("country")} />
          <AddButton onClick={() => setEditing({ id: "", code: "", name: "", country: "", active: true, createdAt: nowISO() })}>
            Tambah Maskapai
          </AddButton>
        </div>
      </Header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            + <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur dark:bg-slate-900/90">
              <tr className="border-b border-slate-200/30 dark:border-slate-700/30">
                <th className="py-4 px-2 font-semibold text-slate-600 dark:text-slate-400">Logo</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Code</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Name</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Country</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((a, index) => (
                <tr
                  key={a.id}
                  className={clsx(
                    "group border-b border-slate-200/20 dark:border-slate-700/20 transition-all duration-200 hover:bg-white/40 dark:hover:bg-slate-800/40",
                    index % 2 === 0 ? "bg-white/20 dark:bg-slate-800/20" : "bg-transparent"
                  )}
                >
                  <td className="py-4 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center overflow-hidden shadow-sm">
                      {a.logoUrl ? (
                        <img src={a.logoUrl} alt={a.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                      ) : (
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{a.code}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-mono font-medium border border-blue-200/30 dark:border-blue-800/30">
                      {a.code}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{a.name}</div>
                  </td>
                  <td className="py-4 px-3 text-slate-600 dark:text-slate-400">{a.country}</td>
                  <td className="py-4 px-3">
                    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", a.active ? "badge-ok" : "badge-dim")}>
                      <span className={clsx("w-1.5 h-1.5 rounded-full", a.active ? "bg-emerald-500" : "bg-slate-400")} />
                      {a.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(a)}
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                        title="Edit airline"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
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
              {filtered.length === 0 && (
                <EmptyRow colSpan={6} message="No airlines found. Add your first airline to get started." />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} pages={pages} size={size} onPage={setPage} onSize={setSize} />

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Maskapai" : "Tambah Maskapai"}>
          <AirlineForm
            value={editing}
            onCancel={() => setEditing(null)}
            onSubmit={(v) => handleSave(v)}
          />
        </Modal>
      )}
    </section>
  );

  function toggleSort(k: keyof Airline) {
    if (sortKey === k) setDir(d => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setDir("asc"); }
  }
}

function AirlineForm({ value, onSubmit, onCancel }: { value: Partial<Airline>; onSubmit: (v: Partial<Airline>) => void; onCancel: () => void; }) {
  const [form, setForm] = useState<Partial<Airline>>({ ...value });
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
      className="space-y-3"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <label className="field">
          <span>Kode</span>
          <input className="input" value={form.code ?? ""} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().slice(0, 3) })} placeholder="GA" />
        </label>
        <label className="field">
          <span>Nama</span>
          <input className="input" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Garuda Indonesia" />
        </label>
        <label className="field">
          <span>Negara</span>
          <input className="input" value={form.country ?? ""} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Indonesia" />
        </label>
        <label className="field">
          <span>Logo URL (opsional)</span>
          <input className="input" value={form.logoUrl ?? ""} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://..." />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.active ?? true} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          <span>Aktif</span>
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Batal</button>
        <button className="btn-primary" type="submit">Simpan</button>
      </div>
    </form>
  );
}

// ============== Schedules Manager =================
function SchedulesManager({ schedules, setSchedules, airlines }: { schedules: FlightSchedule[]; setSchedules: React.Dispatch<React.SetStateAction<FlightSchedule[]>>; airlines: Airline[]; }) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<FlightSchedule | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);

  const rows = useMemo(() => {
    const lower = q.toLowerCase();
    return schedules.filter(s => [s.flightNo, s.origin, s.destination, airlines.find(a => a.id === s.airlineId)?.name].some(x => x?.toLowerCase().includes(lower)));
  }, [q, schedules, airlines]);

  const paged = useMemo(() => {
    const start = (page - 1) * size;
    return rows.slice(start, start + size);
  }, [rows, page, size]);

  const pages = Math.max(1, Math.ceil(rows.length / size));
  useEffect(() => { if (page > pages) setPage(1); }, [page, pages, setPage]);

  const handleSave = (input: Partial<FlightSchedule>) => {
    if (!input.airlineId || !input.flightNo || !input.origin || !input.destination || !input.departure || !input.arrival) {
      return alert("Semua field wajib diisi (kecuali catatan)");
    }
    const basePrice = Number(input.basePrice ?? 0);
    const seats = Number(input.seats ?? 0);
    if (Number.isNaN(basePrice) || Number.isNaN(seats)) return alert("Harga/Seats harus angka");

    if (editing && editing.id) {
      setSchedules(prev => prev.map(s => (s.id === editing.id ? { ...editing, ...input, basePrice, seats } as FlightSchedule : s)));
      setEditing(null);
    } else {
      const ns: FlightSchedule = {
        id: uid(),
        airlineId: input.airlineId!,
        flightNo: input.flightNo!,
        origin: input.origin!,
        destination: input.destination!,
        departure: input.departure!,
        arrival: input.arrival!,
        basePrice,
        seats,
        status: (input.status as FlightSchedule["status"]) ?? "ON_TIME",
        createdAt: nowISO(),
      };
      setSchedules(prev => [ns, ...prev]);
    }
  };

  const handleDelete = (id: UUID) => setSchedules(prev => prev.filter(s => s.id !== id));

  return (
    <section className="space-y-3">
      <Header title="Jadwal Penerbangan" subtitle="Kelola jadwal, harga, dan status">
        <div className="flex items-center gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari flight no / rute / maskapai..." className="input max-w-sm" />
          <AddButton onClick={() => setEditing({ id: "", airlineId: airlines[0]?.id, flightNo: "", origin: "", destination: "", departure: new Date().toISOString().slice(0, 16), arrival: new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 16), basePrice: 0, seats: 180, status: "ON_TIME", createdAt: nowISO() })}>
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
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium">{s.origin}</span>
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium">{s.destination}</span>
                      </div>
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
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{rupiah(s.basePrice)}</div>
                    </td>
                    <td className="py-4 px-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-500/10 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200/30 dark:border-slate-700/30">
                        {s.seats}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <span className={clsx(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        s.status === "ON_TIME" && "badge-ok",
                        s.status === "DELAYED" && "badge-warn",
                        s.status === "CANCELLED" && "badge-danger"
                      )}>
                        <span className={clsx(
                          "w-1.5 h-1.5 rounded-full",
                          s.status === "ON_TIME" && "bg-emerald-500",
                          s.status === "DELAYED" && "bg-amber-500",
                          s.status === "CANCELLED" && "bg-red-500"
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
                <EmptyRow colSpan={9} message="No flight schedules found. Add your first schedule to get started." />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} pages={pages} size={size} onPage={setPage} onSize={setSize} />

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Jadwal" : "Tambah Jadwal"}>
          <ScheduleForm
            airlines={airlines}
            value={editing}
            onCancel={() => setEditing(null)}
            onSubmit={(v) => handleSave(v)}
          />
        </Modal>
      )}
    </section>
  );
}

function ScheduleForm({ value, onSubmit, onCancel, airlines }: { value: Partial<FlightSchedule>; onSubmit: (v: Partial<FlightSchedule>) => void; onCancel: () => void; airlines: Airline[]; }) {
  const [form, setForm] = useState<Partial<FlightSchedule>>({ ...value });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="field">
          <span>Maskapai</span>
          <select className="input" value={form.airlineId ?? ""} onChange={(e) => setForm({ ...form, airlineId: e.target.value })}>
            {airlines.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Nomor Penerbangan</span>
          <input className="input" value={form.flightNo ?? ""} onChange={(e) => setForm({ ...form, flightNo: e.target.value.toUpperCase() })} placeholder="GA-410" />
        </label>
        <label className="field">
          <span>Origin (IATA)</span>
          <input className="input" value={form.origin ?? ""} onChange={(e) => setForm({ ...form, origin: e.target.value.toUpperCase().slice(0, 3) })} placeholder="CGK" />
        </label>
        <label className="field">
          <span>Destination (IATA)</span>
          <input className="input" value={form.destination ?? ""} onChange={(e) => setForm({ ...form, destination: e.target.value.toUpperCase().slice(0, 3) })} placeholder="DPS" />
        </label>
        <label className="field">
          <span>Berangkat</span>
          <input type="datetime-local" className="input" value={(form.departure ?? "").slice(0, 16)} onChange={(e) => setForm({ ...form, departure: e.target.value })} />
        </label>
        <label className="field">
          <span>Tiba</span>
          <input type="datetime-local" className="input" value={(form.arrival ?? "").slice(0, 16)} onChange={(e) => setForm({ ...form, arrival: e.target.value })} />
        </label>
        <label className="field">
          <span>Harga Dasar</span>
          <input type="number" className="input" value={form.basePrice ?? 0} onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })} />
        </label>
        <label className="field">
          <span>Seat</span>
          <input type="number" className="input" value={form.seats ?? 180} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} />
        </label>
        <label className="field">
          <span>Status</span>
          <select className="input" value={form.status ?? "ON_TIME"} onChange={(e) => setForm({ ...form, status: e.target.value as FlightSchedule["status"] })}>
            <option value="ON_TIME">ON_TIME</option>
            <option value="DELAYED">DELAYED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Batal</button>
        <button className="btn-primary" type="submit">Simpan</button>
      </div>
    </form>
  );
}

// ============== Promos Manager =================
function PromosManager({ promos, setPromos }: { promos: Promo[]; setPromos: React.Dispatch<React.SetStateAction<Promo[]>>; }) {
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Promo | null>(null);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(8);

  const rows = useMemo(() => {
    const lower = q.toLowerCase();
    return promos.filter(p => [p.title, p.code, p.conditions].some(x => x?.toLowerCase().includes(lower)));
  }, [q, promos]);

  const paged = useMemo(() => {
    const start = (page - 1) * size;
    return rows.slice(start, start + size);
  }, [rows, page, size]);

  const pages = Math.max(1, Math.ceil(rows.length / size));
  useEffect(() => { if (page > pages) setPage(1); }, [page, pages, setPage]);

  const handleSave = (input: Partial<Promo>) => {
    if (!input.title || !input.code || !input.startsAt || !input.endsAt) return alert("Judul, Kode, Periode wajib diisi");
    const discount = Number(input.discountPercent ?? 0);
    if (discount < 0 || discount > 100) return alert("Diskon harus 0..100");

    if (editing && editing.id) {
      setPromos(prev => prev.map(p => (p.id === editing.id ? { ...editing, ...input, discountPercent: discount } as Promo : p)));
      setEditing(null);
    } else {
      const np: Promo = {
        id: uid(),
        title: input.title!,
        code: input.code!.toUpperCase(),
        discountPercent: discount,
        startsAt: input.startsAt!,
        endsAt: input.endsAt!,
        conditions: input.conditions?.trim(),
        active: input.active ?? true,
        createdAt: nowISO(),
      };
      setPromos(prev => [np, ...prev]);
    }
  };

  const handleDelete = (id: UUID) => setPromos(prev => prev.filter(p => p.id !== id));

  return (
    <section className="space-y-3">
      <Header title="Promo" subtitle="Kelola kode promo dan periode berlakunya">
        <div className="flex items-center gap-2">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cari judul/kode/ketentuan..." className="input max-w-sm" />
          <AddButton onClick={() => setEditing({ id: "", title: "", code: "", discountPercent: 10, startsAt: new Date().toISOString().slice(0, 10), endsAt: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10), conditions: "", active: true, createdAt: nowISO() })}>
            Tambah Promo
          </AddButton>
        </div>
      </Header>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-white/90 backdrop-blur dark:bg-slate-900/90">
              <tr className="border-b border-slate-200/30 dark:border-slate-700/30">
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Judul</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Kode</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Diskon</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Periode</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400">Status</th>
                <th className="py-4 px-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p, index) => (
                <tr
                  key={p.id}
                  className={clsx(
                    "group border-b border-slate-200/20 dark:border-slate-700/20 transition-all duration-200 hover:bg-white/40 dark:hover:bg-slate-800/40",
                    index % 2 === 0 ? "bg-white/20 dark:bg-slate-800/20" : "bg-transparent"
                  )}
                >
                  <td className="py-4 px-3">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{p.title}</div>
                    {p.conditions && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{p.conditions}</div>
                    )}
                  </td>
                  <td className="py-4 px-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 text-sm font-mono font-medium border border-amber-200/30 dark:border-amber-800/30">
                      {p.code}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{p.discountPercent}%</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">OFF</span>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium">{p.startsAt}</span>
                        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-medium">{p.endsAt}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <span className={clsx("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", p.active ? "badge-ok" : "badge-dim")}>
                      <span className={clsx("w-1.5 h-1.5 rounded-full", p.active ? "bg-emerald-500" : "bg-slate-400")} />
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditing(p)}
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-200"
                        title="Edit promo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        title="Delete promo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <EmptyRow colSpan={6} message="No promotions found. Create your first promotion to get started." />
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} pages={pages} size={size} onPage={setPage} onSize={setSize} />

      {editing && (
        <Modal onClose={() => setEditing(null)} title={editing.id ? "Edit Promo" : "Tambah Promo"}>
          <PromoForm value={editing} onCancel={() => setEditing(null)} onSubmit={(v) => handleSave(v)} />
        </Modal>
      )}
    </section>
  );
}

function PromoForm({ value, onSubmit, onCancel }: { value: Partial<Promo>; onSubmit: (v: Partial<Promo>) => void; onCancel: () => void; }) {
  const [form, setForm] = useState<Partial<Promo>>({ ...value });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="field">
          <span>Judul</span>
          <input className="input" value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="field">
          <span>Kode</span>
          <input className="input" value={form.code ?? ""} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replaceAll(" ", "") })} />
        </label>
        <label className="field">
          <span>Diskon (%)</span>
          <input type="number" className="input" value={form.discountPercent ?? 0} onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })} />
        </label>
        <label className="field">
          <span>Mulai</span>
          <input type="date" className="input" value={form.startsAt ?? ""} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
        </label>
        <label className="field">
          <span>Selesai</span>
          <input type="date" className="input" value={form.endsAt ?? ""} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
        </label>
        <label className="field md:col-span-2">
          <span>Syarat/Ketentuan</span>
          <textarea className="input min-h-24" value={form.conditions ?? ""} onChange={(e) => setForm({ ...form, conditions: e.target.value })} />
        </label>
        <label className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" checked={form.active ?? true} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
          <span>Aktif</span>
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Batal</button>
        <button className="btn-primary" type="submit">Simpan</button>
      </div>
    </form>
  );
}

// ============== Reusable UI =================
function Header({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-2 md:mb-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Data Available</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{message}</div>
        </div>
      </td>
    </tr>
  );
}

function Pagination({ page, pages, size, onPage, onSize }: { page: number; pages: number; size: number; onPage: (n: number) => void; onSize: (n: number) => void; }) {
  const pageNumbers = Array.from({ length: Math.min(5, pages) }, (_, i) => {
    const start = Math.max(1, Math.min(page - 2, pages - 4));
    return start + i;
  }).filter(p => p <= pages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      <div className="flex items-center gap-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Page <span className="font-medium">{page}</span> of <span className="font-medium">{pages}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600 dark:text-slate-400">Show:</label>
          <select
            className="h-9 w-20 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={size}
            onChange={(e) => onSize(Number(e.target.value))}
          >
            {[5, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200"
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map(p => (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={clsx(
                "w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200",
                p === page
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60"
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/60 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200"
          onClick={() => onPage(Math.min(pages, page + 1))}
          disabled={page >= pages}
        >
          Next
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title?: string; children?: React.ReactNode; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/70 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tekan <kbd className="rounded border px-1">Esc</kbd> untuk menutup</p>
          </div>
          <button className="rounded-xl border border-slate-300 px-3 py-1 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" onClick={onClose}>✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

function AddButton({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      {children}
    </button>
  );
}

function SortChip({ label, active, dir, onClick }: { label: string; active?: boolean; dir?: SortDir; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105",
        active
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
          : "bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 hover:bg-white/80 dark:hover:bg-slate-800/80"
      )}
    >
      {label}
      {active && (
        <svg className={clsx("w-3 h-3 transition-transform", dir === "desc" ? "rotate-180" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      )}
    </button>
  );
}