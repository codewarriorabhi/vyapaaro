import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { categories } from "@/data/mockData";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Store, MapPin, Clock, Phone, MessageSquare,
  Camera, X, Loader2, ImagePlus, Tag,
} from "lucide-react";
import logo from "@/assets/vyapaaro-logo-new.png";

const MAX_PHOTOS = 6;

const AddShopPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/login");
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data?.role !== "shop_owner") {
        toast({ title: "Access Denied", description: "Only shop owners can add shops.", variant: "destructive" });
        navigate("/profile");
        return;
      }
      setUserId(session.user.id);
      setAuthChecking(false);
    };
    checkAccess();
  }, [navigate]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 8) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_PHOTOS - photoFiles.length;
    const newFiles = files.slice(0, remaining);

    if (files.length > remaining) {
      toast({ title: "Limit reached", description: `Max ${MAX_PHOTOS} photos allowed.`, variant: "destructive" });
    }

    const previews = newFiles.map((f) => URL.createObjectURL(f));
    setPhotoFiles((prev) => [...prev, ...newFiles]);
    setPhotoPreviews((prev) => [...prev, ...previews]);
    if (e.target) e.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviews[index]);
    setPhotoFiles((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (shopId: string): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of photoFiles) {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${shopId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("shop-photos").upload(path, file);
      if (error) {
        console.error("Upload error:", error);
        continue;
      }
      const { data: urlData } = supabase.storage.from("shop-photos").getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category || !address.trim()) {
      toast({ title: "Missing fields", description: "Name, category, and address are required.", variant: "destructive" });
      return;
    }
    if (!userId) return;

    setLoading(true);
    try {
      // First insert shop to get ID
      const { data: shop, error: insertError } = await supabase
        .from("shops")
        .insert({
          owner_id: userId,
          name: name.trim(),
          category,
          description: description.trim(),
          address: address.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim(),
          working_hours: workingHours.trim(),
          tags,
          photos: [],
          cover_image: "",
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      // Upload photos and update
      if (photoFiles.length > 0 && shop) {
        const photoUrls = await uploadPhotos(shop.id);
        await supabase
          .from("shops")
          .update({ photos: photoUrls, cover_image: photoUrls[0] || "" })
          .eq("id", shop.id);
      }

      toast({ title: "Shop Created! 🎉", description: "Your shop has been registered successfully." });
      navigate("/my-shops");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to create shop.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <div className="gradient-primary px-4 pt-8 pb-6 rounded-b-3xl">
        <button
          onClick={() => navigate("/my-shops")}
          className="flex items-center gap-1 text-primary-foreground/80 text-sm mb-3"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Shops
        </button>
        <div className="flex items-center gap-3">
          <img src={logo} alt="Vyapaaro" className="h-12 w-12 rounded-xl object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">Add New Shop</h1>
            <p className="text-primary-foreground/70 text-sm">Register your business on Vyapaaro</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-card">
            <CardContent className="pt-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Shop Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="shop-name" className="text-sm flex items-center gap-1.5">
                    <Store className="h-3.5 w-3.5 text-muted-foreground" /> Shop Name *
                  </Label>
                  <Input
                    id="shop-name"
                    placeholder="e.g. Sharma Textiles"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <Label className="text-sm">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="shop-desc" className="text-sm">Description</Label>
                  <Textarea
                    id="shop-desc"
                    placeholder="Tell customers about your shop..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground text-right">{description.length}/500</p>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="shop-address" className="text-sm flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> Address *
                  </Label>
                  <Textarea
                    id="shop-address"
                    placeholder="Full shop address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    maxLength={300}
                    rows={2}
                  />
                </div>

                {/* Phone & WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="shop-phone" className="text-sm flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" /> Phone
                    </Label>
                    <Input
                      id="shop-phone"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      maxLength={20}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="shop-whatsapp" className="text-sm flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" /> WhatsApp
                    </Label>
                    <Input
                      id="shop-whatsapp"
                      placeholder="+919876543210"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      maxLength={20}
                    />
                  </div>
                </div>

                {/* Working Hours */}
                <div className="space-y-1.5">
                  <Label htmlFor="shop-hours" className="text-sm flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Working Hours
                  </Label>
                  <Input
                    id="shop-hours"
                    placeholder="e.g. 10:00 AM - 9:00 PM"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    maxLength={100}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <Label className="text-sm flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" /> Tags
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag (e.g. Ethnic Wear)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleAddTag(); }
                      }}
                      maxLength={30}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleAddTag} className="shrink-0">
                      Add
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">{tags.length}/8 tags</p>
                </div>

                {/* Photos */}
                <div className="space-y-1.5">
                  <Label className="text-sm flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-muted-foreground" /> Shop Photos
                  </Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {photoPreviews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                        <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(i)}
                          className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        {i === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-foreground text-[10px] text-center py-0.5">
                            Cover
                          </span>
                        )}
                      </div>
                    ))}
                    {photoFiles.length < MAX_PHOTOS && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ImagePlus className="h-5 w-5" />
                        <span className="text-[10px]">Add Photo</span>
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />
                  <p className="text-xs text-muted-foreground">{photoFiles.length}/{MAX_PHOTOS} photos · First photo is cover</p>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Register Shop
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AddShopPage;
