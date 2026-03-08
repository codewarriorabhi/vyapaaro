
-- Fix: Recreate view with security_invoker
DROP VIEW IF EXISTS public.shop_daily_stats;
CREATE VIEW public.shop_daily_stats
WITH (security_invoker = on) AS
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

-- Fix: Tighten INSERT policy to only allow valid shop_ids
DROP POLICY "Anyone can insert shop events" ON public.shop_events;
CREATE POLICY "Anyone can insert shop events"
  ON public.shop_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.shops WHERE shops.id = shop_events.shop_id AND shops.is_active = true)
  );
