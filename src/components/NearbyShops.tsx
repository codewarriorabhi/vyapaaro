import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Loader2, Navigation, AlertCircle } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { api } from "@/lib/api";
import ShopCard from "@/components/ShopCard";
import { Button } from "@/components/ui/button";
import { shops as mockShops } from "@/data/mockData";

interface NearbyShop {
  id: string;
  name: string;
  category: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  distance?: string;
  address: string;
  isOpen?: boolean;
  tags?: string[];
  phone?: string;
  whatsapp?: string;
  workingHours?: string;
  description?: string;
  priceLevel?: 1 | 2 | 3;
}

interface NearbyShopsProps {
  searchQuery?: string;
}

const NearbyShops = ({ searchQuery = "" }: NearbyShopsProps) => {
  const { latitude, longitude, loading: locationLoading, error: locationError, permission, requestLocation, isSupported } = useGeolocation();
  
  const [shops, setShops] = useState<NearbyShop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Request location on mount if permission is already granted
  useEffect(() => {
    if (permission === "granted") {
      requestLocation();
    }
  }, [permission, requestLocation]);

  // Fetch nearby shops when we have coordinates
  useEffect(() => {
    const fetchNearbyShops = async () => {
      if (!latitude || !longitude) return;

      setLoading(true);
      setError(null);
      setUsingFallback(false);

      const response = await api.get<NearbyShop[] | { shops: NearbyShop[]; data: NearbyShop[] }>(
        `/shops/nearby`,
        { lat: latitude, lng: longitude }
      );

      if (response.error) {
        console.warn("Nearby API failed, using fallback:", response.error);
        // Use mock data as fallback
        setShops(mockShops.slice(0, 6));
        setUsingFallback(true);
      } else if (response.data) {
        let shopData: NearbyShop[] = [];
        if (Array.isArray(response.data)) {
          shopData = response.data;
        } else if (Array.isArray((response.data as any).shops)) {
          shopData = (response.data as any).shops;
        } else if (Array.isArray((response.data as any).data)) {
          shopData = (response.data as any).data;
        }
        setShops(shopData);
      }

      setLoading(false);
    };

    fetchNearbyShops();
  }, [latitude, longitude]);

  // Filter shops by search query
  const query = searchQuery.toLowerCase().trim();
  const filteredShops = shops.filter((s) => {
    if (!s.isOpen && s.isOpen !== undefined) return false;
    if (!query) return true;
    return (
      s.name.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query) ||
      (s.tags || []).some((t) => t.toLowerCase().includes(query)) ||
      s.address.toLowerCase().includes(query)
    );
  });

  // If no location yet and permission not denied, show prompt
  if (!latitude && !longitude && permission !== "denied" && !locationLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Nearby Shops</h2>
          <Link to="/shops" className="text-xs font-semibold text-primary">View All →</Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6 text-center"
        >
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Discover shops near you</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enable location access to find the best shops in your area
          </p>
          <Button onClick={requestLocation} className="gap-2" disabled={!isSupported}>
            <Navigation className="h-4 w-4" />
            Enable Location
          </Button>
        </motion.div>
      </section>
    );
  }

  // Loading location
  if (locationLoading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Nearby Shops</h2>
          <Link to="/shops" className="text-xs font-semibold text-primary">View All →</Link>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-sm text-muted-foreground">Getting your location...</span>
        </div>
      </section>
    );
  }

  // Location denied
  if (permission === "denied" || locationError) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Nearby Shops</h2>
          <Link to="/shops" className="text-xs font-semibold text-primary">View All →</Link>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium mb-1">Location access denied</p>
              <p className="text-xs text-muted-foreground mb-3">
                {locationError || "Enable location in your browser settings to discover nearby shops"}
              </p>
              <Button variant="outline" size="sm" onClick={requestLocation}>
                Try Again
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  // Loading shops
  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Nearby Shops</h2>
          <Link to="/shops" className="text-xs font-semibold text-primary">View All →</Link>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span className="text-sm text-muted-foreground">Finding nearby shops...</span>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Nearby Shops</h2>
          {usingFallback && (
            <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
              Demo
            </span>
          )}
        </div>
        <Link to="/shops" className="text-xs font-semibold text-primary">View All →</Link>
      </div>
      
      {filteredShops.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium mb-1">No shops found nearby</p>
          <p className="text-xs text-muted-foreground">
            {searchQuery ? "Try a different search" : "Check back later for new shops"}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredShops.map((shop, i) => (
            <ShopCard
              key={shop.id}
              shop={{
                ...shop,
                image: shop.image || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
                rating: shop.rating || 0,
                reviewCount: shop.reviewCount || 0,
                distance: shop.distance || "N/A",
                isOpen: shop.isOpen ?? true,
                tags: shop.tags || [],
              }}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default NearbyShops;
