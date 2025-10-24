import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
    register: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
    children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && !!token;

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const storedToken = localStorage.getItem('airbook_token');
                const storedUser = localStorage.getItem('airbook_user');

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                // Clear invalid data
                localStorage.removeItem('airbook_token');
                localStorage.removeItem('airbook_user');
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
        try {
            setIsLoading(true);

            const response = await fetch('http://localhost:3001/api/auth/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                const { token: newToken, user: userData } = data.data;

                // Store in state
                setToken(newToken);
                setUser(userData);

                // Store in localStorage
                localStorage.setItem('airbook_token', newToken);
                localStorage.setItem('airbook_user', JSON.stringify(userData));

                return { success: true, message: 'Login successful' };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        } finally {
            setIsLoading(false);
        }
    };

    // Register function
    const register = async (name: string, email: string, password: string, confirmPassword: string): Promise<{ success: boolean; message: string }> => {
        try {
            setIsLoading(true);

            const response = await fetch('http://localhost:3001/api/auth/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, confirmPassword }),
            });

            const data = await response.json();

            if (data.success && data.data) {
                const { token: newToken, user: userData } = data.data;

                // Store in state
                setToken(newToken);
                setUser(userData);

                // Store in localStorage
                localStorage.setItem('airbook_token', newToken);
                localStorage.setItem('airbook_user', JSON.stringify(userData));

                return { success: true, message: 'Registration successful' };
            } else {
                return { success: false, message: data.message || 'Registration failed' };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, message: 'Network error. Please try again.' };
        } finally {
            setIsLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('airbook_token');
        localStorage.removeItem('airbook_user');
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// HOC for protected components
export const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
    return (props: P) => {
        const { isAuthenticated, isLoading } = useAuth();

        if (isLoading) {
            return (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            );
        }

        if (!isAuthenticated) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
                        <p className="text-gray-600 mb-6">You need to login to access this feature.</p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            );
        }

        return <Component {...props} />;
    };
};