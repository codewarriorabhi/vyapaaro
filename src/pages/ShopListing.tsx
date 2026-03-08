import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, LayoutGrid, List, Loader2, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ShopCard from "@/components/ShopCard";
import ShopFilterSidebar, { type ShopFilters } from "@/components/ShopFilterSidebar";
import { categories } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ShopRow {
  id: string;
  name: string;
  category: string;
  cover_image: string | null;
  address: string;
  tags: string[] | null;
  phone: string | null;
  whatsapp: string | null;
  working_hours: string | null;
  description: string | null;
  is_active: boolean;
}

const ShopListing = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const queryParam = searchParams.get("q") || "";

  const [shops, setShops] = useState<ShopRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(queryParam);
  const [sortBy, setSortBy] = useState<"name" | "newest" | "popular">("name");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<ShopFilters>({
    categories: categoryFilter ? [categoryFilter] : [],
    distance: null,
    rating: null,
    status: null,
    priceLevel: null,
  });

  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc("search_shops", {
        search_query: search.trim(),
        filter_categories: filters.categories.length > 0 ? filters.categories : [],
        filter_min_rating: 0,
        sort_by: sortBy === "popular" ? "name" : sortBy,
        result_limit: 50,
        result_offset: 0,
      });

      if (rpcError) throw rpcError;
      setShops((data as ShopRow[]) || []);
    } catch (err: any) {
      console.error("Failed to fetch shops:", err);
      setError(err.message || "Failed to load shops");
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, [search, filters.categories, sortBy]);

  useEffect(() => {
    const debounce = setTimeout(fetchShops, 300);
    return () => clearTimeout(debounce);
  }, [fetchShops]);

  // Sync URL query param to search
  useEffect(() => {
    if (queryParam) setSearch(queryParam);
  }, [queryParam]);

  const filtered = useMemo(() => {
    let result = [...shops];

    // Client-side filters that aren't in the DB function
    if (filters.status === "open") result = result.filter((s) => s.is_active);
    if (filters.status === "closed") result = result.filter((s) => !s.is_active);

    return result;
  }, [shops, filters.status]);

  const activeFilterCount =
    filters.categories.length +
    (filters.distance ? 1 : 0) +
    (filters.rating && filters.rating > 0 ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.priceLevel ? 1 : 0);

  const mapShop = (shop: ShopRow) => ({
    id: shop.id,
    name: shop.name,
    category: shop.category,
    image: shop.cover_image || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
    rating: 0,
    reviewCount: 0,
    distance: "N/A",
    address: shop.address,
    isOpen: shop.is_active,
    tags: shop.tags || [],
  });

  return (
    <div className="pb-20 md:pb-8">
      {/* Page header */}
      <div className="gradient-primary px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary-foreground mb-1">
              Explore Shops
            </h1>
            <p className="text-sm text-primary-foreground/80 mb-4">
              {loading ? "Searching shops..." : `${filtered.length} shop${filtered.length !== 1 ? "s" : ""} found`}
            </p>
          </motion.div>
          <div className="relative max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shops, products, or services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-card border-0 text-base shadow-card"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Mobile filter bar */}
        <div className="flex items-center gap-2 mb-4 md:hidden">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setMobileFilterOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="gradient-primary border-0 text-[10px] px-1.5 ml-1">{activeFilterCount}</Badge>
            )}
          </Button>
          <div className="flex-1 overflow-x-auto scrollbar-none">
            <div className="flex gap-1.5">
              {(["name", "newest", "popular"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                    sortBy === s ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {s === "name" ? "A-Z" : s === "newest" ? "Newest" : "Popular"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <ShopFilterSidebar filters={filters} onChange={setFilters} open={mobileFilterOpen} onClose={() => setMobileFilterOpen(false)} />

          <div className="flex-1 min-w-0">
            {/* Desktop toolbar */}
            <div className="hidden md:flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span> shops found
              </p>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {(["name", "newest", "popular"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                        sortBy === s ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {s === "name" ? "A-Z" : s === "newest" ? "Newest" : "Popular"}
                    </button>
                  ))}
                </div>
                <div className="flex bg-secondary rounded-lg p-0.5">
                  <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-card shadow-sm" : ""}`}>
                    <List className="h-4 w-4" />
                  </button>
                  <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-card shadow-sm" : ""}`}>
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter pills */}
            {activeFilterCount > 0 && (
              <div className="flex gap-1.5 flex-wrap mb-4">
                {filters.categories.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return (
                    <Badge key={catId} variant="secondary" className="cursor-pointer gap-1" onClick={() => setFilters({ ...filters, categories: filters.categories.filter((c) => c !== catId) })}>
                      {cat?.icon} {cat?.name} ✕
                    </Badge>
                  );
                })}
                {filters.distance && (
                  <Badge variant="secondary" className="cursor-pointer gap-1" onClick={() => setFilters({ ...filters, distance: null })}>Within {filters.distance} km ✕</Badge>
                )}
                {filters.rating !== null && filters.rating > 0 && (
                  <Badge variant="secondary" className="cursor-pointer gap-1" onClick={() => setFilters({ ...filters, rating: null })}>{filters.rating}★+ ✕</Badge>
                )}
                {filters.status && (
                  <Badge variant="secondary" className="cursor-pointer gap-1" onClick={() => setFilters({ ...filters, status: null })}>{filters.status === "open" ? "Open Now" : "Closed"} ✕</Badge>
                )}
                {filters.priceLevel && (
                  <Badge variant="secondary" className="cursor-pointer gap-1" onClick={() => setFilters({ ...filters, priceLevel: null })}>{"₹".repeat(filters.priceLevel)} ✕</Badge>
                )}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">Searching shops...</p>
              </motion.div>
            )}

            {/* Error */}
            {!loading && error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <p className="text-lg font-bold text-destructive mb-1">Failed to load shops</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button variant="outline" onClick={fetchShops}>Try Again</Button>
              </motion.div>
            )}

            {/* Empty */}
            {!loading && !error && filtered.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Store className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-lg font-bold mb-1">No shops found</p>
                <p className="text-sm text-muted-foreground">
                  {search ? "Try adjusting your search or filters" : "No shops are available yet"}
                </p>
              </motion.div>
            )}

            {/* Shop list */}
            {!loading && !error && filtered.length > 0 && (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filtered.map((shop, i) => (
                    <ShopCard key={shop.id} shop={mapShop(shop)} index={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((shop, i) => (
                    <ShopCard key={shop.id} shop={mapShop(shop)} index={i} />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopListing;
