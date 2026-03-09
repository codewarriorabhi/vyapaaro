import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Clock, Phone, MessageCircle, Heart, Navigation, Share2 } from "lucide-react";
import { shops } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import ShopReviews from "@/components/ShopReviews";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trackShopEvent } from "@/hooks/useShopTracking";
import { useShopProducts } from "@/hooks/useProducts";

const ShopProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const shop = shops.find((s) => s.id === id);
  const { data: shopProducts = [] } = useShopProducts(id);
  const [isOwner, setIsOwner] = useState(false);

  // Track shop view
  useEffect(() => {
    if (id) trackShopEvent(id, "view");
  }, [id]);

  // Check if current user owns this shop
  useEffect(() => {
    const checkOwner = async () => {
      if (!id) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data } = await supabase
        .from("shops")
        .select("owner_id")
        .eq("id", id)
        .maybeSingle();
      if (data?.owner_id === session.user.id) setIsOwner(true);
    };
    checkOwner();
  }, [id]);

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
          <button className="w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center" onClick={() => { if (id) trackShopEvent(id, "share"); }}>
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
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { window.open(`tel:${shop.phone}`); if (id) trackShopEvent(id, "call"); }}>
            <Phone className="h-4 w-4" /> Call
          </Button>
          <Button size="sm" className="gap-1.5 gradient-primary border-0" onClick={() => { window.open(`https://wa.me/${shop.whatsapp}`); if (id) trackShopEvent(id, "whatsapp"); }}>
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { window.open(`https://maps.google.com/?q=${encodeURIComponent(shop.address)}`); if (id) trackShopEvent(id, "click"); }}>
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
          <h2 className="text-lg font-bold mb-3">Reviews & Ratings</h2>
          {id && <ShopReviews shopId={id} isOwner={isOwner} />}
        </section>
      </div>
    </div>
  );
};

export default ShopProfile;
