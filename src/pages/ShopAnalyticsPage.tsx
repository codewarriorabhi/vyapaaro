import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  ArrowLeft, Eye, MousePointerClick, MessageSquare, PhoneCall,
  MessageCircle, Share2, Loader2, Calendar, TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from "recharts";

interface DailyStats {
  stat_date: string;
  views: number;
  clicks: number;
  inquiries: number;
  calls: number;
  whatsapp_clicks: number;
  shares: number;
}

interface Totals {
  total_views: number;
  total_clicks: number;
  total_inquiries: number;
  total_calls: number;
  total_whatsapp: number;
  total_shares: number;
}

const statMeta = [
  { key: "total_views", label: "Views", icon: Eye, color: "text-primary" },
  { key: "total_clicks", label: "Clicks", icon: MousePointerClick, color: "text-accent" },
  { key: "total_inquiries", label: "Inquiries", icon: MessageSquare, color: "text-primary" },
  { key: "total_calls", label: "Calls", icon: PhoneCall, color: "text-accent" },
  { key: "total_whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-primary" },
  { key: "total_shares", label: "Shares", icon: Share2, color: "text-accent" },
];

const ShopAnalyticsPage = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [days, setDays] = useState("30");
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [shopName, setShopName] = useState("");

  useEffect(() => {
    if (!shopId) return;
    fetchData();
  }, [shopId, days]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, totalsRes, shopRes] = await Promise.all([
        supabase.rpc("get_shop_analytics", { _shop_id: shopId, _days: parseInt(days) }),
        supabase.rpc("get_shop_totals", { _shop_id: shopId, _days: parseInt(days) }),
        supabase.from("shops").select("name").eq("id", shopId!).maybeSingle(),
      ]);

      if (analyticsRes.data) setDailyStats(analyticsRes.data as DailyStats[]);
      if (totalsRes.data && Array.isArray(totalsRes.data) && totalsRes.data.length > 0) {
        setTotals(totalsRes.data[0] as Totals);
      } else {
        setTotals({ total_views: 0, total_clicks: 0, total_inquiries: 0, total_calls: 0, total_whatsapp: 0, total_shares: 0 });
      }
      if (shopRes.data) setShopName(shopRes.data.name);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = dailyStats.map((d) => ({
    date: new Date(d.stat_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    Views: d.views,
    Clicks: d.clicks,
    Inquiries: d.inquiries,
  }));

  return (
    <div className="pb-20 md:pb-8">
      <div className="gradient-primary px-4 py-6 md:py-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/my-shops")}
            className="flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to My Shops
          </button>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary-foreground">
                {shopName || "Shop"} Analytics
              </h1>
              <p className="text-sm text-primary-foreground/80">Track your shop's performance</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary-foreground/70" />
              <Select value={days} onValueChange={setDays}>
                <SelectTrigger className="w-36 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6 space-y-6">
        {/* Stat Cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statMeta.map(({ key, label, icon: Icon, color }) => (
            <Card key={key} className="border-0 shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${color}`} />
                  <TrendingUp className="h-3 w-3 text-accent" />
                </div>
                <p className="text-xl font-extrabold">{totals ? (totals as any)[key]?.toLocaleString() : 0}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Area Chart */}
        <Card className="border-0 shadow-card">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-base font-bold mb-4">Traffic Overview</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="Views" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Clicks" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" strokeWidth={2} />
                  <Area type="monotone" dataKey="Inquiries" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.1)" strokeWidth={2} />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Eye className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm font-medium">No data yet</p>
                <p className="text-xs">Analytics will appear as your shop gets traffic</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart */}
        {chartData.length > 0 && (
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 md:p-6">
              <h3 className="text-base font-bold mb-4">Daily Breakdown</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="Views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Clicks" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Inquiries" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ShopAnalyticsPage;
