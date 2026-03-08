
-- Reviews table
CREATE TABLE public.shop_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL DEFAULT '',
  owner_reply text,
  owner_reply_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (shop_id, user_id)
);

ALTER TABLE public.shop_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Anyone can read reviews"
  ON public.shop_reviews FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can insert their own review
CREATE POLICY "Users can insert own reviews"
  ON public.shop_reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON public.shop_reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON public.shop_reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Shop owners can update owner_reply on their shop's reviews
CREATE POLICY "Shop owners can reply to reviews"
  ON public.shop_reviews FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = shop_reviews.shop_id AND shops.owner_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = shop_reviews.shop_id AND shops.owner_id = auth.uid())
  );

-- Trigger for updated_at
CREATE TRIGGER update_shop_reviews_updated_at
  BEFORE UPDATE ON public.shop_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get shop average rating
CREATE OR REPLACE FUNCTION public.get_shop_rating(_shop_id uuid)
RETURNS TABLE (avg_rating numeric, review_count bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = 'public'
AS $$
  SELECT
    COALESCE(ROUND(AVG(rating)::numeric, 1), 0),
    COUNT(*)
  FROM public.shop_reviews
  WHERE shop_id = _shop_id;
$$;

-- Index for fast queries
CREATE INDEX idx_shop_reviews_shop ON public.shop_reviews (shop_id, created_at DESC);
CREATE INDEX idx_shop_reviews_user ON public.shop_reviews (user_id);
