import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import ProductCard from "./ProductCard";
import { products } from "@/data/mockData";

const getEndOfDay = () => {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return end.getTime() - now.getTime();
};

const formatTime = (ms: number) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return { h, m, s };
};

interface FlashDealsProps {
  searchQuery?: string;
}

const FlashDeals = ({ searchQuery = "" }: FlashDealsProps) => {
  const [remaining, setRemaining] = useState(getEndOfDay());

  useEffect(() => {
    const timer = setInterval(() => setRemaining(getEndOfDay()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { h, m, s } = formatTime(remaining);

  const query = searchQuery.toLowerCase().trim();
  const dealProducts = products.filter((p) => {
    if (!p.originalPrice || p.originalPrice <= p.price) return false;
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.description?.toLowerCase().includes(query) ?? false)
    );
  });

  if (dealProducts.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Zap className="h-5 w-5 text-destructive fill-destructive" />
          </motion.div>
          <h2 className="text-lg font-bold">Flash Deals</h2>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold">
          <span className="text-muted-foreground">Ends in</span>
          {[h, m, s].map((val, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-md min-w-[26px] text-center">
                {val}
              </span>
              {i < 2 && <span className="text-muted-foreground">:</span>}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {dealProducts.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
};

export default FlashDeals;
