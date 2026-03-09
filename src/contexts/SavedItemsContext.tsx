import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SavedItemsContextType {
  savedProductIds: string[];
  toggleSaveProduct: (id: string) => void;
  isProductSaved: (id: string) => boolean;
  isLoading: boolean;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

const STORAGE_KEY = "vyapaaro_saved_products";

export const SavedItemsProvider = ({ children }: { children: ReactNode }) => {
  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // When user logs in, fetch saved items from DB and merge with local
  useEffect(() => {
    if (!userId) return;

    const syncFromDb = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("saved_items")
        .select("product_id")
        .eq("user_id", userId);

      if (!error && data) {
        const dbIds = data.map((r) => r.product_id);
        // Merge local items into DB (ones not already saved)
        const localOnly = savedProductIds.filter((id) => !dbIds.includes(id));
        if (localOnly.length > 0) {
          const rows = localOnly.map((product_id) => ({ user_id: userId, product_id }));
          await supabase.from("saved_items").upsert(rows, { onConflict: "user_id,product_id" });
        }
        // Set state to union of both
        const merged = Array.from(new Set([...dbIds, ...localOnly]));
        setSavedProductIds(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      }
      setIsLoading(false);
    };

    syncFromDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const toggleSaveProduct = useCallback(async (id: string) => {
    const isSaved = savedProductIds.includes(id);
    const next = isSaved
      ? savedProductIds.filter((pid) => pid !== id)
      : [...savedProductIds, id];

    setSavedProductIds(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));

    // Persist to DB if logged in
    if (userId) {
      if (isSaved) {
        await supabase
          .from("saved_items")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", id);
      } else {
        await supabase
          .from("saved_items")
          .upsert({ user_id: userId, product_id: id }, { onConflict: "user_id,product_id" });
      }
    }
  }, [savedProductIds, userId]);

  const isProductSaved = useCallback((id: string) => savedProductIds.includes(id), [savedProductIds]);

  return (
    <SavedItemsContext.Provider value={{ savedProductIds, toggleSaveProduct, isProductSaved, isLoading }}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (!context) throw new Error("useSavedItems must be used within SavedItemsProvider");
  return context;
};
