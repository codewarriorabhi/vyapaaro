import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbProduct {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  original_price: number | null;
  image: string;
  images: string[] | null;
  category: string;
  in_stock: boolean;
  rating: number;
  review_count: number;
  description: string | null;
  specifications: Record<string, string> | null;
  created_at: string;
  updated_at: string;
}

const fetchAllProducts = async (): Promise<DbProduct[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbProduct[];
};

const fetchProductsByShop = async (shopId: string): Promise<DbProduct[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as DbProduct[];
};

const fetchProductById = async (id: string): Promise<DbProduct | null> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as DbProduct | null;
};

export const useProducts = () =>
  useQuery({ queryKey: ["products"], queryFn: fetchAllProducts });

export const useShopProducts = (shopId: string | undefined) =>
  useQuery({
    queryKey: ["products", "shop", shopId],
    queryFn: () => fetchProductsByShop(shopId!),
    enabled: !!shopId,
  });

export const useProduct = (id: string | undefined) =>
  useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProductById(id!),
    enabled: !!id,
  });
