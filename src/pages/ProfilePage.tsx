import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User, Settings, ChevronRight, LogIn, LogOut, Store, Bell, HelpCircle, Shield, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { User as SupaUser } from "@supabase/supabase-js";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      setProfile(data);
    } catch {
      // Profile may not exist yet
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      toast({ title: "Signed out", description: "You have been logged out." });
      navigate("/");
    } catch {
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
    } finally {
      setLoggingOut(false);
    }
  };

  const isLoggedIn = !!user;
  const displayName = profile
    ? `${profile.first_name} ${profile.surname}`.trim()
    : user?.user_metadata?.full_name
      ? user.user_metadata.full_name
      : user?.user_metadata?.first_name
        ? `${user.user_metadata.first_name} ${user.user_metadata.surname || ""}`.trim()
        : user?.email || "User";

  const menuItems = isLoggedIn
    ? [
        { icon: Store, label: "My Shops", desc: "Manage your shop listings" },
        { icon: Bell, label: "Notifications", desc: "Offers & announcements" },
        { icon: Settings, label: "Settings", desc: "App preferences" },
        { icon: HelpCircle, label: "Help & Support", desc: "Get assistance" },
        { icon: Shield, label: "Privacy Policy", desc: "Your data protection" },
      ]
    : [
        { icon: LogIn, label: "Login / Sign Up", desc: "Access your account", path: "/login" },
        { icon: Store, label: "My Shops", desc: "Manage your shop listings" },
        { icon: Bell, label: "Notifications", desc: "Offers & announcements" },
        { icon: Settings, label: "Settings", desc: "App preferences" },
        { icon: HelpCircle, label: "Help & Support", desc: "Get assistance" },
        { icon: Shield, label: "Privacy Policy", desc: "Your data protection" },
      ];

  if (loading) {
    return (
      <div className="pb-20 md:pb-8 px-4 pt-6 max-w-3xl mx-auto flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-8 px-4 pt-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold mb-6">Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-card mb-6"
      >
        <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
          <User className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          {isLoggedIn ? (
            <>
              <h2 className="font-bold text-lg truncate">{displayName}</h2>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </>
          ) : (
            <>
              <h2 className="font-bold text-lg">Welcome to Vyapaaro</h2>
              <p className="text-sm text-muted-foreground">Sign in to manage your profile</p>
            </>
          )}
        </div>
      </motion.div>

      {/* User details card when logged in */}
      {isLoggedIn && profile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl shadow-card p-4 mb-6 space-y-3"
        >
          {profile.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{profile.phone}</span>
            </div>
          )}
          {profile.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground truncate">{profile.email}</span>
            </div>
          )}
          {profile.address && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{profile.address}</span>
            </div>
          )}
        </motion.div>
      )}

      <div className="space-y-1">
        {menuItems.map(({ icon: Icon, label, desc, path }: any, i: number) => (
          <motion.button
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => path && navigate(path)}
            className="flex items-center gap-3 w-full p-3.5 rounded-xl hover:bg-card transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-semibold">{label}</span>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        ))}

        {/* Logout button */}
        {isLoggedIn && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: menuItems.length * 0.05 }}
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 w-full p-3.5 rounded-xl hover:bg-destructive/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
              {loggingOut ? <Loader2 className="h-5 w-5 animate-spin text-destructive" /> : <LogOut className="h-5 w-5 text-destructive" />}
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-semibold text-destructive">Log Out</span>
              <p className="text-xs text-muted-foreground">Sign out of your account</p>
            </div>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
