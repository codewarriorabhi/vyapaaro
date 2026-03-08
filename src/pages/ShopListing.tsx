import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, LayoutGrid, List } from "lucide-react";
import ShopCard from "@/components/ShopCard";
import ShopFilterSidebar, { type ShopFilters } from "@/components/ShopFilterSidebar";
import { shops, categories } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ShopListing = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "popular">("rating");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<ShopFilters>({
    categories: categoryFilter ? [categoryFilter] : [],
    distance: null,
    rating: null,
    status: null,
    priceLevel: null,
  });

  const filtered = useMemo(() => {
    let result = [...shops];

    // Search
    const q = search.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q)) ||
          s.address.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((s) => filters.categories.includes(s.category));
    }

    // Distance
    if (filters.distance) {
      const maxDist = parseFloat(filters.distance);
      result = result.filter((s) => parseFloat(s.distance) <= maxDist);
    }

    // Rating
    if (filters.rating && filters.rating > 0) {
      result = result.filter((s) => s.rating >= filters.rating!);
    }

    // Status
    if (filters.status === "open") result = result.filter((s) => s.isOpen);
    if (filters.status === "closed") result = result.filter((s) => !s.isOpen);

    // Price level
    if (filters.priceLevel) {
      result = result.filter((s) => s.priceLevel === filters.priceLevel);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "popular") return b.reviewCount - a.reviewCount;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

    return result;
  }, [search, filters, sortBy]);

  const activeFilterCount =
    filters.categories.length +
    (filters.distance ? 1 : 0) +
    (filters.rating && filters.rating > 0 ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.priceLevel ? 1 : 0);

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
              Discover {shops.length}+ local shops near you
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
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setMobileFilterOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="gradient-primary border-0 text-[10px] px-1.5 ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          <div className="flex-1 overflow-x-auto scrollbar-none">
            <div className="flex gap-1.5">
              {(["rating", "distance", "popular"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                    sortBy === s
                      ? "bg-foreground text-background"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {s === "rating" ? "Top Rated" : s === "distance" ? "Nearest" : "Popular"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <ShopFilterSidebar
            filters={filters}
            onChange={setFilters}
            open={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Desktop toolbar */}
            <div className="hidden md:flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span> shops found
              </p>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {(["rating", "distance", "popular"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                        sortBy === s
                          ? "bg-foreground text-background"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {s === "rating" ? "Top Rated" : s === "distance" ? "Nearest" : "Popular"}
                    </button>
                  ))}
                </div>
                <div className="flex bg-secondary rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-card shadow-sm" : ""}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-card shadow-sm" : ""}`}
                  >
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
                    <Badge
                      key={catId}
                      variant="secondary"
                      className="cursor-pointer gap-1"
                      onClick={() =>
                        setFilters({
                          ...filters,
                          categories: filters.categories.filter((c) => c !== catId),
                        })
                      }
                    >
                      {cat?.icon} {cat?.name} ✕
                    </Badge>
                  );
                })}
                {filters.distance && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer gap-1"
                    onClick={() => setFilters({ ...filters, distance: null })}
                  >
                    Within {filters.distance} km ✕
                  </Badge>
                )}
                {filters.rating !== null && filters.rating > 0 && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer gap-1"
                    onClick={() => setFilters({ ...filters, rating: null })}
                  >
                    {filters.rating}★+ ✕
                  </Badge>
                )}
                {filters.status && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer gap-1"
                    onClick={() => setFilters({ ...filters, status: null })}
                  >
                    {filters.status === "open" ? "Open Now" : "Closed"} ✕
                  </Badge>
                )}
                {filters.priceLevel && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer gap-1"
                    onClick={() => setFilters({ ...filters, priceLevel: null })}
                  >
                    {"₹".repeat(filters.priceLevel)} ✕
                  </Badge>
                )}
              </div>
            )}

            {/* Shop list */}
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-lg font-bold mb-1">No shops found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </motion.div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((shop, i) => (
                  <ShopCard key={shop.id} shop={shop} index={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((shop, i) => (
                  <ShopCard key={shop.id} shop={shop} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopListing;
