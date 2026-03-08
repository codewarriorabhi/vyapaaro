import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  first_name: string;
  surname: string;
  avatar_url: string;
}

export function useUserAvatar() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name, surname, avatar_url")
        .eq("user_id", userId)
        .maybeSingle();
      setProfile(data as UserProfile | null);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.surname?.[0] || ""}`.toUpperCase()
    : "";

  return { profile, isLoggedIn, initials, avatarUrl: profile?.avatar_url || null };
}
