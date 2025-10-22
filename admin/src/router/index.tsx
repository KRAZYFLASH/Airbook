// =============================================================
// AirBook Admin — Router Configuration (Simplified)
// =============================================================

import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { DataProvider } from "../contexts/DataContext";
import { ProtectedRoute } from "../components/Auth";
import { AdminLayout } from "../components/Layout";

// Pages
import { DashboardView } from "../dashboard/dashboard";
import AirlinesManager from "../dashboard/airlines";
import { SchedulesManager } from "../dashboard/flight-schedule";
import { PromosManager } from "../dashboard/promotions";
import AirportsManager from "../dashboard/airports";
import { CountriesManager } from "../dashboard/countries";
import { CitiesManager } from "../dashboard/cities";

// ---------------------------------------------------------------------
// Root layout: wraps all pages with Providers + Auth guard + Admin shell
// ---------------------------------------------------------------------
function RootLayout() {
    return (
        <AuthProvider>
            <ProtectedRoute>
                <DataProvider>
                    <AdminLayout>
                        <Outlet />
                    </AdminLayout>
                </DataProvider>
            </ProtectedRoute>
        </AuthProvider>
    );
}

// ---------------------------------------------------------------------
// Router (nested routes, no repetition)
// ---------------------------------------------------------------------
export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <Navigate to="dashboard" replace /> },
            { path: "dashboard", element: <DashboardView /> },
            { path: "airlines", element: <AirlinesManager /> },
            { path: "flightSchedule", element: <SchedulesManager /> },
            { path: "promotions", element: <PromosManager /> },
            { path: "airports", element: <AirportsManager /> },
            { path: "countries", element: <CountriesManager /> },
            { path: "cities", element: <CitiesManager /> },
            { path: "*", element: <Navigate to="/dashboard" replace /> },
        ],
    },
]);
