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
