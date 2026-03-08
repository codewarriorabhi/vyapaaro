import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Mail, MessageSquare, MapPin, Star, Tag, ShoppingBag } from "lucide-react";

const notificationOptions = [
  { key: "email_notifs", label: "Email Notifications", desc: "Receive updates via email", icon: Mail },
  { key: "sms_notifs", label: "SMS Notifications", desc: "Receive updates via SMS", icon: MessageSquare },
  { key: "new_shops_nearby", label: "New Shops Near You", desc: "Get notified when new shops open nearby", icon: MapPin },
  { key: "review_replies", label: "Review Replies", desc: "When someone replies to your review", icon: Star },
  { key: "promo_offers", label: "Promotional Offers", desc: "Deals and discounts from shops", icon: Tag },
  { key: "order_updates", label: "Booking / Order Updates", desc: "Status updates on your orders", icon: ShoppingBag },
];

const NotificationSettings = () => {
  const [settings, setSettings] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(notificationOptions.map((o) => [o.key, true]))
  );

  const toggle = (key: string) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

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
            <Switch id={key} checked={settings[key]} onCheckedChange={() => toggle(key)} />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => toast({ title: "Preferences saved" })}>Save Changes</Button>
        <Button variant="outline" onClick={() => setSettings(Object.fromEntries(notificationOptions.map((o) => [o.key, true])))}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
