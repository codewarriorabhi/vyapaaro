/**
 * API Service Layer
 * Reusable HTTP client for REST API communication
 */
import { handleApiError } from "@/lib/api-errors";

// Base URL - configurable via environment variable or default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://vyapaaro-api.onrender.com/api";

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  details?: unknown;
}

class ApiService {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    };
  }

  /**
   * Set authorization token for authenticated requests
   */
  setAuthToken(token: string): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      "Authorization": `Bearer ${token}`,
    };
  }

  /**
   * Remove authorization token
   */
  clearAuthToken(): void {
    const { Authorization, ...rest } = this.defaultHeaders as Record<string, string>;
    this.defaultHeaders = rest;
  }

  /**
   * Update base URL dynamically
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Build full URL with optional query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: T | null = null;
    let error: string | null = null;

    try {
      // Attempt to parse JSON response
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await response.json();
      }
    } catch (e) {
      // Response body might be empty or non-JSON
      console.warn("Failed to parse response body:", e);
    }

    if (!response.ok) {
      // Extract error message from response or use default
      error = (data as any)?.message || (data as any)?.error || `Request failed with status ${response.status}`;
      data = null;
    }

    return { data, error, status: response.status };
  }

  /**
   * Generic request method
   */
  private async request<T>(
    method: string,
    endpoint: string,
    options?: {
      body?: unknown;
      params?: Record<string, string | number | boolean>;
      headers?: HeadersInit;
      silent?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, options?.params);
    
    const config: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
    };

    if (options?.body && method !== "GET") {
      config.body = JSON.stringify(options.body);
    }

    const executeRequest = async (): Promise<ApiResponse<T>> => {
      try {
        const response = await fetch(url, config);
        const result = await this.handleResponse<T>(response);

        if (result.error && !options?.silent) {
          handleApiError(
            result.status,
            result.error,
            () => { executeRequest(); }
          );
        }

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Network error occurred";
        console.error("API request failed:", message);

        if (!options?.silent) {
          handleApiError(0, message, () => { executeRequest(); });
        }

        return { data: null, error: message, status: 0 };
      }
    };

    return executeRequest();
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
    headers?: HeadersInit,
    options?: { silent?: boolean }
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", endpoint, { params, headers, silent: options?.silent });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", endpoint, { body, headers });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", endpoint, { body, headers });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    body?: unknown,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", endpoint, { body, headers });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    headers?: HeadersInit
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", endpoint, { body, headers });
  }
}

// Export singleton instance
export const api = new ApiService();

// Export class for custom instances
export { ApiService };

// Export base URL for reference
export { API_BASE_URL };
