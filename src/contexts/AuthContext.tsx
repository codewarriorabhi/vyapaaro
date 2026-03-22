import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// Type for user role
export type UserRole = "customer" | "shop_owner" | null;

// Auth Context Type
interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: UserRole;
  loading: boolean;
  fetchRole: () => Promise<void>;
  setUserRole: (role: "customer" | "shop_owner") => Promise<boolean>;
  isShopOwner: boolean;
  isCustomer: boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage key for OAuth role
const OAUTH_ROLE_KEY = "vyapaaro_oauth_role";

// Profile with role type (for type casting)
interface ProfileWithRole {
  role?: string;
  user_id: string;
  email?: string;
  first_name?: string;
  surname?: string;
  phone?: string;
  address?: string;
}

/**
 * Auth Provider Component
 * Wraps the app to provide authentication state and role management
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  // Debug logging
  const log = (message: string, data?: unknown) => {
    console.log(`[AuthContext] ${message}`, data);
  };

  /**
   * Fetch user role from the database
   * Checks both user_roles table and profiles table
   */
  const fetchRole = async (): Promise<void> => {
    if (!user?.id) {
      log("No user ID, clearing role");
      setRole(null);
      return;
    }

    try {
      log("Fetching role for user:", user.id);

      // First check user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (roleError) {
        console.error("[AuthContext] Error fetching role from user_roles:", roleError);
      }

      if (roleData?.role) {
        log("Found role in user_roles:", roleData.role);
        setRole(roleData.role as UserRole);
        return;
      }

      // Fallback: check profiles table (role column may not exist yet)
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle() as { data: ProfileWithRole | null };

        if (profileData?.role) {
          log("Found role in profiles:", profileData.role);
          setRole(profileData.role as UserRole);
          return;
        }
      } catch (e) {
        console.warn("[AuthContext] Could not fetch role from profiles:", e);
      }

      log("No role found, defaulting to customer");
      setRole("customer");
    } catch (error) {
      console.error("[AuthContext] Error fetching role:", error);
      setRole("customer");
    }
  };

  /**
   * Set user role in the database
   * Updates both user_roles and profiles tables
   */
  const setUserRole = async (newRole: "customer" | "shop_owner"): Promise<boolean> => {
    if (!user?.id) {
      console.error("[AuthContext] Cannot set role: no user logged in");
      return false;
    }

    try {
      log("Setting role to: " + newRole + " for user: " + user.id);

      // Upsert into user_roles table
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert(
          {
            user_id: user.id,
            role: newRole,
          },
          { onConflict: "user_id" }
        );

      if (roleError) {
        console.error("[AuthContext] Error updating user_roles:", roleError);
        return false;
      }

      // Also try to update profiles table (role column may not exist yet)
      try {
        await supabase
          .from("profiles")
          .update({ role: newRole } as Record<string, unknown>)
          .eq("user_id", user.id);
      } catch (e) {
        console.warn("[AuthContext] Could not update profiles.role:", e);
      }

      log("Role updated successfully");
      setRole(newRole);
      return true;
    } catch (error) {
      console.error("[AuthContext] Error setting role:", error);
      return false;
    }
  };

  // Handle OAuth role from localStorage after login
  const handleOAuthRole = async (): Promise<void> => {
    const storedRole = localStorage.getItem(OAUTH_ROLE_KEY);
    log("Checking for stored OAuth role: " + storedRole);

    if (storedRole && (storedRole === "customer" || storedRole === "shop_owner")) {
      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (!existingRole?.role) {
        log("Inserting OAuth role: " + storedRole);
        await setUserRole(storedRole as "customer" | "shop_owner");
      } else {
        log("User already has role, skipping OAuth role insert");
      }

      // Clear the stored role
      localStorage.removeItem(OAUTH_ROLE_KEY);
      log("Cleared OAuth role from localStorage");
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession?.user) {
          log("Initial session found, user: " + initialSession.user.id);
          setUser(initialSession.user);
          setSession(initialSession);
          await fetchRole();
          
          // Handle OAuth role after initial load
          await handleOAuthRole();
        } else {
          log("No initial session");
        }
      } catch (error) {
        console.error("[AuthContext] Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        log("Auth state changed: " + event + " session: " + session?.user?.id);

        if (session?.user) {
          setUser(session.user);
          setSession(session);
          await fetchRole();
          
          // Handle OAuth role after state change
          if (event === "SIGNED_IN") {
            await handleOAuthRole();
          }
        } else {
          setUser(null);
          setSession(null);
          setRole(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Computed values
  const isShopOwner = role === "shop_owner";
  const isCustomer = role === "customer";

  const value: AuthContextType = {
    user,
    session,
    role,
    loading,
    fetchRole,
    setUserRole,
    isShopOwner,
    isCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Helper function to save OAuth role before redirect
 */
export const saveOAuthRole = (role: "customer" | "shop_owner"): void => {
  localStorage.setItem(OAUTH_ROLE_KEY, role);
  console.log("[AuthContext] Saved OAuth role to localStorage:", role);
};

/**
 * Helper function to get stored OAuth role
 */
export const getStoredOAuthRole = (): "customer" | "shop_owner" | null => {
  const role = localStorage.getItem(OAUTH_ROLE_KEY);
  return role === "customer" || role === "shop_owner" ? role : null;
};

/**
 * Helper function to clear OAuth role
 */
export const clearOAuthRole = (): void => {
  localStorage.removeItem(OAUTH_ROLE_KEY);
};
