// =============================================================
// AirBook Admin — KPI Bar Component
// =============================================================

import type { Airline, FlightSchedule, Promo } from "../types";
import { clsx } from "../utils";
import { AirlineIcon, ScheduleIcon, PromoIcon } from "./Icons";

export function KPIBar({ airlines, schedules, promos }: { airlines: Airline[]; schedules: FlightSchedule[]; promos: Promo[] }) {
  const ontime = schedules.filter(s => s.status === "ON_TIME").length;
  const delayed = schedules.filter(s => s.status === "DELAYED").length;
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
            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
            trendUp ? "text-emerald-700 dark:text-emerald-300 bg-emerald-500/10" : "text-amber-700 dark:text-amber-300 bg-amber-500/10"
          )}>
            <svg className={clsx("w-3 h-3", trendUp ? "text-emerald-500" : "text-amber-500")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trendUp ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
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