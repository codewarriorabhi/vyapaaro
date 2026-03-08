import { useState, useEffect, useCallback } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
  permission: "prompt" | "granted" | "denied" | "unknown";
}

interface UseGeolocationReturn extends GeolocationState {
  requestLocation: () => void;
  isSupported: boolean;
}

export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
    permission: "unknown",
  });

  const isSupported = typeof navigator !== "undefined" && "geolocation" in navigator;

  // Check permission status on mount
  useEffect(() => {
    if (!isSupported) return;

    const checkPermission = async () => {
      try {
        if ("permissions" in navigator) {
          const result = await navigator.permissions.query({ name: "geolocation" });
          setState((prev) => ({ ...prev, permission: result.state as "prompt" | "granted" | "denied" }));
          
          // Listen for permission changes
          result.addEventListener("change", () => {
            setState((prev) => ({ ...prev, permission: result.state as "prompt" | "granted" | "denied" }));
          });
        }
      } catch {
        // Permissions API not supported, permission remains unknown
      }
    };

    checkPermission();
  }, [isSupported]);

  const requestLocation = useCallback(() => {
    if (!isSupported) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
          permission: "granted",
        });
      },
      (error) => {
        let errorMessage = "Failed to get location";
        let permission: "prompt" | "granted" | "denied" = "prompt";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable it in your browser settings.";
            permission = "denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          permission,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, [isSupported]);

  return {
    ...state,
    requestLocation,
    isSupported,
  };
}
