import { DbProduct } from "@/hooks/useProducts";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: DbProduct;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const navigate = useNavigate();
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all cursor-pointer overflow-hidden"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-square object-cover"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 gradient-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
            {discount}% OFF
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold truncate">{product.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-xs font-medium">{product.rating}</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-base font-bold">₹{product.price.toLocaleString()}</span>
          {product.original_price && (
            <span className="text-xs text-muted-foreground line-through">₹{product.original_price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
