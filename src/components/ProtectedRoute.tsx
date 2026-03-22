import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "shop_owner" | "customer";
  fallbackPath?: string;
}

/**
 * ProtectedRoute Component
 * Protects routes based on authentication status and user role
 * 
 * @param children - The child components to render if authorized
 * @param requiredRole - Optional role requirement (e.g., "shop_owner")
 * @param fallbackPath - Path to redirect to if not authorized (default: "/login")
 */
export const ProtectedRoute = ({
  children,
  requiredRole,
  fallbackPath = "/login",
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, role, loading, isShopOwner, isCustomer } = useAuth();

  // Debug logging
  console.log("[ProtectedRoute] Rendering for path:", location.pathname);
  console.log("[ProtectedRoute] User:", user?.id);
  console.log("[ProtectedRoute] Role:", role);
  console.log("[ProtectedRoute] Required role:", requiredRole);
  console.log("[ProtectedRoute] Loading:", loading);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    console.log("[ProtectedRoute] No user, redirecting to:", fallbackPath);
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole) {
    let hasRequiredRole = false;

    if (requiredRole === "shop_owner") {
      hasRequiredRole = isShopOwner;
    } else if (requiredRole === "customer") {
      hasRequiredRole = isCustomer;
    }

    console.log("[ProtectedRoute] Has required role:", hasRequiredRole);

    if (!hasRequiredRole) {
      console.log("[ProtectedRoute] Role requirement not met, redirecting to /profile");
      
      // Redirect to appropriate page based on the required role
      const redirectPath = requiredRole === "shop_owner" ? "/profile" : "/profile";
      
      return (
        <Navigate
          to={redirectPath}
          state={{
            from: location,
            error: `This page requires ${requiredRole === "shop_owner" ? "shop owner" : "customer"} access.`,
          }}
          replace
        />
      );
    }
  }

  console.log("[ProtectedRoute] Access granted");
  return <>{children}</>;
};

export default ProtectedRoute;
