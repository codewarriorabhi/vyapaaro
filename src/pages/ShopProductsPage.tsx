import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft, Package, Plus, Loader2, ImagePlus, X,
  IndianRupee, Box, Tag, Search, PackageOpen,
} from "lucide-react";
import logo from "@/assets/vyapaaro-logo-new.png";

interface Product {
  id: string;
  productName: string;
  name?: string;
  price: number;
  description?: string;
  image?: string;
  stock?: number;
  category?: string;
  inStock?: boolean;
}

const ShopProductsPage = () => {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();

  const [authChecking, setAuthChecking] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Add product form state
  const [formLoading, setFormLoading] = useState(false);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth check
  useEffect(() => {
    const check = async () => {
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
        toast({ title: "Access Denied", description: "Only shop owners can manage products.", variant: "destructive" });
        navigate("/profile");
        return;
      }
      setAuthChecking(false);
    };
    check();
  }, [navigate]);

  // Fetch products
  useEffect(() => {
    if (authChecking || !shopId) return;

    const fetchProducts = async () => {
      setLoading(true);
      const response = await api.get<Product[] | { products: Product[]; data: Product[] }>(
        `/products/shop/${shopId}`
      );

      if (response.error) {
        console.warn("Products API error:", response.error);
        setProducts([]);
      } else if (response.data) {
        let productData: Product[] = [];
        if (Array.isArray(response.data)) {
          productData = response.data;
        } else if (Array.isArray((response.data as any).products)) {
          productData = (response.data as any).products;
        } else if (Array.isArray((response.data as any).data)) {
          productData = (response.data as any).data;
        }
        setProducts(productData);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [authChecking, shopId]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setProductName("");
    setPrice("");
    setDescription("");
    setStock("");
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !price) {
      toast({ title: "Missing fields", description: "Product name and price are required.", variant: "destructive" });
      return;
    }

    setFormLoading(true);
    try {
      // Upload image if provided
      let imageUrl = "";
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `products/${shopId}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("shop-photos").upload(path, imageFile);
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("shop-photos").getPublicUrl(path);
          imageUrl = urlData.publicUrl;
        }
      }

      const response = await api.post<Product>("/products/add", {
        productName: productName.trim(),
        price: parseFloat(price),
        description: description.trim(),
        image: imageUrl,
        stock: stock ? parseInt(stock) : 0,
        shopId,
      });

      if (response.error) throw new Error(response.error);

      toast({ title: "Product Added! 🎉", description: `${productName} has been added to your shop.` });

      // Add to local state
      if (response.data) {
        setProducts((prev) => [response.data!, ...prev]);
      } else {
        // Refetch if no data returned
        setProducts((prev) => [
          {
            id: crypto.randomUUID(),
            productName: productName.trim(),
            price: parseFloat(price),
            description: description.trim(),
            image: imageUrl,
            stock: stock ? parseInt(stock) : 0,
          },
          ...prev,
        ]);
      }

      resetForm();
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add product.", variant: "destructive" });
    } finally {
      setFormLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const name = (p.productName || p.name || "").toLowerCase();
    return name.includes(q) || (p.description?.toLowerCase().includes(q) ?? false);
  });

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Vyapaaro" className="h-12 w-12 rounded-xl object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">Products</h1>
              <p className="text-primary-foreground/70 text-sm">Manage your shop's catalog</p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary border border-primary-foreground/20 text-primary-foreground hover:bg-primary/80 gap-1.5 shadow-lg">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Product</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Add New Product
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4 mt-2">
                {/* Product Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="prod-name" className="text-sm flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" /> Product Name *
                  </Label>
                  <Input
                    id="prod-name"
                    placeholder="e.g. Banarasi Silk Saree"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    maxLength={120}
                  />
                </div>

                {/* Price */}
                <div className="space-y-1.5">
                  <Label htmlFor="prod-price" className="text-sm flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" /> Price (₹) *
                  </Label>
                  <Input
                    id="prod-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 1999"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="prod-desc" className="text-sm">Description</Label>
                  <Textarea
                    id="prod-desc"
                    placeholder="Describe your product..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    rows={3}
                  />
                </div>

                {/* Stock */}
                <div className="space-y-1.5">
                  <Label htmlFor="prod-stock" className="text-sm flex items-center gap-1.5">
                    <Box className="h-3.5 w-3.5 text-muted-foreground" /> Stock Quantity
                  </Label>
                  <Input
                    id="prod-stock"
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                {/* Image */}
                <div className="space-y-1.5">
                  <Label className="text-sm flex items-center gap-1.5">
                    <ImagePlus className="h-3.5 w-3.5 text-muted-foreground" /> Product Image
                  </Label>
                  {imagePreview ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          URL.revokeObjectURL(imagePreview);
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-background/80 rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ImagePlus className="h-8 w-8" />
                      <span className="text-xs">Click to upload image</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </div>

                <Button type="submit" className="w-full h-11" disabled={formLoading}>
                  {formLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Add Product
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Product count */}
        {!loading && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? "s" : ""}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-sm text-muted-foreground">Loading products...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <PackageOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-bold mb-1">
              {products.length === 0 ? "No products yet" : "No matching products"}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {products.length === 0
                ? "Start by adding your first product to the catalog"
                : "Try a different search term"}
            </p>
            {products.length === 0 && (
              <Button onClick={() => setDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" /> Add First Product
              </Button>
            )}
          </motion.div>
        )}

        {/* Product grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredProducts.map((product, i) => {
                const displayName = product.productName || product.name || "Untitled";
                const inStock = product.inStock ?? (product.stock !== undefined ? product.stock > 0 : true);

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-shadow">
                      <div className="relative aspect-[4/3] bg-muted">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={displayName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground/40" />
                          </div>
                        )}
                        <Badge
                          className={`absolute top-2 right-2 text-[10px] ${
                            inStock
                              ? "bg-accent/90 text-accent-foreground border-0"
                              : "bg-destructive/90 text-destructive-foreground border-0"
                          }`}
                        >
                          {inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm line-clamp-1 mb-1">{displayName}</h3>
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            ₹{product.price.toLocaleString("en-IN")}
                          </span>
                          {product.stock !== undefined && (
                            <span className="text-xs text-muted-foreground">
                              Stock: {product.stock}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopProductsPage;
