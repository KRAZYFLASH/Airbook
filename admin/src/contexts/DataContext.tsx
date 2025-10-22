// =============================================================
// AirBook Admin — API Data Provider
// =============================================================

import React, { createContext, useContext, useEffect, useState } from "react";
import type { Airline, FlightSchedule, Promo } from "../types";
import { airlinesApi, flightSchedulesApi, promotionsApi, destinationsApi } from "../services/api";
import { useMutation } from "../hooks/useApi";

interface DataContextType {
    // Airlines
    airlines: Airline[];
    airlinesLoading: boolean;
    airlinesError: string | null;
    refetchAirlines: () => Promise<void>;
    createAirline: (data: Partial<Airline>) => Promise<void>;
    updateAirline: (id: string, data: Partial<Airline>) => Promise<void>;
    deleteAirline: (id: string) => Promise<void>;

    // Flight Schedules
    schedules: FlightSchedule[];
    schedulesLoading: boolean;
    schedulesError: string | null;
    refetchSchedules: () => Promise<void>;
    createSchedule: (data: Partial<FlightSchedule>) => Promise<void>;
    updateSchedule: (id: string, data: Partial<FlightSchedule>) => Promise<void>;
    deleteSchedule: (id: string) => Promise<void>;

    // Promotions
    promos: Promo[];
    promosLoading: boolean;
    promosError: string | null;
    refetchPromos: () => Promise<void>;
    createPromo: (data: Partial<Promo>) => Promise<void>;
    updatePromo: (id: string, data: Partial<Promo>) => Promise<void>;
    deletePromo: (id: string) => Promise<void>;

    // Destinations
    destinations: unknown[];
    destinationsLoading: boolean;
    destinationsError: string | null;
    refetchDestinations: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}

interface DataProviderProps {
    children: React.ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
    // Airlines state
    const [airlines, setAirlines] = useState<Airline[]>([]);
    const [airlinesLoading, setAirlinesLoading] = useState(true);
    const [airlinesError, setAirlinesError] = useState<string | null>(null);

    // Flight Schedules state
    const [schedules, setSchedules] = useState<FlightSchedule[]>([]);
    const [schedulesLoading, setSchedulesLoading] = useState(true);
    const [schedulesError, setSchedulesError] = useState<string | null>(null);

    // Promotions state
    const [promos, setPromos] = useState<Promo[]>([]);
    const [promosLoading, setPromosLoading] = useState(true);
    const [promosError, setPromosError] = useState<string | null>(null);

    // Destinations state
    const [destinations, setDestinations] = useState<unknown[]>([]);
    const [destinationsLoading, setDestinationsLoading] = useState(true);
    const [destinationsError, setDestinationsError] = useState<string | null>(null);

    // Airlines API functions
    const fetchAirlines = async () => {
        try {
            setAirlinesLoading(true);
            setAirlinesError(null);
            const response = await airlinesApi.getAll();
            setAirlines(response.data);
        } catch (error) {
            setAirlinesError(error instanceof Error ? error.message : "Failed to fetch airlines");
            setAirlines([]);
        } finally {
            setAirlinesLoading(false);
        }
    };

    // Flight Schedules API functions
    const fetchSchedules = async () => {
        try {
            console.log("🔄 DataContext - Fetching flight schedules...");
            setSchedulesLoading(true);
            setSchedulesError(null);
            const response = await flightSchedulesApi.getAll();
            console.log("✅ DataContext - Flight schedules fetched:", response.data.length, "items");
            setSchedules(response.data);
        } catch (error) {
            console.error("❌ DataContext - Error fetching schedules:", error);
            setSchedulesError(error instanceof Error ? error.message : "Failed to fetch schedules");
            setSchedules([]);
        } finally {
            setSchedulesLoading(false);
        }
    };

    // Promotions API functions
    const fetchPromos = async () => {
        try {
            setPromosLoading(true);
            setPromosError(null);
            const response = await promotionsApi.getAll();
            setPromos(response.data);
        } catch (error) {
            setPromosError(error instanceof Error ? error.message : "Failed to fetch promotions");
            setPromos([]);
        } finally {
            setPromosLoading(false);
        }
    };

