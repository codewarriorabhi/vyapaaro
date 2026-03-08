
-- Create shops table
CREATE TABLE public.shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  description text DEFAULT '',
  address text NOT NULL,
  phone text DEFAULT '',
  whatsapp text DEFAULT '',
  working_hours text DEFAULT '',
  tags text[] DEFAULT '{}',
  photos text[] DEFAULT '{}',
  cover_image text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Anyone can view active shops
CREATE POLICY "Anyone can view active shops"
ON public.shops FOR SELECT
USING (is_active = true);

-- Shop owners can insert their own shops
CREATE POLICY "Shop owners can insert own shops"
ON public.shops FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = owner_id
  AND public.has_role(auth.uid(), 'shop_owner')
);

-- Shop owners can update their own shops
CREATE POLICY "Shop owners can update own shops"
ON public.shops FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Shop owners can delete their own shops
CREATE POLICY "Shop owners can delete own shops"
ON public.shops FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Auto-update updated_at
CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON public.shops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for shop photos
INSERT INTO storage.buckets (id, name, public) VALUES ('shop-photos', 'shop-photos', true);

-- Storage policies for shop photos
CREATE POLICY "Anyone can view shop photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'shop-photos');

CREATE POLICY "Authenticated users can upload shop photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'shop-photos');

CREATE POLICY "Users can update their own shop photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'shop-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can delete their own shop photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'shop-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
