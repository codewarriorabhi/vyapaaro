import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import ThemeToggle from "@/components/ThemeToggle";
import CategoryGrid from "@/components/CategoryGrid";
import ProductCard from "@/components/ProductCard";
import HeroBanner from "@/components/HeroBanner";
import FlashDeals from "@/components/FlashDeals";
import NearbyShops from "@/components/NearbyShops";
import { useProducts } from "@/hooks/useProducts";
import logo from "@/assets/vyapaaro-logo-new.png";

const Index = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { data: products = [] } = useProducts();

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/shops?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const query = search.toLowerCase().trim();

  const trendingProducts = products.filter((p) => {
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      (p.description?.toLowerCase().includes(query) ?? false)
    );
  }).slice(0, 4);

  return (
    <div className="pb-20 md:pb-8">
      {/* Mobile Header */}
      <div className="md:hidden gradient-primary px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => window.location.href = "/"}>
            <img src={logo} alt="Vyapaaro" className="h-14 w-14 object-contain rounded-xl" />
          </button>
          <ThemeToggle className="text-primary-foreground/70 hover:text-primary-foreground" />
        </div>
        <p className="text-primary-foreground/80 text-sm mb-4">Discover local shops near you</p>
        <SearchBar value={search} onChange={setSearch} onSubmit={handleSearch} />
      </div>

      {/* Desktop Search */}
      <div className="hidden md:block max-w-2xl mx-auto px-4 pt-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-extrabold mb-1">Discover Local Shops</h2>
          <p className="text-muted-foreground mb-4">Find the best shops, products & services near you</p>
          <SearchBar value={search} onChange={setSearch} onSubmit={handleSearch} />
        </motion.div>
      </div>

      <div className="px-4 mt-6 max-w-5xl mx-auto space-y-8">
        <HeroBanner />
        <CategoryGrid />
        <FlashDeals searchQuery={search} />
        <NearbyShops searchQuery={search} />

        {trendingProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Trending Products</h2>
              <Link to="/shops" className="text-xs font-semibold text-primary">View All →</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {trendingProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