    // Destinations API functions
    const fetchDestinations = async () => {
        try {
            setDestinationsLoading(true);
            setDestinationsError(null);
            const response = await destinationsApi.getAll();
            setDestinations(response.data);
        } catch (error) {
            setDestinationsError(error instanceof Error ? error.message : "Failed to fetch destinations");
            setDestinations([]);
        } finally {
            setDestinationsLoading(false);
        }
    };

    // Mutation hooks
    const createAirlineMutation = useMutation(airlinesApi.create, {
        onSuccess: () => fetchAirlines(),
    });

    const updateAirlineMutation = useMutation(
        ({ id, data }: { id: string; data: Partial<Airline> }) => airlinesApi.update(id, data),
        {
            onSuccess: () => fetchAirlines(),
        }
    );

    const deleteAirlineMutation = useMutation(airlinesApi.delete, {
        onSuccess: () => fetchAirlines(),
    });

    const createScheduleMutation = useMutation(flightSchedulesApi.create, {
        onSuccess: (data) => {
            console.log("✅ Flight schedule created successfully:", data);
            fetchSchedules();
        },
        onError: (error) => {
            console.error("❌ Error creating flight schedule:", error);
        }
    });

    const updateScheduleMutation = useMutation(
        ({ id, data }: { id: string; data: Partial<FlightSchedule> }) => flightSchedulesApi.update(id, data),
        {
            onSuccess: (data) => {
                console.log("✅ Flight schedule updated successfully:", data);
                fetchSchedules();
            },
            onError: (error) => {
                console.error("❌ Error updating flight schedule:", error);
            }
        }
    );

    const deleteScheduleMutation = useMutation(flightSchedulesApi.delete, {
        onSuccess: () => {
            console.log("✅ Flight schedule deleted successfully");
            fetchSchedules();
        },
        onError: (error) => {
            console.error("❌ Error deleting flight schedule:", error);
        }
    });

    const createPromoMutation = useMutation(promotionsApi.create, {
        onSuccess: (data) => {
            console.log("✅ Promotion created successfully:", data);
            fetchPromos();
        },
        onError: (error) => {
            console.error("❌ Error creating promotion:", error);
        }
    });

    const updatePromoMutation = useMutation(
        ({ id, data }: { id: string; data: Partial<Promo> }) => promotionsApi.update(id, data),
        {
            onSuccess: (data) => {
                console.log("✅ Promotion updated successfully:", data);
                fetchPromos();
            },
            onError: (error) => {
                console.error("❌ Error updating promotion:", error);
            }
        }
    );

    const deletePromoMutation = useMutation(promotionsApi.delete, {
        onSuccess: () => {
            console.log("✅ Promotion deleted successfully");
            fetchPromos();
        },
        onError: (error) => {
            console.error("❌ Error deleting promotion:", error);
        }
    });

    // Initial data fetch
    useEffect(() => {
        fetchAirlines();
        fetchSchedules();
        fetchPromos();
        fetchDestinations();
    }, []);

    const contextValue: DataContextType = {
        // Airlines
        airlines,
        airlinesLoading,
        airlinesError,
        refetchAirlines: fetchAirlines,
        createAirline: async (data) => {
            console.log("✈️ DataContext createAirline called with:", data);
            return createAirlineMutation.mutate(data);
        },
        updateAirline: async (id, data) => {
            console.log("🔄 DataContext updateAirline called with:", { id, data });
            return updateAirlineMutation.mutate({ id, data });
        },
        deleteAirline: async (id) => deleteAirlineMutation.mutate(id),

        // Flight Schedules
        schedules,
        schedulesLoading,
        schedulesError,
        refetchSchedules: fetchSchedules,
        createSchedule: async (data) => {
            console.log("📋 DataContext createSchedule called with:", data);
            return createScheduleMutation.mutate(data);
        },
        updateSchedule: async (id, data) => updateScheduleMutation.mutate({ id, data }),
        deleteSchedule: async (id) => deleteScheduleMutation.mutate(id),

        // Promotions
        promos,
        promosLoading,
        promosError,
        refetchPromos: fetchPromos,
        createPromo: async (data) => createPromoMutation.mutate(data),
        updatePromo: async (id, data) => updatePromoMutation.mutate({ id, data }),
        deletePromo: async (id) => deletePromoMutation.mutate(id),

        // Destinations
        destinations,
        destinationsLoading,
        destinationsError,
        refetchDestinations: fetchDestinations,
    };

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    );
}