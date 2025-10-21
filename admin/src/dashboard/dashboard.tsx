import { KPIBar } from "../components/KPIBar";
import { AirlineIcon, ScheduleIcon, PromoIcon } from "../components/Icons";
import { useData } from "../contexts/DataContext";

// ============== Dashboard View =================
export function DashboardView() {
  const {
    airlines,
    airlinesLoading,
    airlinesError,
    schedules,
    schedulesLoading,
    schedulesError,
    promos,
    promosLoading,
    promosError
  } = useData();

  // Loading state
  if (airlinesLoading || schedulesLoading || promosLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (airlinesError || schedulesError || promosError) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-red-600">Error Loading Dashboard</h2>
        <div className="space-y-2 text-sm text-red-500">
          {airlinesError && <p>Airlines: {airlinesError}</p>}
          {schedulesError && <p>Schedules: {schedulesError}</p>}
          {promosError && <p>Promotions: {promosError}</p>}
        </div>
      </div>
    );
  }
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

      {/* Operational Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Flight Performance */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Flight Performance</h3>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Routes</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{schedules.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">On-Time Flights</span>
              <span className="font-semibold text-emerald-600">{schedules.filter(s => s.status === "SCHEDULED").length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Delayed Flights</span>
              <span className="font-semibold text-amber-600">{schedules.filter(s => s.status === "DELAYED").length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Cancelled</span>
              <span className="font-semibold text-red-600">{schedules.filter(s => s.status === "CANCELLED").length}</span>
            </div>
          </div>
        </div>

        {/* Airline Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Airlines Overview</h3>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Airlines</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{airlines.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Active Airlines</span>
              <span className="font-semibold text-emerald-600">{airlines.filter(a => a.isActive).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Inactive Airlines</span>
              <span className="font-semibold text-slate-500">{airlines.filter(a => !a.isActive).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Coverage Rate</span>
              <span className="font-semibold text-blue-600">{airlines.length > 0 ? Math.round((airlines.filter(a => a.isActive).length / airlines.length) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Promotions Status */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Promotions</h3>
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Promotions</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{promos.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Active Promos</span>
              <span className="font-semibold text-emerald-600">{promos.filter(p => p.isActive).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Expired</span>
              <span className="font-semibold text-slate-500">{promos.filter(p => !p.isActive).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Success Rate</span>
              <span className="font-semibold text-green-600">{promos.length > 0 ? Math.round((promos.filter(p => p.isActive).length / promos.length) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="card">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Today's Operations Summary</h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-200/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Scheduled Flights</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{schedules.filter(s => s.status === "SCHEDULED").length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ready for departure</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 border border-emerald-200/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">On-Time Rate</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {schedules.length > 0 ? Math.round((schedules.filter(s => s.status === "SCHEDULED").length / schedules.length) * 100) : 0}%
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Performance metric</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/5 to-amber-600/5 border border-amber-200/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Active Promotions</span>
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{promos.filter(p => p.isActive).length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Running campaigns</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/5 to-purple-600/5 border border-purple-200/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Airline Partners</span>
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{airlines.filter(a => a.isActive).length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Active carriers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
