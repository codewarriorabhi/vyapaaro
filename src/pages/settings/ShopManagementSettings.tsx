import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Store, Image, Package, Star, Tag, BarChart3, CheckCircle } from "lucide-react";

const shopActions = [
  { icon: Store, label: "Edit Shop Profile", desc: "Update your shop information", action: "edit-shop" },
  { icon: Image, label: "Upload Shop Images", desc: "Add or update shop photos", action: "upload-images" },
  { icon: Package, label: "Manage Product Listings", desc: "Add, edit, or remove products", action: "products" },
  { icon: Star, label: "Manage Customer Reviews", desc: "View and respond to reviews", action: "reviews" },
  { icon: Tag, label: "Upload Offers & Promotions", desc: "Create deals for your customers", action: "offers" },
  { icon: BarChart3, label: "View Shop Analytics", desc: "Track views, clicks, and inquiries", action: "analytics" },
  { icon: CheckCircle, label: "Shop Verification Status", desc: "Check your shop's verification", action: "verification" },
];

const ShopManagementSettings = () => {
  const navigate = useNavigate();

  const handleAction = (action: string) => {
    if (action === "products") {
      navigate("/my-shops");
    } else {
      toast({ title: "Coming soon", description: "This feature will be available soon." });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Shop Management</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your shop listings and settings</p>
      </div>

      <div className="space-y-1">
        {shopActions.map(({ icon: Icon, label, desc, action }) => (
          <button
            key={action}
            onClick={() => handleAction(action)}
            className="flex items-center gap-3 w-full p-4 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopManagementSettings;
