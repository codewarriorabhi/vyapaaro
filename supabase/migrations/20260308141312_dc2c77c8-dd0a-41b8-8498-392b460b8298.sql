
-- Shop events table to track views, clicks, inquiries
CREATE TABLE public.shop_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('view', 'click', 'inquiry', 'call', 'whatsapp', 'share')),
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (even anonymous for view tracking)
CREATE POLICY "Anyone can insert shop events"
  ON public.shop_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Shop owners can view events for their own shops
CREATE POLICY "Shop owners can view own shop events"
  ON public.shop_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = shop_events.shop_id
      AND shops.owner_id = auth.uid()
    )
  );

-- Daily aggregated stats view for performance
CREATE OR REPLACE VIEW public.shop_daily_stats AS
SELECT
  shop_id,
  date_trunc('day', created_at)::date AS stat_date,
  COUNT(*) FILTER (WHERE event_type = 'view') AS views,
  COUNT(*) FILTER (WHERE event_type = 'click') AS clicks,
  COUNT(*) FILTER (WHERE event_type = 'inquiry') AS inquiries,
  COUNT(*) FILTER (WHERE event_type = 'call') AS calls,
  COUNT(*) FILTER (WHERE event_type = 'whatsapp') AS whatsapp_clicks,
  COUNT(*) FILTER (WHERE event_type = 'share') AS shares
FROM public.shop_events
GROUP BY shop_id, date_trunc('day', created_at)::date;

-- Summary function for a shop owner
CREATE OR REPLACE FUNCTION public.get_shop_analytics(
  _shop_id uuid,
  _days int DEFAULT 30
)
RETURNS TABLE (
  stat_date date,
  views bigint,
  clicks bigint,
  inquiries bigint,
  calls bigint,
  whatsapp_clicks bigint,
  shares bigint
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = 'public'
AS $$
  SELECT
    date_trunc('day', created_at)::date AS stat_date,
    COUNT(*) FILTER (WHERE event_type = 'view') AS views,
    COUNT(*) FILTER (WHERE event_type = 'click') AS clicks,
    COUNT(*) FILTER (WHERE event_type = 'inquiry') AS inquiries,
    COUNT(*) FILTER (WHERE event_type = 'call') AS calls,
    COUNT(*) FILTER (WHERE event_type = 'whatsapp') AS whatsapp_clicks,
    COUNT(*) FILTER (WHERE event_type = 'share') AS shares
  FROM public.shop_events
  WHERE shop_id = _shop_id
    AND created_at >= now() - (_days || ' days')::interval
  GROUP BY date_trunc('day', created_at)::date
  ORDER BY stat_date ASC;
$$;

-- Totals function
CREATE OR REPLACE FUNCTION public.get_shop_totals(
  _shop_id uuid,
  _days int DEFAULT 30
)
RETURNS TABLE (
  total_views bigint,
  total_clicks bigint,
  total_inquiries bigint,
  total_calls bigint,
  total_whatsapp bigint,
  total_shares bigint
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = 'public'
AS $$
  SELECT
    COUNT(*) FILTER (WHERE event_type = 'view'),
    COUNT(*) FILTER (WHERE event_type = 'click'),
    COUNT(*) FILTER (WHERE event_type = 'inquiry'),
    COUNT(*) FILTER (WHERE event_type = 'call'),
    COUNT(*) FILTER (WHERE event_type = 'whatsapp'),
    COUNT(*) FILTER (WHERE event_type = 'share')
  FROM public.shop_events
  WHERE shop_id = _shop_id
    AND created_at >= now() - (_days || ' days')::interval;
$$;

-- Index for fast queries
CREATE INDEX idx_shop_events_shop_date ON public.shop_events (shop_id, created_at DESC);
