import { useState, useCallback } from "react";
import { api, ApiResponse } from "@/lib/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<ApiResponse<T>>;
  reset: () => void;
}

/**
 * Generic hook for API calls with loading and error states
 */
export function useApi<T>(
  apiCall: (...args: unknown[]) => Promise<ApiResponse<T>>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]): Promise<ApiResponse<T>> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await apiCall(...args);

      setState({
        data: response.data,
        loading: false,
        error: response.error,
      });

      return response;
    },
    [apiCall]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

/**
 * Hook for GET requests with auto-fetch option
 */
export function useApiGet<T>(endpoint: string, params?: Record<string, string | number | boolean>) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetch = useCallback(
    async (overrideParams?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await api.get<T>(endpoint, overrideParams || params);

      setState({
        data: response.data,
        loading: false,
        error: response.error,
      });

      return response;
    },
    [endpoint, params]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, fetch, reset };
}

/**
 * Hook for POST requests
 */
export function useApiPost<T, B = unknown>(endpoint: string) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const post = useCallback(
    async (body: B): Promise<ApiResponse<T>> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await api.post<T>(endpoint, body);

      setState({
        data: response.data,
        loading: false,
        error: response.error,
      });

      return response;
    },
    [endpoint]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, post, reset };
}

/**
 * Hook for PUT requests
 */
export function useApiPut<T, B = unknown>(endpoint: string) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const put = useCallback(
    async (body: B): Promise<ApiResponse<T>> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const response = await api.put<T>(endpoint, body);

      setState({
        data: response.data,
        loading: false,
        error: response.error,
      });

      return response;
    },
    [endpoint]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, put, reset };
}

/**
 * Hook for DELETE requests
 */
export function useApiDelete<T>(endpoint: string) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const remove = useCallback(async (): Promise<ApiResponse<T>> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    const response = await api.delete<T>(endpoint);

    setState({
      data: response.data,
      loading: false,
      error: response.error,
    });

    return response;
  }, [endpoint]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, remove, reset };
}
