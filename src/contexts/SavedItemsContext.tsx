import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SavedItemsContextType {
  savedProductIds: string[];
  toggleSaveProduct: (id: string) => void;
  isProductSaved: (id: string) => boolean;
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProductIds));
  }, [savedProductIds]);

  const toggleSaveProduct = (id: string) => {
    setSavedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const isProductSaved = (id: string) => savedProductIds.includes(id);

  return (
    <SavedItemsContext.Provider value={{ savedProductIds, toggleSaveProduct, isProductSaved }}>
      {children}
    </SavedItemsContext.Provider>
  );
};

export const useSavedItems = () => {
  const context = useContext(SavedItemsContext);
  if (!context) throw new Error("useSavedItems must be used within SavedItemsProvider");
  return context;
};
