// =============================================================
// AirBook Admin — Charts & Data Visualization Components
// =============================================================

import type { Airline, FlightSchedule, Promo } from "../types";
import { clsx } from "../utils";
import { AirlineIcon, ScheduleIcon, PromoIcon } from "./Icons";

// ============== Main KPI Dashboard Chart ==============
export function Chart({ airlines, schedules, promos }: { airlines: Airline[]; schedules: FlightSchedule[]; promos: Promo[] }) {
  const scheduledFlights = schedules.filter(s => s.status === "SCHEDULED").length;
  const delayedFlights = schedules.filter(s => s.status === "DELAYED").length;
  // const cancelledFlights = schedules.filter(s => s.status === "CANCELLED").length;
  const activeAirlines = airlines.filter(a => a.isActive).length;
  const activePromos = promos.filter(p => p.isActive).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <EnhancedKPI
        title="Airlines"
        value={airlines.length}
        subtitle={`${activeAirlines} active`}
        icon={<AirlineIcon />}
        trend={`${activeAirlines}/${airlines.length} operational`}
        trendUp={activeAirlines > airlines.length / 2}
        tone="blue"
      />
      <EnhancedKPI
        title="Flight Schedules"
        value={schedules.length}
        subtitle="total routes"
        icon={<ScheduleIcon />}
        trend={scheduledFlights > 0 ? `${scheduledFlights} scheduled` : "No flights scheduled"}
        trendUp={scheduledFlights > 0}
        tone="purple"
      />
      <EnhancedKPI
        title="On-Time Performance"
        value={`${schedules.length > 0 ? Math.round((scheduledFlights / schedules.length) * 100) : 0}%`}
        subtitle={`${scheduledFlights} of ${schedules.length} flights`}
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        trend={delayedFlights > 0 ? `${delayedFlights} delayed` : "All on-time"}
        trendUp={delayedFlights === 0}
        tone="emerald"
      />
      <EnhancedKPI
        title="Active Promotions"
        value={activePromos}
        subtitle={`of ${promos.length} total`}
        icon={<PromoIcon />}
        trend={activePromos === promos.length ? "All active" : `${promos.length - activePromos} inactive`}
        trendUp={activePromos > 0}
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

// ============== Bar Chart Component ==============
export function BarChart({ data, title, className }: {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  className?: string;
}) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={clsx("p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{title}</h3>
      )}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0 w-16 text-sm text-slate-600 dark:text-slate-400">
              {item.label}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={clsx(
                      "h-full rounded-full transition-all duration-500",
                      item.color || "bg-blue-500"
                    )}
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
                <div className="flex-shrink-0 w-8 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {item.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== Line Chart Component ==============
export function LineChart({ data, title, className }: {
  data: { label: string; value: number }[];
  title?: string;
  className?: string;
}) {
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((item.value / maxValue) * 80); // 80% of height for chart area
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className={clsx("p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{title}</h3>
      )}
      <div className="relative h-48">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            points={points}
            className="text-blue-500"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((item.value / maxValue) * 80);
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1"
                fill="currentColor"
                className="text-blue-500"
              />
            );
          })}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============== Pie Chart Component ==============
export function PieChart({ data, title, className }: {
  data: { label: string; value: number; color: string }[];
  title?: string;
  className?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className={clsx("p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700", className)}>
      {title && (
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">{title}</h3>
      )}
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="1"
              className="text-slate-200 dark:text-slate-700"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const strokeDasharray = `${percentage} ${100 - percentage}`;
              const strokeDashoffset = -cumulativePercentage;
              cumulativePercentage += percentage;

              return (
                <circle
                  key={index}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="4"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100 ml-auto">
                {item.value} ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}