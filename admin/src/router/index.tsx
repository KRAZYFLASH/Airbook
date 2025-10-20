// =============================================================
// AirBook Admin — Router Configuration
// =============================================================

import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { DataProvider } from "../contexts/DataContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AdminLayout } from "../components/AdminLayout";
import { DashboardView } from "../dashboard/dashboard";
import { AirlinesManager } from "../dashboard/airlines_styled";
import { SchedulesManager } from "../dashboard/flightSchedule";
import { PromosManager } from "../dashboard/promotion";
import DatabaseAirportsStyled from "../dashboard/databaseAirports_styled";
import { CountriesManager } from "../dashboard/countries";
import { CitiesManager } from "../dashboard/cities";

// Layout Wrapper Component
function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <DataProvider>
            <AdminLayout>
                {children}
            </AdminLayout>
        </DataProvider>
    );
}

// Route Components
function DashboardPage() {
    return <DashboardView />;
}

function AirlinesPage() {
    return <AirlinesManager />;
}

function FlightSchedulePage() {
    return <SchedulesManager />;
}

function PromotionsPage() {
    return <PromosManager />;
}

function AirportsPage() {
    return <DatabaseAirportsStyled />;
}

function CountriesPage() {
    return <CountriesManager />;
}

function CitiesPage() {
    return <CitiesManager />;
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <ProtectedRoute>
                    <LayoutWrapper>
                        <Navigate to="/dashboard" replace />
                    </LayoutWrapper>
                </ProtectedRoute>
            </AuthProvider>
        ),
    },
    {
        path: "/dashboard",
        element: (
            <AuthProvider>
                <ProtectedRoute>
                    <LayoutWrapper>
                        <DashboardPage />
                    </LayoutWrapper>
                </ProtectedRoute>
            </AuthProvider>
        ),
    },
    {
        path: "/airlines",
        element: (
            <AuthProvider>
                <ProtectedRoute>
                    <LayoutWrapper>
                        <AirlinesPage />
                    </LayoutWrapper>
                </ProtectedRoute>
            </AuthProvider>
        ),
    },
    {
        path: "/flightSchedule",
        element: (
            <AuthProvider>
                <ProtectedRoute>
                    <LayoutWrapper>
                        <FlightSchedulePage />
                    </LayoutWrapper>
                </ProtectedRoute>
            </AuthProvider>
        ),
    },
    {
        path: "/promotions",
        element: (
            <AuthProvider>
                <ProtectedRoute>
                    <LayoutWrapper>
                        <PromotionsPage />
                    </LayoutWrapper>
                </ProtectedRoute>
            </AuthProvider>
        ),
    },
    {
        path: "/airports",
        element: (
            <AuthProvider>
                <ProtectedRoute>
                    <LayoutWrapper>
                        <AirportsPage />
                    </LayoutWrapper>
                </ProtectedRoute>
            </AuthProvider>
        ),
    },
    {
        path: "/countries",
        element: (
            <AuthProvider>
                <ProtectedRoute>
                    <LayoutWrapper>
                        <CountriesPage />
                    </LayoutWrapper>
                </ProtectedRoute>
            </AuthProvider>
        ),
    },
    {
        path: "/cities",
        element: (
            <AuthProvider>
                <ProtectedRoute>
                    <LayoutWrapper>
                        <CitiesPage />
                    </LayoutWrapper>
                </ProtectedRoute>
            </AuthProvider>
        ),
    },
    {
        path: "*",
        element: (
            <AuthProvider>
                <ProtectedRoute>
                    <LayoutWrapper>
                        <Navigate to="/dashboard" replace />
                    </LayoutWrapper>
                </ProtectedRoute>
            </AuthProvider>
        ),
    },
]);