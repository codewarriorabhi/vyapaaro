
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric NOT NULL,
  original_price numeric,
  image text NOT NULL DEFAULT '',
  images text[] DEFAULT '{}',
  category text NOT NULL,
  in_stock boolean NOT NULL DEFAULT true,
  rating numeric NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  description text DEFAULT '',
  specifications jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view products of active shops
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = products.shop_id AND shops.is_active = true)
  );

-- Shop owners can insert products for their own shops
CREATE POLICY "Shop owners can insert products" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid())
  );

-- Shop owners can update their own products
CREATE POLICY "Shop owners can update products" ON public.products
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid())
  );

-- Shop owners can delete their own products
CREATE POLICY "Shop owners can delete products" ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = products.shop_id AND shops.owner_id = auth.uid())
  );

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
