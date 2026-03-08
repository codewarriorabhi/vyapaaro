import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface UserSettings {
  // Notifications
  email_notifs: boolean;
  sms_notifs: boolean;
  new_shops_nearby: boolean;
  review_replies: boolean;
  promo_offers: boolean;
  order_updates: boolean;
  // Privacy
  public_profile: boolean;
  show_email: boolean;
  show_phone: boolean;
  show_reviews: boolean;
  allow_contact: boolean;
  // Location
  auto_detect_location: boolean;
  manual_location: string;
  location_radius: string;
  // Theme & Language
  theme: string;
  language: string;
  // Reviews
  review_visibility: boolean;
  review_notifs: boolean;
}

const defaults: UserSettings = {
  email_notifs: true,
  sms_notifs: true,
  new_shops_nearby: true,
  review_replies: true,
  promo_offers: true,
  order_updates: true,
  public_profile: true,
  show_email: false,
  show_phone: false,
  show_reviews: true,
  allow_contact: true,
  auto_detect_location: true,
  manual_location: "",
  location_radius: "5",
  theme: "system",
  language: "en",
  review_visibility: true,
  review_notifs: true,
};

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const { id, user_id, created_at, updated_at, ...rest } = data;
        setSettings(rest as UserSettings);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = useCallback(async (partial: Partial<UserSettings>) => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) throw new Error("Not authenticated");

      const merged = { ...settings, ...partial };
      setSettings(merged);

      const { error } = await supabase
        .from("user_settings")
        .upsert(
          { user_id: session.user.id, ...merged },
          { onConflict: "user_id" }
        );

      if (error) throw error;
      toast({ title: "Settings saved" });
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      toast({ title: "Failed to save settings", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }, [settings]);

  const updateLocal = useCallback((partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  return { settings, loading, saving, saveSettings, updateLocal };
}
