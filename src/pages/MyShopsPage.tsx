import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  Store, Plus, Eye, MousePointerClick, MessageSquare,
  Star, MapPin, Clock, BarChart3, TrendingUp, Loader2,
  Settings, Package, ChevronRight, ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { shops as mockShops } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

const statCards = [
  { label: "Total Views", value: "1,247", icon: Eye, trend: "+12%", color: "text-primary" },
  { label: "Clicks", value: "389", icon: MousePointerClick, trend: "+8%", color: "text-accent" },
  { label: "Inquiries", value: "64", icon: MessageSquare, trend: "+23%", color: "text-primary" },
  { label: "Avg Rating", value: "4.5", icon: Star, trend: "+0.2", color: "text-accent" },
];

const MyShopsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isShopOwner, setIsShopOwner] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/login");
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data?.role === "shop_owner") {
        setIsShopOwner(true);
      } else {
        toast({
          title: "Access Denied",
          description: "Only shop owners can access this page. Please register as a shop owner.",
          variant: "destructive",
        });
        navigate("/profile");
      }
      setLoading(false);
    };
    checkRole();
  }, [navigate]);

  // Use first 2 mock shops as "owned" shops for demo
  const myShops = mockShops.slice(0, 2);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isShopOwner) return null;

  return (
    <div className="pb-20 md:pb-8">
      {/* Header */}
      <div className="gradient-primary px-4 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Profile
          </button>
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary-foreground">
                My Shops
              </h1>
              <p className="text-sm text-primary-foreground/80">
                Manage your shop listings and track performance
              </p>
            </motion.div>
            <Button
              className="gradient-primary border border-primary-foreground/20 text-primary-foreground hover:bg-primary/80 gap-1.5 shadow-lg"
              onClick={() => navigate("/add-shop")}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Shop</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {statCards.map((stat, i) => (
            <Card key={stat.label} className="border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-[10px] font-semibold text-accent bg-accent/10 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}
                  </span>
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
          <div className="space-y-4">
            {myShops.map((shop, i) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-card overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <img
                      src={shop.image}
                      alt={shop.name}
                      className="w-full sm:w-40 h-36 sm:h-auto object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-bold text-base">{shop.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={shop.isOpen ? "default" : "secondary"}
                              className={`text-[10px] ${shop.isOpen ? "gradient-primary border-0" : ""}`}
                            >
                              {shop.isOpen ? "Open" : "Closed"}
                            </Badge>
                            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-primary text-primary" />
                              <span className="font-semibold text-foreground">{shop.rating}</span>
                              <span>({shop.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{shop.address}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                        <Clock className="h-3 w-3" />
                        <span>{shop.workingHours}</span>
                      </div>

                      <Separator className="mb-3" />

                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs h-8"
                          onClick={() => navigate(`/shop/${shop.id}`)}
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs h-8"
                          onClick={() =>
                            toast({ title: "Coming Soon", description: "Edit shop feature is coming soon!" })
                          }
                        >
                          <Settings className="h-3.5 w-3.5" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs h-8"
                          onClick={() => navigate(`/shop/${shop.id}/products`)}
                        >
                          <Package className="h-3.5 w-3.5" /> Products
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-xs h-8"
                          onClick={() =>
                            toast({ title: "Coming Soon", description: "Analytics dashboard is coming soon!" })
                          }
                        >
                          <BarChart3 className="h-3.5 w-3.5" /> Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
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
                onClick={() =>
                  toast({ title: "Coming Soon", description: `${action.label} will be available soon!` })
                }
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
