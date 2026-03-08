/**
 * Global API Error Handling
 */
import { toast } from "@/hooks/use-toast";

interface ErrorConfig {
  title: string;
  description: string;
  retryable: boolean;
}

const ERROR_MAP: Record<number, ErrorConfig> = {
  401: {
    title: "Session Expired",
    description: "Please log in again to continue.",
    retryable: false,
  },
  403: {
    title: "Access Denied",
    description: "You don't have permission to perform this action.",
    retryable: false,
  },
  404: {
    title: "Not Found",
    description: "The requested resource could not be found.",
    retryable: false,
  },
  408: {
    title: "Request Timeout",
    description: "The server took too long to respond. Please try again.",
    retryable: true,
  },
  429: {
    title: "Too Many Requests",
    description: "Please slow down and try again in a moment.",
    retryable: true,
  },
  500: {
    title: "Server Error",
    description: "Something went wrong on our end. Please try again later.",
    retryable: true,
  },
  502: {
    title: "Service Unavailable",
    description: "The server is temporarily unavailable. Please try again.",
    retryable: true,
  },
  503: {
    title: "Service Unavailable",
    description: "The service is currently down for maintenance.",
    retryable: true,
  },
  0: {
    title: "Network Error",
    description: "Could not connect to the server. Check your internet connection.",
    retryable: true,
  },
};

function getErrorConfig(status: number): ErrorConfig {
  return ERROR_MAP[status] || {
    title: "Something Went Wrong",
    description: `Request failed (error ${status}). Please try again.`,
    retryable: status >= 500,
  };
}

export function handleApiError(
  status: number,
  serverMessage?: string | null,
  onRetry?: () => void
): void {
  const config = getErrorConfig(status);

  console.error(`[API Error ${status}]`, serverMessage || config.description);

  toast({
    title: config.title,
    description: serverMessage || config.description,
    variant: "destructive",
    ...(config.retryable && onRetry
      ? {
          action: {
            label: "Retry",
            onClick: onRetry,
          } as any,
        }
      : {}),
  });
}

export { getErrorConfig, type ErrorConfig };
