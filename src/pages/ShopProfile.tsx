import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Clock, Phone, MessageCircle, Heart, Navigation, Share2 } from "lucide-react";
import { shops, products, reviews } from "@/data/mockData";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ShopProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const shop = shops.find((s) => s.id === id);
  const shopProducts = products.filter((p) => p.shopId === id);

  if (!shop) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Shop not found</p>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-8">
      {/* Hero */}
      <div className="relative">
        <img src={shop.image} alt={shop.name} className="w-full h-56 md:h-72 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center">
            <Heart className="h-4 w-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-extrabold text-primary-foreground">{shop.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`text-xs ${shop.isOpen ? "gradient-primary border-0" : ""}`} variant={shop.isOpen ? "default" : "secondary"}>
              {shop.isOpen ? "Open Now" : "Closed"}
            </Badge>
            <div className="flex items-center gap-1 text-primary-foreground/90 text-sm">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="font-semibold">{shop.rating}</span>
              <span>({shop.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 max-w-3xl mx-auto">
        {/* Info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-3">
          {shop.description && <p className="text-sm text-muted-foreground">{shop.description}</p>}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{shop.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{shop.workingHours}</span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2 mt-5">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(`tel:${shop.phone}`)}>
            <Phone className="h-4 w-4" /> Call
          </Button>
          <Button size="sm" className="gap-1.5 gradient-primary border-0" onClick={() => window.open(`https://wa.me/${shop.whatsapp}`)}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(shop.address)}`)}>
            <Navigation className="h-4 w-4" /> Directions
          </Button>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-5 flex-wrap">
          {shop.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>

        {/* Products */}
        {shopProducts.length > 0 && (
          <section className="mt-8">
            <h2 className="text-lg font-bold mb-3">Products & Services</h2>
            <div className="grid grid-cols-2 gap-3">
              {shopProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section className="mt-8">
          <h2 className="text-lg font-bold mb-3">Reviews</h2>
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card rounded-xl p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{review.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{review.userName}</span>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShopProfile;
