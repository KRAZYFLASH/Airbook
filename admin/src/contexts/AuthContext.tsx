// =============================================================
// AirBook Admin — Auth Context
// =============================================================

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export interface User {
    id: string;
    username: string;
    role: "admin" | "superadmin";
    name: string;
    email: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy users - dalam implementasi nyata ini harus dari backend/database
const ADMIN_USERS = [
    {
        id: "1",
        username: "admin",
        password: "admin123", // Dalam produksi harus di-hash
        role: "admin" as const,
        name: "Administrator",
        email: "admin@airbook.com",
        avatar: "https://ui-avatars.com/api/?name=Admin&background=3b82f6&color=fff"
    },
    {
        id: "2",
        username: "superadmin",
        password: "super123", // Dalam produksi harus di-hash
        role: "superadmin" as const,
        name: "Super Administrator",
        email: "superadmin@airbook.com",
        avatar: "https://ui-avatars.com/api/?name=Super+Admin&background=8b5cf6&color=fff"
    }
];

const AUTH_STORAGE_KEY = "airbook_admin_auth";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Cek localStorage untuk user yang sudah login
        const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedAuth) {
            try {
                const authData = JSON.parse(savedAuth);
                if (authData.user && authData.expiresAt > Date.now()) {
                    setUser(authData.user);
                } else {
                    localStorage.removeItem(AUTH_STORAGE_KEY);
                }
            } catch {
                localStorage.removeItem(AUTH_STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        // Simulasi delay API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        const adminUser = ADMIN_USERS.find(
            u => u.username === username && u.password === password
        );

        if (adminUser) {
            const user: User = {
                id: adminUser.id,
                username: adminUser.username,
                role: adminUser.role,
                name: adminUser.name,
                email: adminUser.email,
                avatar: adminUser.avatar
            };

            setUser(user);

            // Simpan ke localStorage dengan expiry 24 jam
            const authData = {
                user,
                expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 jam
            };
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}