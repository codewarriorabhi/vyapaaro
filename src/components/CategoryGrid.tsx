import { motion } from "framer-motion";
import { categories } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-lg font-bold mb-3">Browse Categories</h2>
      <div className="grid grid-cols-4 gap-3">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(`/shops?category=${cat.id}`)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card shadow-card hover:shadow-card-hover transition-shadow"
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="text-xs font-semibold text-foreground leading-tight text-center">{cat.name}</span>
            <span className="text-[10px] text-muted-foreground">{cat.count} shops</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
