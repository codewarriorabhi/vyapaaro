import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ShopRating {
  avg_rating: number;
  review_count: number;
}

const cache = new Map<string, ShopRating>();
const pending = new Set<string>();
let batchTimeout: ReturnType<typeof setTimeout> | null = null;
let listeners: Array<() => void> = [];

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

async function flushBatch() {
  const ids = Array.from(pending);
  pending.clear();
  if (ids.length === 0) return;

  // Fetch ratings for all requested shop IDs
  const promises = ids.map(async (id) => {
    const { data } = await supabase.rpc("get_shop_rating", { _shop_id: id });
    if (data && Array.isArray(data) && data.length > 0) {
      cache.set(id, {
        avg_rating: Number(data[0].avg_rating) || 0,
        review_count: Number(data[0].review_count) || 0,
      });
    } else {
      cache.set(id, { avg_rating: 0, review_count: 0 });
    }
  });

  await Promise.all(promises);
  notifyListeners();
}

function requestRating(shopId: string) {
  if (cache.has(shopId)) return;
  pending.add(shopId);
  if (batchTimeout) clearTimeout(batchTimeout);
  batchTimeout = setTimeout(flushBatch, 50);
}

export function useShopRating(shopId: string): ShopRating | null {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate((n) => n + 1);
    listeners.push(listener);
    requestRating(shopId);
    return () => {
      listeners = listeners.filter((fn) => fn !== listener);
    };
  }, [shopId]);

  return cache.get(shopId) || null;
}
