import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(100),
  surname: z.string().trim().max(100),
  phone: z.string().trim().max(20),
  address: z.string().trim().max(500),
});

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    first_name: string;
    surname: string;
    phone: string;
    address: string;
    user_id: string;
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

  useEffect(() => {
    if (profile && open) {
      setFirstName(profile.first_name || "");
      setSurname(profile.surname || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
      setErrors({});
    }
  }, [profile, open]);

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
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: result.data.first_name,
          surname: result.data.surname,
          phone: result.data.phone,
          address: result.data.address,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
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
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
