import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, User, Bell, Shield, Star, MapPin, Lock, Store, Palette, Database, ChevronLeft, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { User as SupaUser } from "@supabase/supabase-js";

import AccountSettings from "./settings/AccountSettings";
import NotificationSettings from "./settings/NotificationSettings";
import PrivacySettings from "./settings/PrivacySettings";
import ReviewsActivitySettings from "./settings/ReviewsActivitySettings";
import LocationSettings from "./settings/LocationSettings";
import SecuritySettings from "./settings/SecuritySettings";
import ShopManagementSettings from "./settings/ShopManagementSettings";
import ThemeLanguageSettings from "./settings/ThemeLanguageSettings";
import DataAccountSettings from "./settings/DataAccountSettings";

const sections = [
  { key: "account", label: "Account", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "privacy", label: "Privacy", icon: Shield },
  { key: "reviews", label: "Reviews & Activity", icon: Star },
  { key: "location", label: "Location", icon: MapPin },
  { key: "security", label: "Security", icon: Lock },
  { key: "shop", label: "Shop Management", icon: Store, shopOwnerOnly: true },
  { key: "theme", label: "Theme & Language", icon: Palette },
  { key: "data", label: "Data & Account", icon: Database },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isShopOwner, setIsShopOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("account");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/login");
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
      checkShopOwner(session.user.id);
    });
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      setProfile(data);
    } finally {
      setLoading(false);
    }
  };

  const checkShopOwner = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "shop_owner")
      .maybeSingle();
    setIsShopOwner(!!data);
  };

  const filteredSections = sections.filter(
    (s) => !s.shopOwnerOnly || isShopOwner
  );

  const handleSectionChange = (key: string) => {
    setActiveSection(key);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return <AccountSettings profile={profile} user={user} onProfileUpdated={() => user && fetchProfile(user.id)} />;
      case "notifications":
        return <NotificationSettings />;
      case "privacy":
        return <PrivacySettings />;
      case "reviews":
        return <ReviewsActivitySettings />;
      case "location":
        return <LocationSettings />;
      case "security":
        return <SecuritySettings />;
      case "shop":
        return <ShopManagementSettings />;
      case "theme":
        return <ThemeLanguageSettings />;
      case "data":
        return <DataAccountSettings />;
      default:
        return <AccountSettings profile={profile} user={user} onProfileUpdated={() => user && fetchProfile(user.id)} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-8 max-w-6xl mx-auto">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-30 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold flex-1">Settings</h1>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="shrink-0">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex min-h-[calc(100vh-8rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-border bg-card">
          <div className="p-6">
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-xs text-muted-foreground mt-1">Manage your preferences</p>
          </div>
          <ScrollArea className="h-[calc(100vh-14rem)]">
            <nav className="px-3 pb-6 space-y-0.5">
              {filteredSections.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeSection === key
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:hidden fixed inset-0 z-40 bg-black/40"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="md:hidden fixed left-0 top-0 z-50 w-[280px] h-full bg-card shadow-xl"
              >
                <div className="p-6 border-b border-border">
                  <h2 className="text-lg font-bold">Settings</h2>
                  <p className="text-xs text-muted-foreground mt-1">Manage your preferences</p>
                </div>
                <ScrollArea className="h-[calc(100%-5rem)]">
                  <nav className="p-3 space-y-0.5">
                    {filteredSections.map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => handleSectionChange(key)}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm transition-all ${
                          activeSection === key
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                      </button>
                    ))}
                  </nav>
                </ScrollArea>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-4 md:p-8 max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
