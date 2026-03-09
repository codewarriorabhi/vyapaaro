
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  items jsonb NOT NULL DEFAULT '[]',
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Customers can create orders
CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Shop owners can view orders for their shops
CREATE POLICY "Shop owners can view shop orders" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = orders.shop_id AND shops.owner_id = auth.uid())
  );

-- Shop owners can update order status for their shops
CREATE POLICY "Shop owners can update shop orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = orders.shop_id AND shops.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = orders.shop_id AND shops.owner_id = auth.uid())
  );

-- Trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
