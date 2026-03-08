import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, XCircle, Loader2, User } from "lucide-react";

interface AccountSettingsProps {
  profile: any;
  user: any;
  onProfileUpdated: () => void;
}

const AccountSettings = ({ profile, user, onProfileUpdated }: AccountSettingsProps) => {
  const [form, setForm] = useState({
    first_name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || "",
        surname: profile.surname || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      await supabase
        .from("profiles")
        .update({ avatar_url: `${publicUrl}?t=${Date.now()}` })
        .eq("user_id", user.id);

      toast({ title: "Avatar updated" });
      onProfileUpdated();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: form.first_name,
          surname: form.surname,
          phone: form.phone,
          address: form.address,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      toast({ title: "Profile updated successfully" });
      onProfileUpdated();
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const initials = profile
    ? `${profile.first_name?.[0] || ""}${profile.surname?.[0] || ""}`.toUpperCase()
    : "";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Account Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your personal information</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative group">
          <Avatar className="h-20 w-20 border-2 border-border">
            {profile?.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt="Avatar" />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {initials || <User className="h-8 w-8" />}
            </AvatarFallback>
          </Avatar>
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            {uploading ? (
              <Loader2 className="h-5 w-5 text-white animate-spin" />
            ) : (
              <Camera className="h-5 w-5 text-white" />
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
          </label>
        </div>
        <div>
          <p className="font-semibold">Profile Photo</p>
          <p className="text-xs text-muted-foreground">Click to upload a new photo</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="surname">Last Name</Label>
          <Input id="surname" value={form.surname} onChange={(e) => setForm({ ...form, surname: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="flex items-center gap-2">
            <Input id="email" value={form.email} disabled className="flex-1 bg-muted/50" />
            {profile?.email_verified ? (
              <Badge variant="outline" className="text-accent border-accent gap-1 shrink-0">
                <CheckCircle className="h-3 w-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="text-destructive border-destructive gap-1 shrink-0">
                <XCircle className="h-3 w-3" /> Unverified
              </Badge>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex items-center gap-2">
            <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="flex-1" />
            {profile?.phone_verified ? (
              <Badge variant="outline" className="text-accent border-accent gap-1 shrink-0">
                <CheckCircle className="h-3 w-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="text-destructive border-destructive gap-1 shrink-0">
                <XCircle className="h-3 w-3" /> Unverified
              </Badge>
            )}
          </div>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Full Address</Label>
          <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Changes
        </Button>
        <Button variant="outline" onClick={() => profile && setForm({
          first_name: profile.first_name || "",
          surname: profile.surname || "",
          email: profile.email || "",
          phone: profile.phone || "",
          address: profile.address || "",
        })}>
          Cancel
        </Button>
        <Button variant="outline" onClick={() => toast({ title: "Coming soon", description: "Password change will be available soon." })}>
          Change Password
        </Button>
      </div>
    </div>
  );
};

export default AccountSettings;
