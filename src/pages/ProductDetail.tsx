import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Heart, Share2, ShoppingBag, MessageCircle, Flag } from "lucide-react";
import { products, shops, reviews } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const shop = product ? shops.find((s) => s.id === product.shopId) : null;
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const allImages = product.images || [product.image];
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="pb-24 md:pb-8">
      {/* Image Carousel */}
      <div className="relative">
        <motion.img
          key={activeImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={allImages[activeImage]}
          alt={product.name}
          className="w-full aspect-square md:aspect-video md:max-h-[500px] object-cover"
        />
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
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {allImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === activeImage ? "bg-primary-foreground" : "bg-primary-foreground/40"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-extrabold">{product.name}</h1>
            {product.inStock ? (
              <Badge className="gradient-primary border-0 flex-shrink-0">In Stock</Badge>
            ) : (
              <Badge variant="destructive" className="flex-shrink-0">Out of Stock</Badge>
            )}
          </div>

          <div className="flex items-center gap-1 mt-2">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-semibold">{product.rating}</span>
            <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mt-3">
            <span className="text-3xl font-extrabold">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                <Badge variant="secondary" className="text-accent font-bold">{discount}% off</Badge>
              </>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{product.description}</p>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div className="mt-6">
              <h2 className="text-base font-bold mb-2">Specifications</h2>
              <div className="bg-card rounded-xl shadow-card divide-y divide-border">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shop info */}
          {shop && (
            <button
              onClick={() => navigate(`/shop/${shop.id}`)}
              className="flex items-center gap-3 mt-6 p-3 bg-card rounded-xl shadow-card w-full text-left"
            >
              <img src={shop.image} alt={shop.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <span className="text-sm font-bold">{shop.name}</span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span>{shop.rating} • {shop.distance}</span>
                </div>
              </div>
              <span className="text-xs text-primary font-semibold">Visit Shop →</span>
            </button>
          )}

          {/* Reviews */}
          <section className="mt-8">
            <h2 className="text-base font-bold mb-3">Reviews</h2>
            <div className="space-y-3">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-card rounded-xl p-3 shadow-card">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{review.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold flex-1">{review.userName}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Report */}
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground mt-6 mb-4">
            <Flag className="h-3 w-3" /> Report this product
          </button>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 px-4 py-3 bg-card/90 backdrop-blur border-t border-border">
        <div className="max-w-3xl mx-auto flex gap-3">
          {shop && (
            <>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => window.open(`https://wa.me/${shop.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}`)}`)}
              >
                <MessageCircle className="h-4 w-4" /> Enquire
              </Button>
              <Button className="flex-1 gap-2 gradient-primary border-0" onClick={() => navigate(`/shop/${shop.id}`)}>
                <ShoppingBag className="h-4 w-4" /> Visit Shop
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
