// =============================================================
// AirBook Admin — Protected Route
// =============================================================

import { useAuth } from "../contexts/AuthContext";
import { LoginPage } from "./LoginPage";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg animate-pulse">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </div>
                    <div className="space-y-2">
                        <div className="text-xl font-semibold text-slate-700">AirBook Admin</div>
                        <div className="text-slate-500">Loading...</div>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    // Not authenticated - show login
    if (!isAuthenticated || !user) {
        return <LoginPage />;
    }

    // Authenticated - show protected content
    return <>{children}</>;
}