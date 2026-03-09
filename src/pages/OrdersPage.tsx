import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Loader2, Package, ShoppingBag, Clock, CheckCircle2, XCircle, Truck,
} from "lucide-react";
import logo from "@/assets/vyapaaro-logo-new.png";

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  shop_id: string;
  items: OrderItem[];
  status: string;
  total: number;
  created_at: string;
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500/10 text-yellow-600" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "bg-accent/10 text-accent" },
  processing: { label: "Processing", icon: Truck, color: "bg-primary/10 text-primary" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "bg-accent/10 text-accent" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-destructive/10 text-destructive" },
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({ title: "Please log in", variant: "destructive" });
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Orders fetch error:", error);
        setOrders([]);
      } else {
        setOrders((data ?? []) as Order[]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="gradient-primary px-4 pt-8 pb-6 rounded-b-3xl">
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </button>
        <div className="flex items-center gap-3">
          <img src={logo} alt="Vyapaaro" className="h-12 w-12 rounded-xl object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">My Orders</h1>
            <p className="text-primary-foreground/70 text-sm">Track and manage your orders</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4 space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">Loading orders...</span>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground mb-4">
              Start shopping to see your orders here
            </p>
            <Button onClick={() => navigate("/shops")}>
              Explore Shops
            </Button>
          </motion.div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const status = order.status || "pending";
              const config = statusConfig[status] || statusConfig.pending;
              const StatusIcon = config.icon;
              const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              });
              const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="shadow-card border-0">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Order</p>
                          <p className="text-sm font-mono font-semibold">{order.id.slice(0, 8)}</p>
                        </div>
                        <Badge className={`${config.color} border-0 gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </div>

                      <div className="space-y-1.5">
                        {items.map((p, j) => (
                          <div key={j} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Package className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {p.name || p.product_id} × {p.quantity}
                              </span>
                            </div>
                            {p.price && (
                              <span className="text-xs">₹{(p.price * p.quantity).toLocaleString("en-IN")}</span>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">{formattedDate}</span>
                        <span className="text-sm font-bold text-primary">
                          ₹{Number(order.total).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
