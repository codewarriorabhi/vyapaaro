import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, Mail, Phone, Star, MessageSquare } from "lucide-react";

const privacyOptions = [
  { key: "public_profile", label: "Public Profile Visibility", desc: "Allow others to see your profile", icon: Eye },
  { key: "show_email", label: "Show Email Address", desc: "Display your email on your profile", icon: Mail },
  { key: "show_phone", label: "Show Phone Number", desc: "Display your phone number on your profile", icon: Phone },
  { key: "show_reviews", label: "Review Visibility", desc: "Make your reviews visible to others", icon: Star },
  { key: "allow_contact", label: "Allow Shop Owners to Contact", desc: "Let shop owners reach out to you", icon: MessageSquare },
];

const PrivacySettings = () => {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    public_profile: true,
    show_email: false,
    show_phone: false,
    show_reviews: true,
    allow_contact: true,
  });

  const toggle = (key: string) => setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Privacy Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Control who can see your information</p>
      </div>

      <div className="space-y-1">
        {privacyOptions.map(({ key, label, desc, icon: Icon }) => (
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
        <Button onClick={() => toast({ title: "Privacy settings saved" })}>Save Changes</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </div>
  );
};

export default PrivacySettings;
