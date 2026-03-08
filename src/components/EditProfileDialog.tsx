import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Camera, User } from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(100),
  surname: z.string().trim().max(100),
  phone: z.string().trim().max(20),
  address: z.string().trim().max(500),
});

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    first_name: string;
    surname: string;
    phone: string;
    address: string;
    user_id: string;
    avatar_url?: string;
  } | null;
  onUpdated: () => void;
}

const EditProfileDialog = ({ open, onOpenChange, profile, onUpdated }: EditProfileDialogProps) => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && open) {
      setFirstName(profile.first_name || "");
      setSurname(profile.surname || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
      setAvatarPreview(profile.avatar_url || null);
      setAvatarFile(null);
      setErrors({});
    }
  }, [profile, open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({ title: "Invalid file", description: "Please upload a JPG, PNG, or WebP image.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 2MB.", variant: "destructive" });
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return profile?.avatar_url || null;

    setUploadingAvatar(true);
    try {
      const ext = avatarFile.name.split(".").pop() || "jpg";
      const filePath = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Add cache-bust param
      return `${publicUrl}?t=${Date.now()}`;
    } catch {
      toast({ title: "Upload failed", description: "Could not upload profile picture.", variant: "destructive" });
      return profile?.avatar_url || null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    const result = profileSchema.safeParse({ first_name: firstName, surname, phone, address });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    if (!profile?.user_id) return;

    setSaving(true);
    try {
      const avatarUrl = await uploadAvatar(profile.user_id);

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: result.data.first_name,
          surname: result.data.surname,
          phone: result.data.phone,
          address: result.data.address,
          avatar_url: avatarUrl || "",
        })
        .eq("user_id", profile.user_id);

      if (error) throw error;

      toast({ title: "Profile updated", description: "Your information has been saved." });
      onUpdated();
      onOpenChange(false);
    } catch {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const initials = `${firstName?.[0] || ""}${surname?.[0] || ""}`.toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Avatar upload */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative group"
            >
              <Avatar className="h-20 w-20 border-2 border-border">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Profile" />
                ) : null}
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {initials || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center">Click to upload a profile picture</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} maxLength={100} />
              {errors.first_name && <p className="text-xs text-destructive">{errors.first_name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="surname">Surname</Label>
              <Input id="surname" value={surname} onChange={(e) => setSurname(e.target.value)} maxLength={100} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={500} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving || uploadingAvatar}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || uploadingAvatar}>
              {(saving || uploadingAvatar) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
