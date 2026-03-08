import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, Mail, Phone, Star, MessageSquare, Loader2 } from "lucide-react";
import { useUserSettings } from "@/hooks/useUserSettings";

const privacyOptions = [
  { key: "public_profile" as const, label: "Public Profile Visibility", desc: "Allow others to see your profile", icon: Eye },
  { key: "show_email" as const, label: "Show Email Address", desc: "Display your email on your profile", icon: Mail },
  { key: "show_phone" as const, label: "Show Phone Number", desc: "Display your phone number on your profile", icon: Phone },
  { key: "show_reviews" as const, label: "Review Visibility", desc: "Make your reviews visible to others", icon: Star },
  { key: "allow_contact" as const, label: "Allow Shop Owners to Contact", desc: "Let shop owners reach out to you", icon: MessageSquare },
];

const PrivacySettings = () => {
  const { settings, loading, saving, saveSettings, updateLocal } = useUserSettings();

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

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
            <Switch id={key} checked={settings[key]} onCheckedChange={(v) => updateLocal({ [key]: v })} />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={() => saveSettings({
          public_profile: settings.public_profile,
          show_email: settings.show_email,
          show_phone: settings.show_phone,
          show_reviews: settings.show_reviews,
          allow_contact: settings.allow_contact,
        })} disabled={saving}>
          {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
        </Button>
        <Button variant="outline" disabled={saving}>Cancel</Button>
      </div>
    </div>
  );
};

export default PrivacySettings;
