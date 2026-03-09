import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft, ShoppingBag, Minus, Plus, Loader2, CheckCircle, Trash2, Package,
} from "lucide-react";
import logo from "@/assets/vyapaaro-logo-new.png";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const shopId = searchParams.get("shopId") || "";
  const shopName = searchParams.get("shopName") || "Shop";

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const pid = searchParams.get("productId");
    const pname = searchParams.get("productName");
    const pprice = searchParams.get("price");
    const pimage = searchParams.get("image");
    if (pid && pname && pprice) {
      return [{
        productId: pid,
        name: pname,
        price: parseFloat(pprice),
        image: pimage || undefined,
        quantity: 1,
      }];
    }
    return [];
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        toast({ title: "Please log in", description: "You need to be logged in to place orders.", variant: "destructive" });
        navigate("/login");
        return;
      }
      setUserId(session.user.id);
    });
  }, [navigate]);

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!userId || cart.length === 0) return;

    setLoading(true);
    try {
      const items = cart.map((item) => ({
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      }));

      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: userId,
          shop_id: shopId,
          items: items as any,
          total,
          status: "pending",
        })
        .select("id")
        .single();

      if (error) throw error;

      setOrderId(data.id);
      setOrderPlaced(true);
      toast({ title: "Order Placed! 🎉", description: "Your order has been submitted successfully." });
    } catch (err: any) {
      toast({ title: "Order Failed", description: err.message || "Failed to place order.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-card text-center">
            <CardContent className="pt-10 pb-8 space-y-5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="mx-auto w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center"
              >
                <CheckCircle className="h-10 w-10 text-accent" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground">Order Confirmed!</h2>
              <p className="text-muted-foreground text-sm">
                Your order has been placed successfully.
              </p>
              {orderId && (
                <div className="bg-muted rounded-lg px-4 py-2 inline-block">
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="text-sm font-mono font-semibold">{orderId.slice(0, 8)}</p>
                </div>
              )}
              <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
                <p className="text-xs font-medium text-foreground">Order Summary</p>
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => navigate("/orders")}>
                  View Orders
                </Button>
                <Button className="flex-1" onClick={() => navigate("/")}>
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="gradient-primary px-4 pt-8 pb-6 rounded-b-3xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <img src={logo} alt="Vyapaaro" className="h-12 w-12 rounded-xl object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">Place Order</h1>
            <p className="text-primary-foreground/70 text-sm">From {shopName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4">
        <Card className="shadow-card">
          <CardContent className="pt-5 pb-4">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-primary" /> Your Items
            </h3>
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Your cart is empty</p>
                <Button variant="link" size="sm" onClick={() => navigate(-1)}>
                  Go back to add products
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1">{item.name}</p>
                      <p className="text-xs text-primary font-bold">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.productId, -1)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, 1)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors ml-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {cart.length > 0 && (
          <Card className="shadow-card">
            <CardContent className="pt-5 pb-5 space-y-3">
              <h3 className="text-sm font-semibold">Order Summary</h3>
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary text-lg">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <Button
                className="w-full h-12 text-base font-semibold mt-2"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Place Order
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlaceOrderPage;
