import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, MapPin, Star, Tag, ShoppingBag, Loader2 } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";

const notificationOptions = [
  { key: "email_notifs" as const, label: "Email Notifications", desc: "Receive updates via email", icon: Mail },
  { key: "sms_notifs" as const, label: "SMS Notifications", desc: "Receive updates via SMS", icon: MessageSquare },
  { key: "new_shops_nearby" as const, label: "New Shops Near You", desc: "Get notified when new shops open nearby", icon: MapPin },
  { key: "review_replies" as const, label: "Review Replies", desc: "When someone replies to your review", icon: Star },
  { key: "promo_offers" as const, label: "Promotional Offers", desc: "Deals and discounts from shops", icon: Tag },
  { key: "order_updates" as const, label: "Booking / Order Updates", desc: "Status updates on your orders", icon: ShoppingBag },
];

const NotificationSettings = () => {
  const { settings, loading, saving, saveSettings, updateLocal } = useUserSettings();

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Notification Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Choose what notifications you receive</p>
      </div>

      <div className="space-y-1">
        {notificationOptions.map(({ key, label, desc, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <Label htmlFor={key} className="font-medium cursor-pointer">{label}</Label>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
            <Switch id={key} checked={settings[key]} onCheckedChange={(v) => updateLocal({ [key]: v })} />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => saveSettings({
          email_notifs: settings.email_notifs,
          sms_notifs: settings.sms_notifs,
          new_shops_nearby: settings.new_shops_nearby,
          review_replies: settings.review_replies,
          promo_offers: settings.promo_offers,
          order_updates: settings.order_updates,
        })} disabled={saving}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
        </Button>
        <Button variant="outline" disabled={saving}>Cancel</Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
