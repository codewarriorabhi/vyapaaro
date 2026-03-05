import { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import CategoryGrid from "@/components/CategoryGrid";
import ShopCard from "@/components/ShopCard";
import ProductCard from "@/components/ProductCard";
import { shops, products } from "@/data/mockData";
import logo from "@/assets/vyapaaro-logo-new.png";

const Index = () => {
  const [search, setSearch] = useState("");

  const nearbyShops = shops.filter((s) => s.isOpen);
  const trendingProducts = products.slice(0, 4);

  return (
    <div className="pb-20 md:pb-8">
      {/* Mobile Header */}
      <div className="md:hidden gradient-primary px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="flex flex-col items-center mb-4">
          <img src={logo} alt="Vyapaaro" className="h-14 w-14 object-contain rounded-xl" />
          <h1 className="text-xl font-extrabold text-primary-foreground tracking-tight mt-1">Vyapaaro</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm mb-4">Discover local shops near you</p>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Desktop Search */}
      <div className="hidden md:block max-w-2xl mx-auto px-4 pt-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-extrabold mb-1">Discover Local Shops</h2>
          <p className="text-muted-foreground mb-4">Find the best shops, products & services near you</p>
          <SearchBar value={search} onChange={setSearch} />
        </motion.div>
      </div>

      <div className="px-4 mt-6 max-w-5xl mx-auto space-y-8">
        {/* Categories */}
        <CategoryGrid />

        {/* Nearby Shops */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Nearby Shops</h2>
            <button className="text-xs font-semibold text-primary">View All →</button>
          </div>
          <div className="space-y-3">
            {nearbyShops.map((shop, i) => (
              <ShopCard key={shop.id} shop={shop} index={i} />
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Trending Products</h2>
            <button className="text-xs font-semibold text-primary">View All →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {trendingProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
