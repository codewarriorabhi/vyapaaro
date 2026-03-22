import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Store, Plus, Eye, MousePointerClick, MessageSquare,
  Star, MapPin, Clock, BarChart3, TrendingUp, Loader2,
  Settings, Package, ChevronRight, ArrowLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface ShopRow {
  id: string;
  name: string;
  category: string;
  address: string;
  cover_image: string | null;
  is_active: boolean;
  working_hours: string | null;
  tags: string[] | null;
}

const MyShopsPage = () => {
  const navigate = useNavigate();
  const { user, role, isShopOwner: contextShopOwner, loading: authLoading, fetchRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myShops, setMyShops] = useState<ShopRow[]>([]);
  const [shopStats, setShopStats] = useState<Record<string, { views: number; clicks: number; inquiries: number }>>({});

  useEffect(() => {
    const init = async () => {
      // Debug: Log auth state
      console.log("[MyShopsPage] Init - user:", user?.id);
      console.log("[MyShopsPage] Init - role from context:", role);
      console.log("[MyShopsPage] Init - isShopOwner from context:", contextShopOwner);
      console.log("[MyShopsPage] Init - authLoading:", authLoading);

      // Wait for auth to finish loading
      if (authLoading) {
        console.log("[MyShopsPage] Auth still loading, waiting...");
        return;
      }

      // Check if user is logged in
      if (!user) {
        console.log("[MyShopsPage] No user session, redirecting to login");
        navigate("/login");
        return;
      }

      // Fetch latest role from database to ensure we have the most recent
      await fetchRole();
      console.log("[MyShopsPage] Role after fetchRole:", role);

      // Check if user is a shop owner
      if (!contextShopOwner) {
        console.log("[MyShopsPage] User is NOT a shop owner, role:", role);
        console.log("[MyShopsPage] Access Denied - redirecting to profile");
        toast({ 
          title: "Access Denied", 
          description: `Only shop owners can access this page. Your current role: ${role || 'none'}. Please sign up as a Shop Owner to access this page.`, 
          variant: "destructive" 
        });
        navigate("/profile");
        return;
      }

      console.log("[MyShopsPage] User is a shop owner, allowing access");
      setLoading(false);

      // Fetch owner's shops
      const { data: shops } = await supabase
        .from("shops").select("*")
        .eq("owner_id", session.user.id)
        .order("created_at", { ascending: false });

      const shopList = (shops || []) as ShopRow[];
      setMyShops(shopList);

      // Fetch totals for each shop
      const stats: Record<string, { views: number; clicks: number; inquiries: number }> = {};
      await Promise.all(
        shopList.map(async (shop) => {
          const { data } = await supabase.rpc("get_shop_totals", { _shop_id: shop.id, _days: 30 });
          if (data && Array.isArray(data) && data.length > 0) {
            const d = data[0] as any;
            stats[shop.id] = { views: d.total_views || 0, clicks: d.total_clicks || 0, inquiries: d.total_inquiries || 0 };
          } else {
            stats[shop.id] = { views: 0, clicks: 0, inquiries: 0 };
          }
        })
      );
      setShopStats(stats);
      setLoading(false);
    };
    init();
  }, [navigate, user, role, contextShopOwner, authLoading, fetchRole]);

  const totalViews = Object.values(shopStats).reduce((a, b) => a + b.views, 0);
  const totalClicks = Object.values(shopStats).reduce((a, b) => a + b.clicks, 0);
  const totalInquiries = Object.values(shopStats).reduce((a, b) => a + b.inquiries, 0);

  const statCards = [
    { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-primary" },
    { label: "Clicks", value: totalClicks.toLocaleString(), icon: MousePointerClick, color: "text-accent" },
    { label: "Inquiries", value: totalInquiries.toLocaleString(), icon: MessageSquare, color: "text-primary" },
    { label: "Shops", value: myShops.length.toString(), icon: Store, color: "text-accent" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!contextShopOwner) return null;

  return (
    <div className="pb-20 md:pb-8">
      <div className="gradient-primary px-4 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate("/profile")} className="flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-3 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Profile
          </button>
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary-foreground">My Shops</h1>
              <p className="text-sm text-primary-foreground/80">Manage your shop listings and track performance</p>
            </motion.div>
            <Button className="gradient-primary border border-primary-foreground/20 text-primary-foreground hover:bg-primary/80 gap-1.5 shadow-lg" onClick={() => navigate("/add-shop")}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Shop</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        {/* Stats Overview */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <TrendingUp className="h-3 w-3 text-accent" />
                </div>
                <p className="text-xl font-extrabold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Shop listings */}
        <div>
          <h2 className="text-lg font-bold mb-3">Your Shops</h2>
          {myShops.length === 0 ? (
            <Card className="border-0 shadow-card">
              <CardContent className="p-8 text-center">
                <Store className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                <p className="font-bold mb-1">No shops yet</p>
                <p className="text-sm text-muted-foreground mb-4">Add your first shop to start tracking performance</p>
                <Button onClick={() => navigate("/add-shop")} className="gap-1.5">
                  <Plus className="h-4 w-4" /> Add Shop
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myShops.map((shop, i) => {
                const stats = shopStats[shop.id] || { views: 0, clicks: 0, inquiries: 0 };
                return (
                  <motion.div key={shop.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="border-0 shadow-card overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <img
                          src={shop.cover_image || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop"}
                          alt={shop.name}
                          className="w-full sm:w-40 h-36 sm:h-auto object-cover"
                          loading="lazy"
                        />
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-bold text-base">{shop.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={shop.is_active ? "default" : "secondary"} className={`text-[10px] ${shop.is_active ? "gradient-primary border-0" : ""}`}>
                                  {shop.is_active ? "Active" : "Inactive"}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{shop.category}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                            <MapPin className="h-3 w-3" /><span>{shop.address}</span>
                          </div>
                          {shop.working_hours && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                              <Clock className="h-3 w-3" /><span>{shop.working_hours}</span>
                            </div>
                          )}

                          {/* Mini stats */}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{stats.views} views</span>
                            <span className="flex items-center gap-1"><MousePointerClick className="h-3 w-3" />{stats.clicks} clicks</span>
                            <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{stats.inquiries} inquiries</span>
                          </div>

                          <Separator className="mb-3" />

                          <div className="flex items-center gap-2 flex-wrap">
                            <Button size="sm" variant="outline" className="gap-1 text-xs h-8" onClick={() => navigate(`/shop/${shop.id}`)}>
                              <Eye className="h-3.5 w-3.5" /> View
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 text-xs h-8" onClick={() => toast({ title: "Coming Soon", description: "Edit shop feature is coming soon!" })}>
                              <Settings className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 text-xs h-8" onClick={() => navigate(`/shop/${shop.id}/products`)}>
                              <Package className="h-3.5 w-3.5" /> Products
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 text-xs h-8" onClick={() => navigate(`/shop/${shop.id}/analytics`)}>
                              <BarChart3 className="h-3.5 w-3.5" /> Analytics
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Package, label: "Manage Products", desc: "Add, edit, or remove products from your catalog" },
              { icon: MessageSquare, label: "View Inquiries", desc: "See customer questions and respond" },
              { icon: BarChart3, label: "Performance Reports", desc: "Detailed analytics and insights" },
              { icon: Settings, label: "Shop Settings", desc: "Update shop info, hours, and photos" },
            ].map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                onClick={() => toast({ title: "Coming Soon", description: `${action.label} will be available soon!` })}
                className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-card hover:shadow-card-hover transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyShopsPage;
