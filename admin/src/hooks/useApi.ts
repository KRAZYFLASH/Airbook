// =============================================================
// AirBook Admin — API Hook for Data Fetching
// =============================================================

import { useState, useEffect, useCallback } from "react";
import { ApiError } from "../services/api";

// Hook state interface
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Hook return type
interface UseApiReturn<T> extends UseApiState<T> {
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}

// Main useApi hook for GET requests
export function useApi<T>(apiCall: () => Promise<T>): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({
        data: result,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof ApiError
          ? error.message
          : error instanceof Error
          ? error.message
          : "An unknown error occurred";

      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, [apiCall]);

  const mutate = useCallback((newData: T) => {
    setState((prev) => ({
      ...prev,
      data: newData,
    }));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch: fetchData,
    mutate,
  };
}

// Hook for API mutations (POST, PUT, DELETE)
interface UseMutationOptions<TData> {
  onSuccess?: (data: TData) => void;
  onError?: (error: string) => void;
}

interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<void>;
  loading: boolean;
  error: string | null;
  data: TData | null;
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData>
): UseMutationReturn<TData, TVariables> {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: TData | null;
  }>({
    loading: false,
    error: null,
    data: null,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      console.log(
        "🔧 useMutation - Starting mutation with variables:",
        variables
      );
      setState({ loading: true, error: null, data: null });

      try {
        const result = await mutationFn(variables);
        console.log("✅ useMutation - Success:", result);
        setState({ loading: false, error: null, data: result });
        options?.onSuccess?.(result);
      } catch (error) {
        console.error("❌ useMutation - Error:", error);
        const errorMessage =
          error instanceof ApiError
            ? error.message
            : error instanceof Error
            ? error.message
            : "An unknown error occurred";

        setState({ loading: false, error: errorMessage, data: null });
        options?.onError?.(errorMessage);
      }
    },
    [mutationFn, options]
  );

  return {
    mutate,
    ...state,
  };
}

// Specialized hooks for common operations
export function useApiList<T>(
  apiCall: () => Promise<{ success: boolean; data: T[] }>
) {
  return useApi(() => apiCall().then((response) => response.data));
}

export function useApiItem<T>(
  apiCall: () => Promise<{ success: boolean; data: T }>
) {
  return useApi(() => apiCall().then((response) => response.data));
}

// Export specific hooks for each API
export function useAirlines() {
  return useApiList(() =>
    import("../services/api").then((api) => api.airlinesApi.getAll())
  );
}

export function useDestinations() {
  return useApiList(() =>
    import("../services/api").then((api) => api.destinationsApi.getAll())
  );
}

export function useFlightSchedules() {
  return useApiList(() =>
    import("../services/api").then((api) => api.flightSchedulesApi.getAll())
  );
}

export function usePromotions() {
  return useApiList(() =>
    import("../services/api").then((api) => api.promotionsApi.getAll())
  );
}
