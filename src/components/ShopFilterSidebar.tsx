import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { categories } from "@/data/mockData";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface ShopFilters {
  categories: string[];
  distance: string | null;
  rating: number | null;
  status: string | null;
  priceLevel: number | null;
}

const distances = [
  { label: "Within 1 km", value: "1" },
  { label: "Within 3 km", value: "3" },
  { label: "Within 5 km", value: "5" },
  { label: "Within 10 km", value: "10" },
];

const ratings = [
  { label: "4★ & above", value: 4 },
  { label: "3★ & above", value: 3 },
  { label: "All ratings", value: 0 },
];

const statuses = [
  { label: "Open Now", value: "open" },
  { label: "Closed", value: "closed" },
];

const priceLevels = [
  { label: "₹ Budget", value: 1 },
  { label: "₹₹ Moderate", value: 2 },
  { label: "₹₹₹ Premium", value: 3 },
];

interface Props {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
  open: boolean;
  onClose: () => void;
}

const FilterSection = ({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full py-2 text-sm font-bold text-foreground"
      >
        {title}
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-3 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShopFilterSidebar = ({ filters, onChange, open, onClose }: Props) => {
  const toggleCategory = (id: string) => {
    const cats = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    onChange({ ...filters, categories: cats });
  };

  const activeCount =
    filters.categories.length +
    (filters.distance ? 1 : 0) +
    (filters.rating && filters.rating > 0 ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.priceLevel ? 1 : 0);

  const clearAll = () =>
    onChange({ categories: [], distance: null, rating: null, status: null, priceLevel: null });

  const content = (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span className="font-bold text-base">Filters</span>
          {activeCount > 0 && (
            <Badge className="gradient-primary border-0 text-xs px-1.5">{activeCount}</Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs font-semibold text-primary">
            Clear All
          </button>
        )}
      </div>

      <Separator />

      <FilterSection title="Categories">
        {categories.map((cat) => (
          <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-sm">
            <Checkbox
              checked={filters.categories.includes(cat.id)}
              onCheckedChange={() => toggleCategory(cat.id)}
            />
            <span>{cat.icon}</span>
            <span className="flex-1">{cat.name}</span>
            <span className="text-xs text-muted-foreground">{cat.count}</span>
          </label>
        ))}
      </FilterSection>

      <Separator />

      <FilterSection title="Distance">
        {distances.map((d) => (
          <label key={d.value} className="flex items-center gap-2 cursor-pointer text-sm">
            <Checkbox
              checked={filters.distance === d.value}
              onCheckedChange={() =>
                onChange({ ...filters, distance: filters.distance === d.value ? null : d.value })
              }
            />
            <span>{d.label}</span>
          </label>
        ))}
      </FilterSection>

      <Separator />

      <FilterSection title="Ratings">
        {ratings.map((r) => (
          <label key={r.value} className="flex items-center gap-2 cursor-pointer text-sm">
            <Checkbox
              checked={filters.rating === r.value}
              onCheckedChange={() =>
                onChange({ ...filters, rating: filters.rating === r.value ? null : r.value })
              }
            />
            <span>{r.label}</span>
          </label>
        ))}
      </FilterSection>

      <Separator />

      <FilterSection title="Shop Status">
        {statuses.map((s) => (
          <label key={s.value} className="flex items-center gap-2 cursor-pointer text-sm">
            <Checkbox
              checked={filters.status === s.value}
              onCheckedChange={() =>
                onChange({ ...filters, status: filters.status === s.value ? null : s.value })
              }
            />
            <span>{s.label}</span>
          </label>
        ))}
      </FilterSection>

      <Separator />

      <FilterSection title="Price Level">
        {priceLevels.map((p) => (
          <label key={p.value} className="flex items-center gap-2 cursor-pointer text-sm">
            <Checkbox
              checked={filters.priceLevel === p.value}
              onCheckedChange={() =>
                onChange({ ...filters, priceLevel: filters.priceLevel === p.value ? null : p.value })
              }
            />
            <span>{p.label}</span>
          </label>
        ))}
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0 sticky top-20 self-start bg-card rounded-xl shadow-card p-4 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none">
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 z-40 md:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-xs bg-card z-50 md:hidden p-4 overflow-y-auto shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-lg">Filters</span>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShopFilterSidebar;
