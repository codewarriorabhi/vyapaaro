import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import ShopCard from "@/components/ShopCard";
import { shops, categories } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const ShopListing = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [activeFilter, setActiveFilter] = useState<string | null>(categoryFilter);
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "popular">("rating");

  const filtered = activeFilter
    ? shops.filter((s) => s.category === activeFilter)
    : shops;

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "popular") return b.reviewCount - a.reviewCount;
    return parseFloat(a.distance) - parseFloat(b.distance);
  });

  return (
    <div className="pb-20 md:pb-8">
      <div className="px-4 pt-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-extrabold mb-1">
            {activeFilter ? categories.find((c) => c.id === activeFilter)?.name : "All Shops"}
          </h1>
          <p className="text-sm text-muted-foreground mb-4">
            {sorted.length} shops found near you
          </p>
        </motion.div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none mb-2">
          <Badge
            variant={!activeFilter ? "default" : "secondary"}
            className={`cursor-pointer flex-shrink-0 ${!activeFilter ? "gradient-primary border-0" : ""}`}
            onClick={() => setActiveFilter(null)}
          >
            All
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={activeFilter === cat.id ? "default" : "secondary"}
              className={`cursor-pointer flex-shrink-0 ${activeFilter === cat.id ? "gradient-primary border-0" : ""}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.icon} {cat.name}
            </Badge>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(["rating", "distance", "popular"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                sortBy === s ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {s === "rating" ? "Top Rated" : s === "distance" ? "Nearest" : "Popular"}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {sorted.map((shop, i) => (
            <ShopCard key={shop.id} shop={shop} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopListing;
