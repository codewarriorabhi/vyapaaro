import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useSavedItems } from "@/contexts/SavedItemsContext";
import { products } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";

const SavedPage = () => {
  const { savedProductIds } = useSavedItems();
  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));

  return (
    <div className="pb-20 md:pb-8 px-4 pt-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-extrabold mb-1">Saved</h1>
      <p className="text-sm text-muted-foreground mb-8">Your favorite shops and products</p>

      {savedProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-bold text-lg">No saved items yet</h2>
          <p className="text-sm text-muted-foreground text-center mt-1 max-w-xs">
            Tap the heart icon on shops or products to save them for later
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3"
        >
          {savedProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default SavedPage;
