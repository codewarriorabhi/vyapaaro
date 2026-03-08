import { Star, MapPin } from "lucide-react";
import { Shop } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useShopRating } from "@/hooks/useShopRating";

interface ShopCardProps {
  shop: Shop;
  index?: number;
}

const ShopCard = ({ shop, index = 0 }: ShopCardProps) => {
  const navigate = useNavigate();
  const dbRating = useShopRating(shop.id);

  const rating = dbRating ? dbRating.avg_rating : shop.rating;
  const reviewCount = dbRating ? dbRating.review_count : shop.reviewCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={() => navigate(`/shop/${shop.id}`)}
      className="flex gap-3 p-3 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all cursor-pointer"
    >
      <img
        src={shop.image}
        alt={shop.name}
        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm truncate">{shop.name}</h3>
          <Badge
            variant={shop.isOpen ? "default" : "secondary"}
            className={`text-[10px] px-1.5 py-0 flex-shrink-0 ${shop.isOpen ? "gradient-primary border-0" : ""}`}
          >
            {shop.isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Star className="h-3 w-3 fill-primary text-primary" />
          <span className="text-xs font-semibold">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{shop.distance} • {shop.address}</span>
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {shop.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ShopCard;
